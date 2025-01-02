import { assets } from "../../assets/frontend_assets/assets";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="" />
          <p>Lorem Ipsum chỉ đơn giản là đoạn văn bản giả dùng trong ngành in ấn và dàn trang. Lorem Ipsum đã trở thành tiêu chuẩn văn bản mẫu của ngành này từ những năm 1500, khi một thợ in vô danh sắp xếp các chữ cái và xáo trộn chúng để tạo ra một cuốn sách mẫu.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>

        <div className="footer-content-center">
          <h2>Công ty</h2>
          <ul>
            <li>Trang chủ</li>
            <li>Về chúng tôi</li>
            <li>Vận chuyển</li>
            <li>Chính sách bảo mật</li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h2>LIÊN HỆ</h2>
          <ul>
            <li>+1-212-456-790</li>
            <li>contact@vietnam.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copy-right">
      Bản quyền 2024 &#169; Tomato.com - Bảo lưu mọi quyền.
      </p>
    </div>
  );
};

export default Footer;
