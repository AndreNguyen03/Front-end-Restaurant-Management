import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/frontend_assets/assets";

const ExploreMenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Khám phá thực đơn của chúng tôi</h1>
      <p className="explore-menu-text">
      Hãy khám phá thực đơn phong phú với nhiều món ăn hấp dẫn, được chế biến từ những nguyên liệu cao cấp nhất và tay nghề ẩm thực điêu luyện. Sứ mệnh của chúng tôi là đáp ứng mọi mong muốn của bạn và nâng tầm trải nghiệm ẩm thực, từng bữa ăn ngon miệng.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              key={index}
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "All" : item.menu_name
                )
              }
              className="explore-menu-list-item"
            >
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
