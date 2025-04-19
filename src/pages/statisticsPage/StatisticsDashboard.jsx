import React, { useState, useEffect } from "react";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import HeaderComponent from "../../components/Header/HeaderComponent";
import SideNavigationBar from "../../components/SideNavigationBar/SideNavigationBar";
import FooterComponent from "../../components/FooterComponent/FooterComponent";
import SensorChart from "../../components/Charts/SensorChart";
import { getGardenByDevice, getGardenby } from "../../api/deviceApi";

import StatisticsHeader from "./statisticPageComponents/StatisticsHeader";
import StatisticsControls from "./statisticPageComponents/StatisticsControls";
import StatisticsSummary from "./statisticPageComponents/StatisticsSummary";
import StatisticsChart from "./statisticPageComponents/StatisticsChart";
import ErrorMessage from "./statisticPageComponents/ErrorMessage";
import { timeRanges, sensorTypes } from "./constants";
import { getReport } from "../../api/reportApi";

const StatisticsDashboard = () => {
  const [timeRange, setTimeRange] = useState(timeRanges.WEEK);
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedSensor, setSelectedSensor] = useState("TEMPERATURE");
  const [selectedGarden, setSelectedGarden] = useState(null);
  const [gardens, setGardens] = useState([]);
  const [gardenDevices, setGardenDevices] = useState({});
  const [sensorData, setSensorData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  const [loadingGardens, setLoadingGardens] = useState(true);

  // Generate mock data for testing
  const generateMockData = () => {
    const now = new Date();
    const mockReadings = [];

    for (let i = 0; i < 20; i++) {
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - i * 8);
      mockReadings.push({
        timestamp: timestamp.toISOString(),
        type: selectedSensor.toLowerCase(),
        value: Math.random() * 100,
        unit: sensorTypes[selectedSensor].unit,
      });
    }

    return mockReadings;
  };

  const fetchReport = async () => {
    // const response = await getReport(selectedGarden);
    // return response.data;
  };

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
            return {
              ...res?.data,
              id: deviceId,
            };
          } catch (err) {
            console.error(`Failed to fetch garden ${deviceId}:`, err);
            return null;
          }
        });

        const gardens = await Promise.all(gardensPromises);
        const validGardens = gardens.filter((garden) => garden !== null);

        setGardens(validGardens);
        if (validGardens.length > 0) {
          const firstGarden = validGardens[0];
          const firstGardenId = firstGarden.id_esp;
          setSelectedGarden(firstGardenId);
        }
      } catch (err) {
        console.error("Error fetching gardens:", err);
        setError(`Failed to fetch gardens: ${err.message}`);
      } finally {
        setLoadingGardens(false);
      }
    };
    fetchGardens();
    fetchReport();
  }, []);

  // Fetch garden device data when garden selection changes
  useEffect(() => {
    const fetchGardenDevice = async () => {
      if (!selectedGarden) return;

      setLoading(true);
      try {
        const response = await getGardenByDevice(selectedGarden);
        if (!response.data) {
          throw new Error("No data received from the server");
        }

        setGardenDevices((prev) => ({
          ...prev,
          [selectedGarden]: response.data,
        }));
        setError(null);
      } catch (err) {
        console.error("Error fetching garden device data:", err);
        setError(
          `Failed to fetch garden device data: Request failed with status code 404`
        );
        setGardenDevices((prev) => {
          const newDevices = { ...prev };
          delete newDevices[selectedGarden];
          return newDevices;
        });
      } finally {
        setLoading(false);
      }
    };

    if (selectedGarden && !gardenDevices[selectedGarden]) {
      fetchGardenDevice();
    }
  }, [selectedGarden]);

  // Process sensor data
  useEffect(() => {
    const processSensorData = () => {
      if (!selectedGarden && !useMockData) return;

      setLoading(true);
      try {
        let sensorDataArray;

        if (useMockData) {
          sensorDataArray = generateMockData();
        } else {
          const deviceData = gardenDevices[selectedGarden];
          if (!deviceData?.sensorData) {
            sensorDataArray = generateMockData();
            setUseMockData(true);
          } else {
            sensorDataArray = deviceData.sensorData;
          }
        }

        const typeToSearch = selectedSensor.toLowerCase();
        const filteredData = sensorDataArray.filter((reading) => {
          if (!reading.timestamp || reading.value === undefined) return false;

          if (useMockData) {
            const readingDate = new Date(reading.timestamp);
            return readingDate >= startDate && readingDate <= endDate;
          }

          const readingType =
            reading.type || reading.sensorType || reading.name || "";
          const readingDate = new Date(reading.timestamp);
          return (
            readingType.toLowerCase() === typeToSearch &&
            readingDate >= startDate &&
            readingDate <= endDate
          );
        });

        if (filteredData.length === 0) {
          setError(
            "Không có dữ liệu cảm biến cho khoảng thời gian và loại cảm biến đã chọn"
          );
          setSensorData(null);
          setStats(null);
          return;
        }

        const values = filteredData.map((d) => d.value);
        setStats({
          min: Math.min(...values).toFixed(2),
          max: Math.max(...values).toFixed(2),
          avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2),
          current: values[values.length - 1].toFixed(2),
        });

        setSensorData({
          labels: filteredData.map((d) =>
            format(new Date(d.timestamp), "MM/dd HH:mm")
          ),
          datasets: [
            {
              label: `${sensorTypes[selectedSensor].label} (${sensorTypes[selectedSensor].unit})`,
              data: filteredData.map((d) => d.value),
              borderColor: sensorTypes[selectedSensor].color,
              backgroundColor: sensorTypes[selectedSensor].backgroundColor,
              borderWidth: 2,
              pointRadius: 3,
              pointHoverRadius: 5,
              tension: 0.3,
              fill: true,
            },
          ],
        });
        setError(null);
      } catch (err) {
        console.error("Error processing sensor data:", err);
        setError(`Failed to process sensor data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    processSensorData();
  }, [
    selectedGarden,
    selectedSensor,
    startDate,
    endDate,
    gardenDevices,
    useMockData,
  ]);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    const now = new Date();
    switch (range) {
      case timeRanges.WEEK:
        setStartDate(subWeeks(now, 1));
        break;
      case timeRanges.TWO_WEEKS:
        setStartDate(subWeeks(now, 2));
        break;
      case timeRanges.MONTH:
        setStartDate(subMonths(now, 1));
        break;
      default:
        break;
    }
    setEndDate(now);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderComponent />
      <div className="flex">
        <SideNavigationBar />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto">
            <StatisticsHeader />
            <StatisticsControls
              selectedGarden={selectedGarden}
              setSelectedGarden={setSelectedGarden}
              selectedSensor={selectedSensor}
              setSelectedSensor={setSelectedSensor}
              timeRange={timeRange}
              handleTimeRangeChange={handleTimeRangeChange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              gardens={gardens}
              loading={loading}
              loadingGardens={loadingGardens}
              setUseMockData={setUseMockData}
            />
            <ErrorMessage
              error={error}
              useMockData={useMockData}
              selectedGarden={selectedGarden}
              gardenDevices={gardenDevices}
            />

            {loading ? (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
                  <p className="text-gray-600">Đang tải dữ liệu cảm biến...</p>
                </div>
              </div>
            ) : (
              <>
                <StatisticsSummary
                  stats={stats}
                  selectedSensor={selectedSensor}
                />
                <StatisticsChart
                  sensorData={sensorData}
                  selectedSensor={selectedSensor}
                />
              </>
            )}
          </div>
        </main>
      </div>
      <FooterComponent />
    </div>
  );
};

export default StatisticsDashboard;
