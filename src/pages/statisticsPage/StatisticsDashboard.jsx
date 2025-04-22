import React, { useState, useEffect } from "react";
import { endOfDay, startOfDay } from "date-fns";
import HeaderComponent from "../../components/Header/HeaderComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import { getGardenByDevice, getGardenby } from "../../api/deviceApi";
import { sensorLabels, colors } from "./constants";
import StatisticsHeader from "./statisticPageComponents/StatisticsHeader";
import StatisticsSummary from "./statisticPageComponents/StatisticsSummary";
import StatisticsChart from "./statisticPageComponents/StatisticsChart";
import StatisticsControls from "./statisticPageComponents/StatisticsControls";
import ErrorMessage from "./statisticPageComponents/ErrorMessage";
import { useParams, useNavigate } from "react-router";
import { getReportByDevice } from "../../api/reportApi";

const StatisticsDashboard = () => {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [selectedGarden, setSelectedGarden] = useState(deviceId || null);
  const [gardens, setGardens] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingGardens, setLoadingGardens] = useState(true);
  const [reportData, setReportData] = useState(null);

  // Fetch available gardens
  useEffect(() => {
    const fetchGardens = async () => {
      setLoadingGardens(true);
      try {
        const response = await getGardenby();
        const deviceIds = response?.data || [];

        const gardensPromises = deviceIds.map(async (deviceId) => {
          try {
            const res = await getGardenByDevice(deviceId);
            return { ...res?.data, id: deviceId };
          } catch (err) {
            console.error(`Failed to fetch garden ${deviceId}:`, err);
            return null;
          }
        });

        const gardens = await Promise.all(gardensPromises);
        const validGardens = gardens.filter((garden) => garden !== null);

        setGardens(validGardens);

        if (!selectedGarden && validGardens.length > 0) {
          handleGardenChange(validGardens[0].id_esp);
        }
      } catch (err) {
        setError(`Failed to fetch gardens: ${err.message}`);
      } finally {
        setLoadingGardens(false);
      }
    };
    fetchGardens();
  }, [selectedGarden]);

  const fetchReport = async () => {
    if (!selectedGarden) return;

    setLoading(true);
    try {
      const now = new Date();
      const response = await getReportByDevice(
        selectedGarden,
        startOfDay(now),
        endOfDay(now)
      );

      if (!response) throw new Error("No data received from API");

      const reports = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const sortedReports = reports.sort(
        (a, b) => new Date(b.time_created) - new Date(a.time_created)
      );

      setReportData(sortedReports[0]);
      setError(null);
    } catch (err) {
      setError(`Failed to fetch sensor data: ${err.message}`);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchReport();
  };

  const handleGardenChange = (gardenId) => {
    setSelectedGarden(gardenId);
    navigate(`/statistics/${gardenId}`);
  };

  useEffect(() => {
    fetchReport();
    const interval = setInterval(fetchReport, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedGarden]);

  useEffect(() => {
    if (!reportData) return;

    const timeLabels = Array.from(
      { length: 12 },
      (_, i) => `${(i * 2).toString().padStart(2, "0")}:00`
    );

    setSensorData({
      labels: timeLabels,
      datasets: [
        {
          label: sensorLabels["humidity_avg"],
          data: reportData.humidity_avg,
          borderColor: colors["humidity_avg"].border,
          backgroundColor: colors["humidity_avg"].background,
          fill: true,
          spanGaps: true,
          borderWidth: 2,
        },
        {
          label: sensorLabels["tempurature_avg"],
          data: reportData.tempurature_avg,
          borderColor: colors["tempurature_avg"].border,
          backgroundColor: colors["tempurature_avg"].background,
          fill: true,
          spanGaps: true,
          borderWidth: 2,
        },
        {
          label: sensorLabels["luminosity_avg"],
          data: reportData.luminosity_avg,
          borderColor: colors["luminosity_avg"].border,
          backgroundColor: colors["luminosity_avg"].background,
          fill: true,
          spanGaps: true,
          borderWidth: 2,
        },
        {
          label: sensorLabels["soil_moisture_avg"],
          data: reportData.moisture_avg,
          borderColor: colors["soil_moisture_avg"].border,
          backgroundColor: colors["soil_moisture_avg"].background,
          fill: true,
          spanGaps: true,
          borderWidth: 2,
        },
        {
          label: sensorLabels["stream_avg"],
          data: reportData.stream_avg,
          borderColor: colors["stream_avg"].border,
          backgroundColor: colors["stream_avg"].background,
          fill: true,
          spanGaps: true,
          borderWidth: 2,
        },
      ],
    });
  }, [reportData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent gardens={gardens} />
      <div className="flex">
        <SideNavigationBar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <StatisticsHeader />
            <div className="px-4 sm:px-6">
              <StatisticsControls
                onRefresh={handleRefresh}
                gardens={gardens}
                selectedGarden={selectedGarden}
                onGardenChange={handleGardenChange}
                loadingGardens={loadingGardens}
              />
            </div>
            {!loading && reportData && (
              <StatisticsSummary reportData={reportData} />
            )}
            <ErrorMessage error={error} selectedGarden={selectedGarden} />
            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                  <p className="text-gray-600">Đang tải dữ liệu cảm biến...</p>
                </div>
              </div>
            ) : (
              <StatisticsChart
                sensorData={sensorData}
                reportData={reportData}
              />
            )}
          </div>
        </main>
      </div>
      <FooterComponent />
    </div>
  );
};

export default StatisticsDashboard;
