# 🚦 SMARTFLOW - Giao diện Web & Mô phỏng Thuật toán

<p align="center">
  <i>Giải pháp Ứng dụng Trí tuệ Nhân tạo (AI) và Internet Vạn vật (IoT) trong điều khiển Đèn Giao thông Thông minh.</i><br>
  <b>(Dự án dự thi Khoa học - Kỹ thuật cấp Thành phố HS THPT 2025-2026)</b>
</p>

<p align="center">
  <a href="https://smartflow-traffic.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel" alt="Live Demo"></a>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
</p>

---

## 📂 Tài liệu Dự án (Documentation)
> [!IMPORTANT]
> **Tất cả các tài liệu kỹ thuật chi tiết**, bao gồm: Báo cáo khoa học (PDF), Sơ đồ giải thuật, Tài liệu thuyết minh và Hướng dẫn vận hành hệ thống đều được lưu trữ đầy đủ tại thư mục [**/documents**](./documents). Vui lòng tham khảo thư mục này để hiểu rõ hơn về nền tảng nghiên cứu của dự án.

---

## 📖 Giới thiệu
Repository này chứa mã nguồn phần **Front-end / Giao diện Web** của dự án SMARTFLOW. Trang web được xây dựng với hai mục đích chính:
1. **Trình diễn thông tin:** Giới thiệu tổng quan về giải pháp AI & IoT và hiệu quả thực tế của dự án.
2. **Mô phỏng thuật toán (Simulation):** Cung cấp giao diện tương tác cho phép người dùng nhập số lượng phương tiện ($N$) để quan sát cách thuật toán tính toán thời gian đèn xanh ($GT_{next}$) một cách trực quan nhất.

---

## 🚀 Tính năng nổi bật trên Web
- **📊 Dashboard mô phỏng:** Trực quan hóa logic tính toán của hệ thống AI.
- **⚠️ Xử lý trường hợp biên:** Giao diện thể hiện rõ khả năng tự động điều chỉnh khi lượng xe quá ít hoặc vượt ngưỡng tối đa (25 xe).
- **📱 Thiết kế Responsive:** Tối ưu hóa hiển thị trên mọi thiết bị (Mobile, Tablet, Desktop).
- **☁️ IoT Monitor:** Mô phỏng việc theo dõi trạng thái đèn và can thiệp thủ công từ xa.

---

## 🧠 Thuật toán lõi (Mô phỏng)
Hệ thống dựa trên dữ liệu từ Camera AI (YOLO) để điều khiển thời gian đèn xanh:
- **Ngưỡng xe ($N_{MAX}$):** 25 xe.
- **Thời gian xanh tối thiểu ($GT_{min}$):** 15 giây.
- **Thời gian xanh tối đa ($GT_{MAX}$):** 50 giây.
- **Hiệu quả thực tế:** Giảm thời gian chờ trung bình từ **31.6% đến 34%**.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)
- **Framework & Thư viện:** React, TypeScript.
- **Môi trường & Triển khai:** Node.js, Vercel.
- **Thiết kế:** Giao diện hiện đại, tối giản, tập trung vào trải nghiệm người dùng.

---

## 💻 Hướng dẫn chạy dự án (Local Development)

Đảm bảo máy tính của bạn đã cài đặt sẵn [Node.js](https://nodejs.org/). Sau đó thực hiện các bước sau:

```bash
# 1. Clone dự án về máy
git clone [https://github.com/your-username/smartflow-web.git](https://github.com/your-username/smartflow-web.git)

# 2. Di chuyển vào thư mục dự án
cd smartflow-web

# 3. Cài đặt các thư viện (Dependencies)
npm install
# hoặc yarn install / pnpm install

# 4. Khởi chạy Server phát triển
npm run dev
# hoặc yarn dev / pnpm dev
