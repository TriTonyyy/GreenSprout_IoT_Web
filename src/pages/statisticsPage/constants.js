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
  humidity_avg: 'Độ ẩm không khí (%)',
  tempurature_avg: 'Nhiệt độ (°C)',
  luminosity_avg: 'Ánh sáng (lux)',
  soil_moisture_avg: 'Độ ẩm đất (%)',
  stream_avg: 'Lưu lượng (L/min)',
  water_usage: 'Lượng nước đã dùng (L)'
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
