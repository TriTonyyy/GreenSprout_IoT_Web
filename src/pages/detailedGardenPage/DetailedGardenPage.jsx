import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query for user data
  const { data: user, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await getUserInfoAPI();
      return response.data;
    },
    staleTime: 300000, // Consider data fresh for 5 minutes
  });

  // Query for garden data
  const { data: gardenData, error: gardenError } = useQuery({
    queryKey: ['garden', gardenId],
    queryFn: async () => {
      const response = await getGardenByDevice(gardenId);
      return response.data;
    },
    refetchInterval: 5000, // Refetch every 5 seconds
    staleTime: 2000, // Consider data fresh for 2 seconds
  });

  // Query for all gardens
  const { data: allGardens, error: gardensError } = useQuery({
    queryKey: ['gardens'],
    queryFn: async () => {
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
      return gardens.filter((garden) => garden !== null);
    },
    staleTime: 10000, // Consider data fresh for 10 seconds
  });

  const handleEdit = async () => {
    try {
      await renameDevicePopup(gardenId, gardenData.name_area);
      // Invalidate queries to refetch latest data
      queryClient.invalidateQueries(['garden', gardenId]);
      queryClient.invalidateQueries(['gardens']);
    } catch (err) {
      if (err !== "cancelled") {
        console.error("Rename failed:", err);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await removeDevicePopup(gardenId, user._id);
      navigate("/home");
    } catch (err) {
      if (err !== "Cancelled") {
        console.error(err);
      }
    }
  };

  // Combine all errors
  const error = userError || gardenError || gardensError;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-lg">
          {error.message || "An error occurred while loading data"}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  const isLoading = !user || !gardenData || !allGardens;

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderComponent gardens={allGardens || []} />
      <div className="flex flex-grow">
        <SideNavigationBar />
        <div className="flex-grow">
          {isLoading ? (
            <GardenTitleSkeleton />
          ) : gardenData ? (
            <>
              <GardenTitle
                gardenName={gardenData.name_area}
                areaGardenName="Thông tin khu vườn"
                onEdit={handleEdit}
                onDelete={handleDelete}
                isOwner={gardenData.members?.some(
                  (member) => member.userId === user?._id && member.role === "owner"
                )}
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
