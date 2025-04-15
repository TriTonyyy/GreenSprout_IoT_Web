import React, { useEffect, useState } from "react";
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
} from "../../components/Alert/alertComponent";
import { getGardenby, getGardenByDevice } from "../../api/deviceApi";

function DetailedGarden() {
  const { gardenId } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState();
  const [allGardens, setAllGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const user = await getUserInfoAPI();
      // console.log("User Data:", user.data);
      setUser(user.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to load user data");
    }
  };

  const fetchGardenData = async () => {
    try {
      const gardenData = await getGardenByDevice(gardenId);
      // console.log("Garden Data:", gardenData.data);
      setData(gardenData.data);
    } catch (error) {
      console.error("Error fetching garden data:", error);
      setError("Failed to load garden data");
    }
  };
  const fetchAllGardens = async () => {
    try {
      const response = await getGardenby();
      const deviceIds = response.data || [];

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
    } catch (error) {
      console.error("Failed to fetch gardens:", error);
      setError("Failed to load gardens list");
      setAllGardens([]);
    }
  };  

  const handleEdit = () => {
    renameDevicePopup(gardenId, data.name_area)
      .then(() => {
        fetchGardenData();
        fetchAllGardens();
      })
      .catch((err) => {
        if (err !== "cancelled") {
          console.error("Rename failed:", err);
          setError("Failed to rename garden");
        }
      });
  };

  const handleDelete = () => {
    removeDevicePopup(gardenId, user._id)
      .then(() => navigate("/home"))
      .catch((err) => {
        if (err !== "Cancelled") {
          console.error(err);
          setError("Failed to delete garden");
        }
      });
  };

  useEffect(() => {
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
  }, [gardenId]);



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
    <div className="min-h-screen flex flex-col">
      <HeaderComponent gardens={allGardens} />
      <div className="flex flex-grow">
        <SideNavigationBar />
        <div className="flex-grow">
          {loading ? (
            <GardenTitleSkeleton />
          ) : data ? (
            <>
              <GardenTitle
                gardenName={`${data.name_area}`}
                areaGardenName="Thông tin khu vườn"
                onEdit={handleEdit}
                onDelete={handleDelete}
                isOwner={data.members?.some(member => member.userId === user?._id && member.role === 'owner')}
                deviceId={gardenId}
              />
            </>
          ) : null}
          <DetailedGardenInfo deviceId={gardenId} />
          <IrrigationModeSection deviceId={gardenId} />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
