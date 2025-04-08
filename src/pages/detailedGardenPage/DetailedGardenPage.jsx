import React, { useEffect, useState } from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useNavigate, useParams } from "react-router";
import { GardenTitle } from "../../pages/detailedGardenPage/detailGardenPageComponents/GardenTitle";
import { DetailedGardenInfo } from "../../pages/detailedGardenPage/detailGardenPageComponents/DetailedGardenInfo";
import IrrigationModeSection from "../../pages/detailedGardenPage/detailGardenPageComponents/IrrigationModeSection";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import { getUserInfoAPI } from "../../api/AuthApi";
import { removeDevicePopup } from "../../components/Alert/alertComponent";

function DetailedGarden() {
  const { gardenId } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const user = await getUserInfoAPI();
    setUser(user.data);
  };
  const handleEdit = () => {
    // Replace with real logic (e.g. open modal)
    console.log("Editing garden:", gardenId);
    // You might want to set state to open a modal, for example
  };

  const handleDelete = () => {
    removeDevicePopup(gardenId, user._id, () => {
      navigate("/home"); // Redirect after deletion
    });
  };

  useEffect(() => {
    fetchUser(); // Fetch user data when component mounts
  });

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex flex-grow">
        <SideNavigationBar />
        <div className="flex-grow">
          <GardenTitle
            gardenName={`Khu vườn ${gardenId}`}
            areaGardenName="Thông tin khu vườn"
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <DetailedGardenInfo deviceId={gardenId} />
          <IrrigationModeSection />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
