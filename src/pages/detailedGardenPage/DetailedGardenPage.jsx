import React, { useEffect, useState, useCallback } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useNavigate, useParams } from "react-router";
import {
  GardenTitle,
  GardenTitleSkeleton,
} from "./detailGardenPageComponents/GardenTitle";
import { DetailedGardenInfo } from "./detailGardenPageComponents/DetailedGardenInfo";
import IrrigationModeSection from "./detailGardenPageComponents/IrrigationModeSection";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import { getUserInfoAPI } from "../../api/authApi";
import {
  removeDevicePopup,
  renameDevicePopup,
  apiResponseHandler,
  selectNewOwnerPopup,
} from "../../components/Alert/alertComponent";
import { getGardenby, getGardenByDevice, getMemberByIdDevice, removeMemberByIdDevice, addMemberByIdDevice } from "../../api/deviceApi";

function DetailedGarden() {
  const { gardenId } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [allGardens, setAllGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchGardenData = useCallback(async () => {
    if (!gardenId) {
      setError("Invalid garden ID");
      return;
    }

    try {
      const response = await getGardenByDevice(gardenId);
      if (response?.data) {
        const device = response.data || {};
        const result = await getMemberByIdDevice(gardenId);
        device.members = result.members || [];
        setData(device);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching garden data:", error);
      if (error.response?.status === 404) {
        setError("Garden not found");
        navigate("/home");
      } else {
        setError("Failed to load garden data");
      }
    } finally {
      setLoading(false);
    }
  }, [gardenId, navigate]);

  const fetchUser = useCallback(async () => {
    try {
      const response = await getUserInfoAPI();
      if (response?.data) {
        setUser(response.data);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user data");
    }
  }, []);

  const fetchAllGardens = useCallback(async () => {
    try {
      const response = await getGardenby();
      const deviceIds = response?.data || [];

      const gardensPromises = deviceIds.map(async (deviceId) => {
        try {
          const res = await getGardenByDevice(deviceId);
          return res?.data || null;
        } catch (err) {
          console.error(`Failed to fetch garden ${deviceId}:`, err);
          return null;
        }
      });

      const gardens = await Promise.all(gardensPromises);
      setAllGardens(gardens.filter((garden) => garden !== null));
      setError(null);
    } catch (error) {
      console.error("Failed to fetch gardens:", error);
      setError("Failed to load gardens list");
      setAllGardens([]);
    }
  }, []);

  const handleEdit = async () => {
    try {
      await renameDevicePopup(gardenId, data.name_area);
      fetchGardenData(); // Refresh data after rename
    } catch (error) {
      if (error !== "cancelled") {
        console.error("Error renaming device:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      const isOwner = data.members?.some(m => m.role === "owner");
      const totalMembers = data.members?.length || 0;

      // If owner is leaving and there are other members
      if (isOwner && totalMembers > 1) {
        try {
          // First, select new owner
          const newOwner = await selectNewOwnerPopup(data.members);
          
          // Update the new owner's role first
          await addMemberByIdDevice(gardenId, {
            userId: newOwner.userId,
            role: "owner"
          });

          // Then remove the current owner
          await removeMemberByIdDevice(gardenId, data.members.find(m => m.role === "owner").userId);
          apiResponseHandler("Bạn đã rời khỏi khu vườn thành công", "success");
          navigate("/home");
        } catch (error) {
          if (error === 'cancelled') return;
          apiResponseHandler("Không thể thay đổi chủ vườn", "error");
        }
      } else {
        // For non-owners or owner leaving empty garden
        await removeMemberByIdDevice(gardenId, data.members.find(m => m.role === "owner").userId);
        apiResponseHandler("Bạn đã rời khỏi khu vườn thành công", "success");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error leaving garden:", error);
      apiResponseHandler("Không thể rời khỏi khu vườn", "error");
    }
  };

  useEffect(() => {
    if (!gardenId) {
      setError("Invalid garden ID");
      navigate("/home");
      return;
    }

    let pollInterval;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchUser(), fetchGardenData(), fetchAllGardens()]);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setError("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up polling interval
    pollInterval = setInterval(fetchGardenData, 5000);

    // Clean up interval on unmount
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [gardenId, fetchUser, fetchGardenData, fetchAllGardens, navigate]);

  const isOwner = data?.members?.some(
    (member) => member.userId === user?._id && member.role === "owner"
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeaderComponent gardens={allGardens} />
      <div className="flex flex-grow">
        <SideNavigationBar />
        <div className="flex-grow">
          {loading ? (
            <GardenTitleSkeleton />
          ) : data ? (
            <>
              <GardenTitle
                gardenName={data.name_area}
                areaGardenName="Thông tin khu vườn"
                onEdit={isOwner ? handleEdit : null}
                onDelete={handleDelete}
                isOwner={isOwner}
                deviceId={gardenId}
              />
            </>
          ) : null}
          <DetailedGardenInfo deviceId={gardenId} />
          <IrrigationModeSection deviceId={gardenId} isOwner={isOwner} />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
