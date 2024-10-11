// components/StockHistoryChart.jsx
import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import './StockHistoryChart.css'; // Import the CSS file
import MarketStockDetails from './MarketStockDetails'; // Import the new component

const StockHistoryChart = () => {
  const [timeRange, setTimeRange] = useState('Total');

  const dataSets = {
    '1D': [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    '5D': [30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50],
    '6M': [30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80],
    '1Y': [30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130],
    '5Y': [30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230],
    'Total': [30, 40, 35, 50, 49, 60, 70, 91, 125, 130, 140, 150]
  };

  const options = {
    chart: {
      id: 'stock-history-chart'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  const series = [
    {
      name: 'Stock Price',
      data: dataSets[timeRange]
    }
  ];

  return (
    <div className="chart-details-container"> {/* Apply the CSS class */}
      <div className="chart-container">
        <h2>Stock History</h2>
        <div className="button-container">
          <button onClick={() => setTimeRange('1D')}>1D</button>
          <button onClick={() => setTimeRange('5D')}>5D</button>
          <button onClick={() => setTimeRange('6M')}>6M</button>
          <button onClick={() => setTimeRange('1Y')}>1Y</button>
          <button onClick={() => setTimeRange('5Y')}>5Y</button>
          <button onClick={() => setTimeRange('Total')}>Total</button>
        </div>
        <Chart options={options} series={series} type="line" height={750} />
      </div>
      <MarketStockDetails /> {/* Include the new component */}
    </div>
  );
};

export default StockHistoryChart;