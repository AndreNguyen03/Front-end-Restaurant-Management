import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ setSearchQuery }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm kiếm món ăn..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;