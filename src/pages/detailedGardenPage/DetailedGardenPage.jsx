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
  apiResponseHandler,
  areUSurePopup,
  renameDevicePopup,
  selectNewOwnerPopup,
} from "../../components/Alert/alertComponent";
import {
  addBlockMember,
  getBlockMember,
  getGardenby,
  getGardenByDevice,
  getMemberByIdDevice,
  removeMemberByIdDevice,
  updateMemberRole,
} from "../../api/deviceApi";
import i18n from "../../i18n";
import { MemberGarden } from "./detailGardenPageComponents/MemberGarden";

function DetailedGarden() {
  const { gardenId } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [allGardens, setAllGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showMemberSection, setShowMemberSection] = useState(false);
  const [blockMember, setBlockMember] = useState(false);

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
        const block = await getBlockMember(gardenId);
        setBlockMember(block.data);
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
        setUser(null);
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

  const handleMember = async () => {
    setShowMemberSection(true);
  };

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
      // Show confirmation popup first
      // console.log(isOwner);
      const confirmRemove = await areUSurePopup(
        "Bạn có chắc chắn muốn rời khỏi khu vườn này?"
      );
      const totalMembers = data.members?.length || 0;
      if (confirmRemove) {
        if (isOwner && totalMembers > 1) {
          try {
            const newOwner = await selectNewOwnerPopup(data.members);
            await removeMemberByIdDevice(gardenId, user._id);
            await updateMemberRole(gardenId, newOwner.userId);
            apiResponseHandler(
              "Bạn đã rời khỏi khu vườn thành công",
              "success"
            );
            navigate("/home");
          } catch (error) {
            if (error === "cancelled") return;
            apiResponseHandler("Không thể thay đổi chủ vườn", "error");
          }
        } else {
          await removeMemberByIdDevice(gardenId, user._id);
          navigate("/home");
          apiResponseHandler("Bạn đã rời khỏi khu vườn thành công", "success");
        }
      }
    } catch (error) {
      if (error === "cancelled") return; // user cancelled confirmation
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

  useEffect(() => {
    const interval = setInterval(() => {
      getMemberByIdDevice(gardenId)
        .then((res) => {
          const allMems = res.members;
          let isHas = false;
          allMems.map((item) => {
            if (item.userId === user._id || user.role === "admin") {
              isHas = true;
            }
          });
          if (isHas === false) {
            apiResponseHandler(
              "Bạn không có quyền truy cập khu vườn này !",
              "error"
            );
            navigate("/home");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (showMemberSection) {
      document.body.style.overflow = "hidden"; // Disable body scroll
    } else {
      document.body.style.overflow = "auto"; // Re-enable body scroll
    }
  }, [showMemberSection]);

  // console.log("data", data.members);
  const isOwner = data?.members?.some(
    (member) => member.isMe && member.role === "owner"
  );

  const onRemoveMember = async (member) => {
    try {
      // First confirmation: Remove member
      const confirmRemove = await areUSurePopup(
        `Bạn có chắc chắn muốn xóa <strong style="color: #dc2626;">${member.name}</strong> khỏi thiết bị?`,
        "warning" // Showing a warning message
      );
      if (confirmRemove) {
        // Second confirmation: Block member
        const confirmBlock = await areUSurePopup(
          `Bạn có muốn thêm <strong style="color: #dc2626;">${member.name}</strong> vào danh sách chặn?`,
          "question" // Showing a question message
        );
        // console.log(confirmBlock);
        if (confirmBlock) {
          // Block member if confirmed
          const removeRes = await removeMemberByIdDevice(
            gardenId,
            member.userId
          );
          const blockRes = await addBlockMember(gardenId, member.userId);
          if (removeRes && blockRes) {
            apiResponseHandler(
              `Đã xóa "${member.name}" khỏi thiết bị`,
              "success"
            );
          }
        } else if (!confirmBlock) {
          const response = await removeMemberByIdDevice(
            gardenId,
            member.userId
          );
          if (response) {
            apiResponseHandler(
              `Đã xóa "${member.name}" khỏi thiết bị`,
              "success"
            );
          }
        }
      } else if (!confirmRemove) {
        // User cancelled the first confirmation
        return;
      }
    } catch (error) {
      if (error === "cancelled") return; // User cancelled the confirmation
      apiResponseHandler("Không thể xóa thành viên", "error");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {i18n.t("retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeaderComponent gardens={allGardens} />
      <div className="flex flex-grow">
        <SideNavigationBar />
        <div className="flex-grow w-[85%]">
          {loading ? (
            <GardenTitleSkeleton />
          ) : data ? (
            <>
              <GardenTitle
                gardenName={data.name_area}
                areaGardenName={i18n.t("garden_info")}
                onEdit={isOwner ? handleEdit : null}
                onDelete={handleDelete}
                onStatistic={() => navigate(`/statistics/${gardenId}`)}
                onMember={handleMember}
                isOwner={isOwner}
                deviceId={gardenId}
              />
            </>
          ) : null}
          {showMemberSection && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl min-h-[600px] flex flex-col items-center overflow-hidden">
                {/* MemberGarden content fills the available space */}
                <div className="flex-grow w-full">
                  {/* {console.log("data", data)} */}
                  <MemberGarden
                    members={data.members}
                    blocks={blockMember}
                    isOwner={isOwner}
                    onRemoveMember={onRemoveMember}
                    deviceId={gardenId}
                  />
                </div>

                {/* OK Button stays at the bottom */}
                <button
                  className="mt-4 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  onClick={() => setShowMemberSection(false)}
                >
                  {i18n.t("done")}
                </button>
              </div>
            </div>
          )}
          <DetailedGardenInfo
            deviceId={gardenId}
            isOwner={isOwner}
            onRemoveMember={onRemoveMember}
          />
          <IrrigationModeSection deviceId={gardenId} isOwner={isOwner} />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
