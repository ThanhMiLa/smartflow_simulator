readme_content = """<h1 align="center">🚦 SMARTFLOW - Giao diện Web & Mô phỏng Thuật toán</h1>

<p align="center">
  <i>Giải pháp Ứng dụng Trí tuệ Nhân tạo (AI) và Internet Vạn vật (IoT) trong điều khiển Đèn Giao thông Thông minh.</i><br>
  <b>(Dự án dự thi Khoa học - Kỹ thuật cấp Thành phố HS THPT 2025-2026)</b>
</p>

<p align="center">
  <a href="https://smartflow-traffic.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo"></a>
</p>

---

## 📖 Giới thiệu
Đây là repository chứa mã nguồn (source code) phần **Front-end / Giao diện Web** của dự án **SMARTFLOW**. Trang web này được xây dựng với mục đích:
1. **Trưng bày thông tin dự án:** Cung cấp cái nhìn tổng quan về giải pháp AI & IoT trong việc giải quyết ùn tắc giao thông.
2. **Mô phỏng thuật toán trực quan:** Cung cấp giao diện UI để người dùng (hoặc ban giám khảo) có thể tương tác, thay đổi số lượng phương tiện để xem cách thuật toán tính toán và điều chỉnh thời gian đèn giao thông ngay lập tức.

> **Lưu ý:** Đây chỉ là phần mã nguồn cho trang web thông tin và mô phỏng thuật toán. Phần mã nguồn nhúng (ESP32) và AI nhận diện (YOLO) được đặt ở các repository khác.

---

## 🚀 Tính năng chính của Website

- 📊 **Dashboard Mô phỏng (Simulation):** - Cho phép nhập số lượng xe giả lập ($N$).
  - Hiển thị trực quan thời gian đèn xanh ($GT_{next}$) được tính toán theo thuật toán của hệ thống.
  - Xử lý các trường hợp biên: Cảnh báo và tự động điều chỉnh khi lượng xe vượt ngưỡng tối đa ($N_{MAX}$).
- 📱 **Giao diện Responsive:** Hiển thị tốt trên cả máy tính (PC/Laptop) và thiết bị di động (Mobile/Tablet).
- ⚙️ **Tích hợp IoT Dashboard (Mô phỏng):** Trực quan hóa việc chuyển đổi giữa chế độ Tự động (AI điều khiển) và Thủ công (IoT can thiệp).

---

## 🧠 Thuật toán điều khiển cốt lõi (Mô phỏng)

Website mô phỏng lại logic tính toán thời gian đèn xanh dựa trên số xe AI (YOLO) đếm được, với công thức tuyến tính và giới hạn an toàn:

- **Ngưỡng xe ($N_{MAX}$)**: 25 xe (Tương ứng thời gian tối đa $GT_{MAX}$ = 50s).
- **Thời gian xanh tối thiểu ($GT_{min}$)**: 15s.
- **Tính toán**: Nếu $N \\ge N_{MAX}$, thời gian xanh đạt trần $GT_{MAX}$. Ngược lại, thời gian tăng tuyến tính theo số lượng phương tiện thực tế. Hệ thống giúp giảm đến **31.6% - 34%** lượng xe chờ tại các nút giao.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend:** HTML/CSS/JavaScript (Hoặc ReactJS/NextJS/Vite - *Tùy chỉnh theo dự án thực tế của bạn*)
- **Triển khai (Deployment):** [Vercel](https://vercel.com/)

---

## 💻 Cài đặt & Chạy trên máy cá nhân (Local Development)

Để chạy thử dự án web này trên máy tính của bạn, hãy làm theo các bước sau:

```bash
# 1. Clone repository về máy
git clone [https://github.com/your-username/smartflow-web-simulation.git](https://github.com/your-username/smartflow-web-simulation.git)

# 2. Di chuyển vào thư mục dự án
cd smartflow-web-simulation

# 3. Cài đặt các thư viện phụ thuộc (nếu dùng Node.js/React)
npm install
# hoặc yarn install

# 4. Khởi chạy server phát triển
npm run dev
# hoặc yarn dev
