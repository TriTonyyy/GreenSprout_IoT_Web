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
import {
  getReportOfDeviceByDate,
  getReportOfDeviceByMonth,
  getReportOfDeviceByWeek,
} from "../../api/reportApi";
import i18n from "../../i18n";

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
  const [timeLabels, setTimeLabels] = useState([]);
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
    // console.log("Mode:", mode); // Add this log to verify the mode value
    // console.log("Time:", time);
    setLoading(true);
    try {
      let response;
      // Call the correct API based on mode
      switch (mode) {
        case "day":
          response = await getReportOfDeviceByDate(selectedGarden, {
            date: time,
          });
          checkSensorData(mode);
          checkReportData(mode, response);
          setError(null);
          break;
        case "week":
          response = await getReportOfDeviceByWeek(selectedGarden, {
            week: time,
          });
          const processedWeekData = processWeeklyReport(response, time);
          checkSensorData(mode);
          checkReportData(mode, processedWeekData);
          setError(null);
          break;
        case "month":
          response = await getReportOfDeviceByMonth(selectedGarden, {
            month: time,
          });
          const processedMonthData = processMonthlyReport(response, time);
          checkSensorData(mode);
          checkReportData(mode, processedMonthData);
          setError(null);
          break;
        default:
          throw new Error("Invalid mode provided");
      }
    } catch (err) {
      setError(`Failed to fetch sensor data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const processWeeklyReport = (weekReports, selectedDate) => {
    // Helper function to calculate the average of an array
    const avg = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    console.log("Selected Date:", selectedDate);

    // Sort reports by time_created ascending
    const sortedReports = weekReports.sort(
      (a, b) => new Date(a.time_created) - new Date(b.time_created)
    );

    // Helper function to get the start date of the week (Monday)
    const getStartOfWeek = (year, week) => {
      const date = new Date(year, 0, 1 + (week - 1) * 7); // Start of the given week
      const dayOfWeek = date.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday (0) and other days
      date.setDate(date.getDate() + diffToMonday); // Set date to Monday
      return date;
    };

    // Extract the year and week number from selectedDate (e.g., "2025-W15")
    const [year, week] = selectedDate.split("-W").map(Number);

    // Get the start of the week (Monday) for the selected year and week
    const startOfWeek = getStartOfWeek(year, week);

    // Generate the date range for the full week starting from Monday
    const dateRange = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i); // Adjust each day of the week (Mon, Tue, ..., Sun)
      return day.toLocaleDateString("en-GB"); // Format as DD/MM/YYYY
    });

    // Initialize arrays for storing the average values for each day
    const humidity_avg = Array(7).fill(0);
    const luminosity_avg = Array(7).fill(0);
    const moisture_avg = Array(7).fill(0);
    const stream_avg = Array(7).fill(0);
    const temperature_avg = Array(7).fill(0);
    let total_water_usage = 0;

    // Go through each report and match it with the corresponding day of the week
    sortedReports.forEach((report) => {
      const reportDate = new Date(report.createdAt).toLocaleDateString("en-GB");
      const dateIndex = dateRange.indexOf(reportDate); // Find the index of the report's date in the dateRange

      if (dateIndex !== -1) {
        // Add report values to the corresponding index (day of the week)
        humidity_avg[dateIndex] = avg(report.humidity_avg);
        luminosity_avg[dateIndex] = avg(report.luminosity_avg);
        moisture_avg[dateIndex] = avg(report.moisture_avg);
        stream_avg[dateIndex] = avg(report.stream_avg);
        temperature_avg[dateIndex] = avg(report.tempurature_avg); // Fixed typo (tempurature -> temperature)
        total_water_usage += report.water_usage;
      }
    });

    // Create the processed data object
    const processedData = {
      humidity_avg,
      luminosity_avg,
      moisture_avg,
      stream_avg,
      tempurature_avg: temperature_avg,
      water_usage: total_water_usage,
    };

    // Return the processed data
    return processedData;
  };

  const processMonthlyReport = (monthReports, selectedMonth) => {
    const avg = (arr) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    const sortedReports = monthReports.sort(
      (a, b) => new Date(a.time_created) - new Date(b.time_created)
    );

    const [year, month] = selectedMonth.split("-").map(Number);

    const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
    const daysInMonth = getDaysInMonth(year, month);

    const groupSize = 3;
    let numGroups = Math.ceil(daysInMonth / groupSize);

    // Merge last group if it has only 1 day
    const lastGroupSize = daysInMonth % groupSize;
    const shouldMergeLastGroup = lastGroupSize === 1;

    if (shouldMergeLastGroup) {
      numGroups -= 1; // Last 1-day group will merge into the previous one
    }

    const groupedData = Array.from({ length: numGroups }, () => ({
      humidity: [],
      luminosity: [],
      moisture: [],
      stream: [],
      temperature: [],
      water_usage: 0,
    }));

    sortedReports.forEach((report) => {
      const date = new Date(report.createdAt);
      if (date.getMonth() + 1 === month && date.getFullYear() === year) {
        const day = date.getDate(); // 1-based
        let groupIndex = Math.floor((day - 1) / groupSize);

        // Merge last 1-day group into previous
        if (shouldMergeLastGroup && groupIndex === numGroups) {
          groupIndex = numGroups - 1;
        }

        groupedData[groupIndex].humidity.push(...report.humidity_avg);
        groupedData[groupIndex].luminosity.push(...report.luminosity_avg);
        groupedData[groupIndex].moisture.push(...report.moisture_avg);
        groupedData[groupIndex].stream.push(...report.stream_avg);
        groupedData[groupIndex].temperature.push(...report.tempurature_avg);
        groupedData[groupIndex].water_usage += report.water_usage;
      }
    });

    return {
      humidity_avg: groupedData.map((g) => avg(g.humidity)),
      luminosity_avg: groupedData.map((g) => avg(g.luminosity)),
      moisture_avg: groupedData.map((g) => avg(g.moisture)),
      stream_avg: groupedData.map((g) => avg(g.stream)),
      tempurature_avg: groupedData.map((g) => avg(g.temperature)),
      water_usage: groupedData.reduce((sum, g) => sum + g.water_usage, 0),
    };
  };

  const checkReportData = (mode, reportData) => {
    // console.log(reportData);
    switch (mode) {
      case "day":
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
        break;
      case "week":
        if (reportData.length !== 0) {
          // console.log(reportData);
          setReportData(reportData);
        } else {
          setReportData({
            humidity_avg: [0, 0, 0, 0, 0, 0, 0],
            luminosity_avg: [0, 0, 0, 0, 0, 0, 0],
            moisture_avg: [0, 0, 0, 0, 0, 0, 0],
            stream_avg: [0, 0, 0, 0, 0, 0, 0],
            tempurature_avg: [0, 0, 0, 0, 0, 0, 0],
            water_usage: 0.0,
          });
        }
        break;
      case "month":
        if (reportData.length !== 0) {
          setReportData(reportData);
        } else {
          setReportData({
            humidity_avg: [0, 0, 0, 0, 0, 0, 0],
            luminosity_avg: [0, 0, 0, 0, 0, 0, 0],
            moisture_avg: [0, 0, 0, 0, 0, 0, 0],
            stream_avg: [0, 0, 0, 0, 0, 0, 0],
            tempurature_avg: [0, 0, 0, 0, 0, 0, 0],
            water_usage: 0.0,
          });
        }
        break;
    }
  };

  const checkSensorData = (mode) => {
    let timeLabels = [];
    switch (mode) {
      case "day":
        timeLabels = Array.from(
          { length: 12 },
          (_, i) => `${(i * 2).toString().padStart(2, "0")}:00`
        );
        setTimeLabels(timeLabels);
        break;
      case "week":
        // For the "week" mode, generate the labels for the 7 days of the selected week
        if (selectedDate) {
          const [year, week] = selectedDate.split("-W"); // Extract year and week from selectedDate (e.g., "2025-W17")
          const startOfWeek = getStartOfWeek(parseInt(year), parseInt(week));
          // Generate the labels for the full week (7 days)
          timeLabels = [];
          for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i); // Get each day of the week
            timeLabels.push(
              day.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
              })
            );
          }
        }
        setTimeLabels(timeLabels);
        break;
      case "month":
        if (selectedDate) {
          const [year, month] = selectedDate.split("-").map(Number);
          const daysInMonth = new Date(year, month, 0).getDate();
          const groupSize = 3;
          timeLabels = [];
          for (
            let startDay = 1;
            startDay <= daysInMonth;
            startDay += groupSize
          ) {
            let endDay = Math.min(startDay + groupSize - 1, daysInMonth);

            // If it's the last group and it only has 1 day, merge with the previous group
            if (
              endDay === daysInMonth &&
              endDay - startDay < groupSize - 1 &&
              timeLabels.length > 0
            ) {
              // Merge into the last label
              const lastLabel = timeLabels.pop();
              const [prevStart] = lastLabel.split("-");
              timeLabels.push(
                `${prevStart}-${endDay.toString().padStart(2, "0")}`
              );
            } else {
              timeLabels.push(
                `${startDay.toString().padStart(2, "0")}-${endDay
                  .toString()
                  .padStart(2, "0")}`
              );
            }
          }
        }
        setTimeLabels(timeLabels);
        break;
    }
    // console.log(timeLabels);
  };

  const getStartOfWeek = (year, week) => {
    // Get the first day of the year
    const firstDayOfYear = new Date(year, 0, 1);
    // Get the day of the week for the first day of the year
    const dayOfWeek = firstDayOfYear.getDay();

    // Calculate the date for the start of the desired week
    const startOfWeek = new Date(firstDayOfYear);
    startOfWeek.setDate(
      firstDayOfYear.getDate() + (week - 1) * 7 - (dayOfWeek - 1)
    ); // Adjust for Monday
    return startOfWeek;
  };

  const handleGardenChange = (gardenId) => {
    setSelectedGarden(gardenId);
    navigate(`/statistics/${gardenId}`);
  };

  const handleRefresh = () => {
    // Reset the mode and date to their default values
    setSelectedMode("day");
    setSelectedDate(new Date().toISOString().split("T")[0]); // Reset date to today's date
  };

  const handleModeChange = (newMode) => {
    setSelectedMode(newMode);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // console.log(reportData);
    // console.log(sensorData);
  };

  useEffect(() => {
    if (!reportData) return;
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

  useEffect(() => {
    fetchReport(selectedMode, selectedDate);
  }, [selectedMode, selectedDate, selectedGarden]);

  return (
    <div className="min-h-screen bg-green-50">
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
              mode={selectedMode}
              selectedDate={selectedDate}
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
                  <p className="text-gray-600">{i18n.t("loadingSensorData")}</p>
                </div>
              </div>
            ) : (
              <StatisticsChart
                sensorData={sensorData}
                reportData={reportData}
                time={selectedDate}
                mode={selectedMode}
              />
            )}
          </div>
        </main>
      </div>
      {/* <FooterComponent /> */}
    </div>
  );
}

export default StatisticsDashboard;
