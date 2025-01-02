import "./Header.css";
const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>Đặt món yêu thích của bạn tại đây</h2>
        <p>
        Hãy lựa chọn từ thực đơn đa dạng với những món ăn hấp dẫn được chế biến từ những nguyên liệu
         tinh túy nhất và sự tài hoa trong ẩm thực. Sứ mệnh của chúng tôi là thỏa mãn mọi sự thèm muốn của bạn
          và nâng tầm trải nghiệm ẩm thực, từng bữa ăn ngon miệng một.
        </p>
        <button>Xem thực đơn</button>
      </div>
    </div>
  );
};

export default Header;
