import React, { useState, useEffect, useCallback } from "react";
import { getGardenby, getGardenByDevice } from "../../api/deviceApi";
import HeaderComponent from "../../components/Header/HeaderComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import {
  StatisticItem,
  StatisticItemSkeleton,
} from "./statisticPageComponents/StatisticsItem";
import { getReportByDevice } from "../../api/reportApi";
import i18n from "../../i18n";

const StatisticsPage = () => {
  const [allGardens, setAllGardens] = useState([]);
  const [allReports, setAllReports] = useState({});
  const [loading, setLoading] = useState(true);

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
          if (!res || res.length === 0) return null;

          const latestReport = res.reduce((latest, current) => {
            return new Date(current.time_created) >
              new Date(latest.time_created)
              ? current
              : latest;
          }, res[0]);

          return { deviceId, report: latestReport };
        } catch (err) {
          console.error(`Failed to fetch report for device ${deviceId}`, err);
          return null;
        }
      });

      const reportResults = await Promise.all(reportPromises);
      const reportMap = {};
      reportResults.forEach((r) => {
        if (r) reportMap[r.deviceId] = r.report;
      });

      setAllReports(reportMap); // Set as object for fast lookup
    } catch (err) {
      console.error("Failed to fetch gardens or reports:", err);
      setAllGardens([]);
      setAllReports({});
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllGardens();
      setLoading(false);
    };
    fetchData();
  }, [fetchAllGardens]);

  return (
    <div>
      <HeaderComponent gardens={allGardens} />
      <div className="flex">
        <SideNavigationBar />
        <div className="w-[80%] h-[80%]  flex-grow min-h-screen">
          <div className="flex justify-between items-center p-10">
            <h1 className="text-4xl font-bold">
              <span className="text-green-500">
                {i18n.t("admin_statistic")}
              </span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-4 justify-start p-3">
            {loading ? (
              <>
                <StatisticItemSkeleton />
                <StatisticItemSkeleton />
                <StatisticItemSkeleton />
              </>
            ) : allGardens.length === 0 ? (
              <p>{i18n.t("garden_not_found")}</p>
            ) : (
              allGardens.map((garden, index) => {
                const reportData = allReports[garden.deviceId];
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
