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
import { getUserInfoAPI } from "../../api/AuthApi";
import {
  removeDevicePopup,
  renameDevicePopup,
  apiResponseHandler,
} from "../../components/Alert/alertComponent";
import { getGardenby, getGardenByDevice } from "../../api/deviceApi";

function DetailedGarden() {
  const { gardenId } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState();
  const [allGardens, setAllGardens] = useState([]);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const user = await getUserInfoAPI();
    setUser(user.data);
  };

  const fetchGardenData = async () => {
    const gardenData = await getGardenByDevice(gardenId);
    setData(gardenData.data);
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
      setAllGardens([]);
    }
  };

  const handleEdit = () => {
    renameDevicePopup(gardenId, data.name_area)
      .then(() => {
        fetchGardenData();
        fetchAllGardens(); // Refresh all gardens data after rename
      })
      .catch((err) => {
        if (err !== "cancelled") {
          console.error("Rename failed:", err);
        }
      });
  };

  const handleDelete = () => {
    removeDevicePopup(gardenId, user._id)
      .then(() => navigate("/home"))
      .catch((err) => {
        if (err !== "Cancelled") console.error(err);
      });
  };

  useEffect(() => {
    fetchUser();
    fetchGardenData();
    fetchAllGardens();
  }, [gardenId]);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent gardens={allGardens} />
      <div className="flex flex-grow">
        <SideNavigationBar />
        <div className="flex-grow">
          {data ? (
            <GardenTitle
              gardenName={`${data.name_area}`}
              areaGardenName="Thông tin khu vườn"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <GardenTitleSkeleton />
          )}
          <DetailedGardenInfo deviceId={gardenId} />
          <IrrigationModeSection deviceId={gardenId} />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
