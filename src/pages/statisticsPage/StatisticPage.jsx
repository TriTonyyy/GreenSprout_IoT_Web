import React, { useState, useEffect, useCallback } from "react";
import { getGardenby, getGardenByDevice } from "../../api/deviceApi";
import HeaderComponent from "../../components/Header/HeaderComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import {
  StatisticItem,
  StatisticItemSkeleton,
} from "./statisticPageComponents/StatisticsItem";

const StatisticsPage = () => {
  const [userDevice, setUserDevice] = useState([]);
  const [allGardens, setAllGardens] = useState([]);
  const [error, setError] = useState([]);

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

  const fetchUserDevices = async () => {
    try {
      const deviceResponse = await getGardenby();
      const deviceIds = deviceResponse.data || [];
      if (deviceIds.length === 0) {
        setUserDevice([]); // No devices found
        return;
      }
    } catch (error) {
      console.error(error);
      setUserDevice([]);
    }
  };

  useEffect(() => {
    fetchUserDevices();
    fetchAllGardens();
    console.log(allGardens);
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <HeaderComponent gardens={allGardens} />
      <div className="flex flex-grow">
        <SideNavigationBar />
        <div className="flex-grow p-4">
          <div className="flex flex-wrap gap-4">
            {allGardens === null ? (
              <StatisticItemSkeleton />
            ) : allGardens.length === 0 ? (
              <p>No gardens found.</p>
            ) : (
              allGardens.map((garden, index) => (
                <StatisticItem
                  key={garden.deviceId || index}
                  id={garden.deviceId}
                  name={garden.name_area}
                  img_area={garden.img_area}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default StatisticsPage;
