import React from "react";
import HeaderComponent from "../../components/Header/HeaderComponent";
import { useParams } from "react-router";
import { GardenTitle } from "../../components/DetailedGardenInfo/GardenTitle";
import { DetailedGardenInfo } from "../../components/DetailedGardenInfo/DetailedGardenInfo";
import IrrigationModeSection from "../../components/DetailedGardenInfo/IrrigationModeSection";
import FooterComponent from "../../components/FooterComponent/FooterComponent";

function DetailedGarden() {
  const { gardenId } = useParams();
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <HeaderComponent />
      <div className="flex-grow">
        <GardenTitle
          gardenName={`Garden ${gardenId}`}
          areaGardenName="Khu vực 1"
        />
        <DetailedGardenInfo className="ml-8" gardenId={gardenId} />
        <IrrigationModeSection />
      </div>
      <FooterComponent />
    </div>
  );
}

export default DetailedGarden;
