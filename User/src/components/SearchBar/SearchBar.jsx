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
        placeholder="Search for dishes..."
        value={query}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBar;
