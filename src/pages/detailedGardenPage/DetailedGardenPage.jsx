import React from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useParams } from "react-router";
import { GardenTitle } from "../../pages/detailedGardenPage/detailGardenPageComponents/GardenTitle";
import { DetailedGardenInfo } from "../../pages/detailedGardenPage/detailGardenPageComponents/DetailedGardenInfo";
import IrrigationModeSection from "../../pages/detailedGardenPage/detailGardenPageComponents/IrrigationModeSection";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";

function DetailedGarden() {
  const { gardenId } = useParams();

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent />
      <div className="flex flex-grow">
        {/* Sidebar on the left */}
        <SideNavigationBar />
        {/* Main Content Area */}
        <div className="flex-grow p-8">
          <GardenTitle
            gardenName={`Khu vườn ${gardenId}`}
            areaGardenName="Thông tin khu vườn"
          />
          <DetailedGardenInfo className="ml-8" deviceId={gardenId} />
          <IrrigationModeSection />
        </div>
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
