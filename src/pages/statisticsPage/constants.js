import i18n from "../../i18n";
export const timeRanges = {
  DAY: 'day',
};

export const sensorTypes = {
  TEMPERATURE: "tempurature_avg",
  HUMIDITY: "humidity_avg",
  SOIL_MOISTURE: "soil_moisture_avg",
  LUMINOSITY: "luminosity_avg"
};

export const sensorLabels = {
  humidity_avg: `${i18n.t("airHumidity")} (%)`,
  tempurature_avg: `${i18n.t("temperature")} (°C)`,
  luminosity_avg: `${i18n.t("ambientLight")}  (lux)`,
  soil_moisture_avg: `${i18n.t("soil_moisture")} (%)`,
  stream_avg: `${i18n.t("waterFlow")} (L/min)`,
  water_usage: `${i18n.t("water_usage")}  (L)`
};

export const colors = {
  humidity_avg: {
    border: 'rgba(54, 162, 235, 1)',
    background: 'rgba(54, 162, 235, 0.2)',
    cardBg: '#EBF8FF'
  },
  tempurature_avg: {
    border: 'rgba(255, 99, 132, 1)',
    background: 'rgba(255, 99, 132, 0.2)',
    cardBg: '#FFF5F5'
  },
  luminosity_avg: {
    border: 'rgba(255, 206, 86, 1)',
    background: 'rgba(255, 206, 86, 0.2)',
    cardBg: '#FFFFF0'
  },
  soil_moisture_avg: {
    border: 'rgba(75, 192, 192, 1)',
    background: 'rgba(75, 192, 192, 0.2)',
    cardBg: '#E6FFFA'
  },
  stream_avg: {
    border: 'rgba(153, 102, 255, 1)',
    background: 'rgba(153, 102, 255, 0.2)',
    cardBg: '#FAF5FF'
  },
  water_usage: {
    border: 'rgba(116, 66, 16, 1)',
    background: 'rgba(116, 66, 16, 0.2)',
    cardBg: '#FFFAF0'
  }
};
