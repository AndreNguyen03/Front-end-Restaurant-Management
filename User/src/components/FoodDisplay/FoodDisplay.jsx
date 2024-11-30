import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import SearchBar from "../SearchBar/SearchBar";

const FoodDisplay = ({ category, setCategory }) => {
  const { food_list } = useContext(StoreContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFoodList = food_list.filter((item) => {
    const isCategoryMatch = category === "All" || category === item.category;
    const isSearchMatch = item.name
      .toLowerCase()
      .startsWith(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <SearchBar setSearchQuery={setSearchQuery} />{" "}
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
