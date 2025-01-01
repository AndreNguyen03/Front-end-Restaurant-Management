import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import SearchBar from "../SearchBar/SearchBar";

const FoodDisplay = ({ category, setCategory }) => {
  const { foodList } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState("");

  if (!foodList) {
    return <div>Loading...</div>;
  }

  const filteredFoodList = foodList.filter((item) => {
    const isCategoryMatch = category === "All" || category === item.category;
    const isSearchMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>Top dishes near you</h2>
        <SearchBar setSearchQuery={setSearchQuery} />
      </div>
      <div className="food-display-list">
        {filteredFoodList.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;