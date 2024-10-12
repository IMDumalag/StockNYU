// components/MarketStockDetails.jsx
import React from 'react';
import './MarketStockDetails.css'; // Import the CSS file

const MarketStockDetails = () => {
  const profitValue = 20.58; // Example profit value
  const profitPercentage = 80.75; // Example profit percentage

  return (
    <div className="market-stock-details">
      <h2>Market Stock History Details</h2>
      <div className="profit">
        <span>Profit: </span>
        <span className="profit-value">+{profitValue} ({profitPercentage}%)</span>
      </div>
    </div>
  );
};

export default MarketStockDetails;