import React from 'react';
import { sensorLabels, colors } from '../constants';

const StatisticsItem = ({ label, value, type }) => {
  const unit = label.match(/\((.*?)\)/)?.[1] || '';
  return (
    <div 
      className="px-4 py-5 shadow rounded-lg overflow-hidden sm:p-6"
      style={{ backgroundColor: colors[type]?.cardBg || 'white' }}
    >
      <dt className="text-sm font-medium text-gray-600 truncate">{label}</dt>
      <dd className="mt-1 text-3xl font-semibold text-gray-900">
        {value !== null ? `${value.toFixed(1)} ${unit}` : 'N/A'}
      </dd>
    </div>
  );
};

const StatisticsSummary = ({ reportData }) => {
  if (!reportData) return null;

  const calculateAverage = (array) => {
    if (!Array.isArray(array) || array.length === 0) return null;
    const validValues = array.filter(val => val !== null && !isNaN(val));
    if (validValues.length === 0) return null;
    return validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
  };

  const stats = [
    {
      label: sensorLabels.water_usage,
      value: reportData.water_usage || null,
      type: 'water_usage'
    },
    {
      label: sensorLabels.tempurature_avg,
      value: calculateAverage(reportData.tempurature_avg),
      type: 'tempurature_avg'
    },
    {
      label: sensorLabels.humidity_avg,
      value: calculateAverage(reportData.humidity_avg),
      type: 'humidity_avg'
    },
    {
      label: sensorLabels.soil_moisture_avg,
      value: calculateAverage(reportData.moisture_avg),
      type: 'soil_moisture_avg'
    },
    {
      label: sensorLabels.luminosity_avg,
      value: calculateAverage(reportData.luminosity_avg),
      type: 'luminosity_avg'
    },
    {
      label: sensorLabels.stream_avg,
      value: calculateAverage(reportData.stream_avg),
      type: 'stream_avg'
    }
  ];

  return (
    <div className="mt-8">
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <StatisticsItem
            key={item.label}
            label={item.label}
            value={item.value}
            type={item.type}
          />
        ))}
      </dl>
    </div>
  );
};

export default StatisticsSummary;
