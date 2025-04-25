import React, { useState, useEffect } from "react";
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
import { getReportOfDeviceByDate } from "../../api/reportApi";

function StatisticsDashboard() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [selectedGarden, setSelectedGarden] = useState(deviceId || null);
  const [gardens, setGardens] = useState([]);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingGardens, setLoadingGardens] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [selectedMode, setSelectedMode] = useState("day");

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

  const fetchReport = async (mode, time) => {
    if (!selectedGarden) return;

    setLoading(true);
    try {
      console.log(mode);
      console.log(time);
      const response = await getReportOfDeviceByDate(selectedGarden, {
        date: time,
      });

      const reports = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const sortedReports = reports.sort(
        (a, b) => new Date(b.time_created) - new Date(a.time_created)
      );
      checkReportData(sortedReports); // Handles both real and null data
      setError(null);
    } catch (err) {
      setError(`Failed to fetch sensor data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkReportData = (reportData) => {
    console.log(reportData);
    if (reportData.length !== 0) {
      setReportData(reportData[0]);
    } else {
      setReportData({
        humidity_avg: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        luminosity_avg: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        moisture_avg: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        stream_avg: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        tempurature_avg: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        water_usage: 0.0,
      });
    }
  };
  const handleRefresh = () => {
    const defaultDate = new Date().toISOString().split("T")[0];
    const defaultMode = "day";

    setSelectedDate(defaultDate);
    setSelectedMode(defaultMode);

    fetchReport(defaultDate, defaultMode);
  };

  const handleGardenChange = (gardenId) => {
    setSelectedGarden(gardenId);
    navigate(`/statistics/${gardenId}`);
  };

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

  const handleModeChange = (newMode) => {
    setSelectedMode(newMode);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    console.log(reportData);
    console.log(sensorData);
  };

  useEffect(() => {
    fetchReport(selectedMode, selectedDate);
  }, [selectedMode, selectedDate, selectedGarden]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent gardens={gardens} />
      <div className="flex">
        <SideNavigationBar />
        <main className="flex-1">
          <div className="m-10">
            <StatisticsHeader />
            <StatisticsControls
              onRefresh={handleRefresh}
              gardens={gardens}
              selectedGarden={selectedGarden}
              onGardenChange={handleGardenChange}
              loadingGardens={loadingGardens}
              onDateChange={handleDateChange}
              onModeChange={handleModeChange}
            />
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
}

export default StatisticsDashboard;
