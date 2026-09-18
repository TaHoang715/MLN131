# Đấu Trường Tri Thức MLN131 · Dân Chủ Xã Hội Chủ Nghĩa

Phần mềm trò chơi học tập tương tác thời gian thực phục vụ buổi thuyết trình môn học **MLN131 (Chủ nghĩa xã hội khoa học - Khoa học Mác - Lênin)**.

## 🌟 Tính Năng Chính
- **10 Vòng Thi Đấu Đỉnh Cao**: Tuyển chọn 10 câu hỏi cốt lõi từ bộ ngân hàng đề `Src_Question.docx`, kết hợp đan xen giữa:
  - 🧩 **Đuổi hình bắt chữ / Đoán từ khóa**: Nhìn gợi ý, số lượng ô chữ, gõ đáp án chuẩn xác.
  - 📝 **Trắc nghiệm nhanh tay (A, B, C, D)**: 4 đáp án màu sắc trực quan, tính điểm mili-giây.
- **Chế Độ Quản Trò (Host)**: Tạo phòng phát mã PIN 5 số & mã QR phóng to lên máy chiếu lớp học.
- **Chế Độ Người Chơi (Student)**: Quét QR hoặc nhập mã PIN từ điện thoại/máy tính cá nhân.
- **Tính Điểm Mili-giây**: Đếm ngược 60s, người chơi gửi đáp án đúng càng sớm sẽ nhận điểm số càng cao (tối đa ~6000 điểm mỗi vòng).
- **Luận Cứ Học Thuật & Ý Nghĩa Triết Học**: Giải thích cặn kẽ sau mỗi câu hỏi phục vụ bài thuyết trình.
- **Bảng Xếp Hạng & Bục Vinh Danh (Podium)**: Vinh danh Top 1, Top 2, Top 3 kèm hiệu ứng pháo hoa, âm thanh fanfare chiến thắng.

## 🛡️ Kiến Trúc & Tính An Toàn
- **Convex Realtime Database**: Sử dụng các bảng dữ liệu độc lập (`mlnRooms`, `mlnPlayers`), không bao giờ gây ảnh hưởng hay xung đột với các game trước đó.
- **Frontend**: React 19, TypeScript, TailwindCSS v4, Motion, Canvas-Confetti, Lucide-React.
- **Không có nhạc nền ồn ào**: Chỉ giữ lại các hiệu ứng âm thanh (SFX) đoán đúng, đoán sai và vinh danh chiến thắng.

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local)
```bash
npm install
npm run dev
```
Mở trình duyệt tại `http://localhost:5173`.
