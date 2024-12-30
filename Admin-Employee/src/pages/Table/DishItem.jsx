import React from 'react'
import './DishItem.css'

function DishItem({name,image,description,price,onClick}) {
  return (  
    <div className="food-item" onClick={onClick}>
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt="" />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  )
}

export default DishItem