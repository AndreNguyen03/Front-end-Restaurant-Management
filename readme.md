![UIT](https://img.shields.io/badge/from-UIT%20VNUHCM-blue?style=for-the-badge&link=https%3A%2F%2Fwww.uit.edu.vn%2F)

# RESTAURANT MANAGEMENT SYSTEM

## 📑 Table of Contents
* [Giới thiệu chung](#giới-thiệu-chung)
* [Các chức năng](#các-chức-năng)
* [Framework và công nghệ](#framework-và-công-nghệ)
* [Tài khoản mặc định](#tài-khoản-mặc-định)
* [Demo (Screenshots)](#demo-screenshots)

---

## 👨‍💻 Giới thiệu chung
**Tác giả:**  
- Nguyễn Nguyên Ngọc Anh - 22520058 - [Github](https://github.com/AndreNguyen03)  
- Nguyễn Thế Võ Quyền Anh - 22520060
- Hoàng Hồ Quốc Bảo - 22520102
- Nguyễn Hoàng Gia Bảo - 22520111

**Mô tả:**  
**Restaurant Management System** là hệ thống quản lý nhà hàng hỗ trợ số hóa toàn bộ quy trình hoạt động, bao gồm đặt bàn, đặt món trực tuyến, quản lý nguyên liệu, hóa đơn, nhân viên và báo cáo doanh thu.  
Ứng dụng hướng đến việc mang lại trải nghiệm **hiện đại – tiện lợi – chính xác** cho cả khách hàng, nhân viên phục vụ và quản trị viên.  

---

## ⚙️ Các chức năng
### Khách hàng
- Đăng ký, đăng nhập, quên mật khẩu  
- Xem danh sách món ăn, chi tiết món ăn, tìm kiếm món  
- Đặt món online (thêm vào giỏ hàng, thanh toán qua **ZaloPay**)  
- Đặt bàn trực tuyến  
- Quản lý địa chỉ giao hàng  
- Bình luận, đánh giá món ăn  

### Nhân viên
- Quản lý đơn hàng (xem chi tiết, cập nhật trạng thái)  
- Quản lý hóa đơn (tạo, in, tra cứu)  
- Quản lý phục vụ tại bàn (thêm món, lập hóa đơn theo bàn)  

### Quản trị
- Quản lý nhân viên (CRUD, tìm kiếm)  
- Quản lý món ăn (CRUD, tìm kiếm)  
- Quản lý nguyên liệu, phiếu nhập, nhà cung cấp  
- Quản lý bàn ăn (CRUD, tìm kiếm)  
- Báo cáo doanh thu (lọc, thống kê, xuất file PDF/Excel)  

---

## 🛠 Framework và công nghệ

![Tech Stack](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/tech.jpg?raw=true)


- **Kiến trúc:** MVC (Model – View – Controller)  
- **Frontend:** ReactJS (RESTful API, Socket.IO để nhận notify DB update)  
- **Backend:** Node.js + ExpressJS (tích hợp **ZaloPay API** cho thanh toán)  
- **Database:** MongoDB Atlas  
- **Công cụ & IDE:**  
  - VS Code, Postman, MongoDB Compass  
  - Figma, draw.io, Notion (thiết kế & phân tích)  

---

## 🔑 Tài khoản mặc định
- **Username:** `admin`  
- **Password:** `admin`  

---

## 📸 Demo (Screenshots)

### Đăng nhập
![Login](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/login.jpg?raw=true)

### Đăng ký
![Signup](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/signup.jpg?raw=true)

### Trang chủ
![Home](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/homescreen.png?raw=true)

### Món ăn
![Dish](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/dish.jpg?raw=true)

### Bình luận
![Comment](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/comment.png?raw=true)

### Đặt bàn
![Reservation List](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/reservationlist.jpg?raw=true)  
![Reservation Calendar](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/reservationcalendar.png?raw=true)

### Đặt món / Order
![Order](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/order.png?raw=true)  
![Checkout](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/checkout.jpg?raw=true)

### Quản lý bàn & Phục vụ bàn
![Table](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/table.png?raw=true)  
![Table Service](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/tableservice.png?raw=true)

### Quản lý nhân viên
![Employee](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/employee.jpg?raw=true)

### Quản lý nguyên liệu & Nhập hàng
![Ingredient](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/ingredient.png?raw=true)  
![Purchase](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/purchase.png?raw=true)

### Hóa đơn
![Invoice](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/invoice.jpg?raw=true)

### Báo cáo doanh thu
![Report](https://github.com/AndreNguyen03/Front-end-Restaurant-Management/blob/main/assets/report.png?raw=true)



