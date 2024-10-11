// src/components/SearchBar.js
import React from 'react';
import './SearchBar.css'; // We'll style it separately

const SearchBar = () => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search articles"
      />
    </div>
  );
};

export default SearchBar;