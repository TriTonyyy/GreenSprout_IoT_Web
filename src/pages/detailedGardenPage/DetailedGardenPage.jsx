import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useNavigate, useParams } from "react-router";
import { GardenTitle,GardenTitleSkeleton } from "../../pages/detailedGardenPage/detailGardenPageComponents/GardenTitle";
import { DetailedGardenInfo } from "../../pages/detailedGardenPage/detailGardenPageComponents/DetailedGardenInfo";
import IrrigationModeSection from "../../pages/detailedGardenPage/detailGardenPageComponents/IrrigationModeSection";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import { getUserInfoAPI } from "../../api/AuthApi";
import {
  removeDevicePopup,
  renameDevicePopup,
} from "../../components/Alert/alertComponent";
import { getGardenByDevice } from "../../api/deviceApi";

function DetailedGarden() {
  const { gardenId } = useParams();
  const [user, setUser] = useState(null);
  const [data, setData] = useState();
  const navigate = useNavigate();

  const fetchUser = async () => {
    const user = await getUserInfoAPI();
    setUser(user.data);
  };

  const fetchGardenData = async () => {
    const gardenData = await getGardenByDevice(gardenId);
    // console.log(gardenData.data);
    setData(gardenData.data);
  };

  const handleEdit = () => {
    renameDevicePopup(gardenId,data.name_area) // ✅ pass fetchGardenData here
      .then(() => {
        fetchGardenData(); // ✅ refresh garden data instead of user info
      })
      .catch((err) => {
        if (err !== "cancelled") {
          // console.error("Rename failed:", err);
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
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
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
          <DetailedGardenInfo deviceData={data} />
          <IrrigationModeSection />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
