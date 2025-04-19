import React, { useState, useEffect, useCallback } from "react";
import { getGardenby, getGardenByDevice } from "../../api/deviceApi";
import HeaderComponent from "../../components/Header/HeaderComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import {
  StatisticItem,
  StatisticItemSkeleton,
} from "./statisticPageComponents/StatisticsItem";
import { getReportByDevice } from "../../api/reportApi"; // Make sure this exists
import i18n from "../../i18n";

const StatisticsPage = () => {
  const [allGardens, setAllGardens] = useState([]);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllGardens = useCallback(async () => {
    try {
      const response = await getGardenby();
      const deviceIds = response?.data || [];
      // Fetch gardens
      const gardensPromises = deviceIds.map(async (deviceId) => {
        try {
          const res = await getGardenByDevice(deviceId);
          return res?.data ? { ...res.data, deviceId } : null;
        } catch (err) {
          console.error(`Failed to fetch garden ${deviceId}:`, err);
          return null;
        }
      });
      const gardens = (await Promise.all(gardensPromises)).filter(Boolean);
      setAllGardens(gardens);
      // Fetch reports
      const reportPromises = deviceIds.map(async (deviceId) => {
        try {
          const res = await getReportByDevice(deviceId); // returns array of reports
          const latestReport = res.reduce((latest, current) => {
            return new Date(current.time_created) >
              new Date(latest.time_created)
              ? current
              : latest;
          }, res[0]);

          return latestReport; // ✅ only return the latest report
        } catch (err) {
          console.error(`Failed to fetch report for device ${deviceId}`, err);
          return null; // Return null if failed
        }
      });
      const reports = await Promise.all(reportPromises);
      console.log(reports);

      setAllReports(reports); // Save them
    } catch (err) {
      console.error("Failed to fetch gardens or reports:", err);
      setError("Failed to load gardens or reports");
      setAllGardens([]);
      setAllReports([]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllGardens(); // already uses deviceIds internally
      setLoading(false);
    };
    fetchData();
  }, [fetchAllGardens]);

  return (
    <div>
      <HeaderComponent gardens={allGardens} />
      <div className="flex">
        {/* Sidebar */}
        <SideNavigationBar />
        {/* Main Content Area */}
        <div className="w-full flex-grow min-h-screen">
          {/* Page Heading */}
          <div className="flex justify-between items-center px-10 py-10">
            <h1 className="text-4xl font-bold">
              <span className="text-green-500">
                Thống kê gần nhất của các khu vườn
              </span>
            </h1>
          </div>
          {/* Garden Statistic Cards */}
          <div className="flex flex-wrap gap-4 justify-center">
            {loading ? (
              <StatisticItemSkeleton />
            ) : allGardens.length === 0 ? (
              <p>No gardens found.</p>
            ) : (
              allGardens.map((garden, index) => {
                const reportData = allReports.find(
                  (r) => r.deviceId === garden.deviceId
                );
                return (
                  <StatisticItem
                    key={garden.deviceId || index}
                    id={garden.deviceId}
                    name={garden.name_area}
                    img_area={garden.img_area}
                    report={reportData}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default StatisticsPage;
