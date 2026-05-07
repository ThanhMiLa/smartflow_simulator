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

# 🧠 Thuật toán điều khiển thông minh (Core Algorithm)

Hệ thống kế thừa tư tưởng từ mô hình **RHODES** (Real-time Hierarchical Optimized Distributed Effective System) kết hợp với **sơ đồ phân pha 2 vòng NEMA**, giúp tối ưu hóa dòng giao thông thời gian thực và đảm bảo không xảy ra xung đột giữa các hướng rẽ.

## 📈 Công thức tính toán thời gian đèn xanh ($GT_{next}$)

Hệ thống sử dụng công thức nội suy tuyến tính có chặn và làm trơn để quyết định thời lượng đèn xanh dựa trên mật độ xe thực tế:

$$GT_{next} = GT_{MIN} + \frac{N - N_{MIN}}{N_{MAX} - N_{MIN}} \times (GT_{MAX} - GT_{MIN})$$

### 🔍 Giải thích các tham số:
* **$N$**: Số lượng xe thực tế do Camera AI (YOLO) đếm được tại thời điểm quan sát.
* **$N_{MIN} = 5$ (xe)**: Ngưỡng tối thiểu. Nếu số xe $\le 5$, hệ thống coi như đường vắng để tránh lãng phí thời gian xanh.
* **$N_{MAX} = 50$ (xe)**: Ngưỡng tối đa (tính toán dựa trên chiều dài làn chờ và khoảng cách xe). Nếu $\ge 50$ xe, hệ thống coi như đang kẹt xe nặng.
* **$GT_{MIN} = 15s$**: Thời gian xanh tối thiểu, đảm bảo an toàn cho đoàn xe kịp khởi động và băng qua giao lộ.
* **$GT_{MAX} = 50s$**: Thời gian xanh tối đa, nhằm giới hạn thời gian chờ cho các hướng đối diện, tránh gây ùn tắc dây chuyền.

## ⚖️ Cơ chế xử lý trường hợp biên (Clamping Logic)

Để đảm bảo hệ thống vận hành ổn định và không đưa ra các giá trị phi lý, thuật toán áp dụng logic chặn như sau:

1.  **Trường hợp đường vắng ($N \le N_{MIN}$):** * Mặc định $GT_{next} = 15s$.
2.  **Trường hợp quá tải ($N \ge N_{MAX}$):** * Mặc định $GT_{next} = 50s$.
3.  **Trường hợp lưu lượng bình thường ($N_{MIN} < N < N_{MAX}$):** * Tính toán linh hoạt theo công thức nội suy để đưa ra thời gian xanh tối ưu nhất.

## 📊 Hiệu quả thực tế
Dựa trên các dữ liệu mô phỏng và thực nghiệm tại nút giao:
* **Giảm thời gian chờ trung bình:** từ **31.6% đến 34%**.
* Tối ưu hóa khả năng thông hành, giảm thiểu tình trạng "đèn xanh cho đường trống".

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
