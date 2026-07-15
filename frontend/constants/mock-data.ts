export const MOCK_COURSES = [
  {
    id: "1",
    title: "STEP 1 2027 | Nền tảng Toán 12",
    release_date: "15/03/2026",
    price: 1200000,
    cover_image: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=400&auto=format&fit=crop",
    tags: ["Video", "Livestream"],
    stats: {
      lessons: 120,
      exams: 50,
      documents: 100
    },
    description: "<p>Khoá học <strong>STEP 1 2027</strong> cung cấp toàn bộ kiến thức nền tảng môn Toán lớp 12 theo chương trình GDPT mới nhất.</p><ul><li>Bám sát sách giáo khoa</li><li>Hệ thống bài tập phân dạng chi tiết</li><li>Phù hợp với học sinh trung bình - khá</li></ul>"
  },
  {
    id: "2",
    title: "STEP 2 2027 | Vận dụng Toán 12",
    release_date: "06/09/2026",
    price: 1500000,
    cover_image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop",
    tags: ["Video", "Livestream"]
  },
  {
    id: "3",
    title: "STEP 3 2027 | Vận dụng cao Toán 12",
    release_date: "01/11/2026",
    price: 1200000,
    cover_image: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb84?q=80&w=400&auto=format&fit=crop",
    tags: ["Video", "Livestream"]
  },
  {
    id: "4",
    title: "STEP 4 2027 | Tổng ôn & Luyện đề",
    release_date: "01/01/2027",
    price: 1500000,
    cover_image: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=400&auto=format&fit=crop",
    tags: ["Video", "Livestream"]
  },
  {
    id: "5",
    title: "STEP 5 2027 | Killingcamp",
    release_date: "24/05/2027",
    price: 800000,
    cover_image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop",
    tags: ["Livestream", "Video"]
  },
  {
    id: "6",
    title: "THE TRUTH | Tiến đề Toán 12",
    release_date: "01/06/2026",
    price: 1000000,
    cover_image: "https://images.unsplash.com/photo-1633613286848-e6f43bbafb84?q=80&w=400&auto=format&fit=crop",
    tags: ["Video"]
  },
  {
    id: "7",
    title: "Tư duy Toán 12 [vs GS.TS. Cung Thế Anh - Chủ biên SGK BGD]",
    release_date: "15/07/2026",
    price: 2000000,
    cover_image: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=400&auto=format&fit=crop",
    tags: ["Video"]
  },
  {
    id: "8",
    title: "PHỤ ĐẠO THÊM | Ôn thi giữa kì, Cuối kì, Chữa đề trường sở 2026 - 2027",
    release_date: "01/09/2026",
    price: 900000,
    cover_image: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=400&auto=format&fit=crop",
    tags: ["Livestream", "Video"]
  }
];

export const MOCK_COURSE_COLLECTIONS = [
  {
    id: "combo-1",
    title: "LỘ TRÌNH LUYỆN THI 2027 DÀNH CHO 2009",
    short_title: "BON 12 XPS 2027",
    original_price: 2000000,
    sale_price: 1500000,
    // Mô phỏng: Admin chỉ chọn đúng 8 khóa học này (id từ 1 đến 8) đưa vào Combo-1
    courses: MOCK_COURSES.filter(course => ["1", "2", "3", "4", "5", "6", "7", "8"].includes(course.id))
  },
  {
    id: "combo-2",
    title: "LỘ TRÌNH LUYỆN THI 2027 DÀNH CHO 2010",
    short_title: "BON 11 XPS 2028",
    original_price: 2000000,
    sale_price: 1500000,
    // Mô phỏng: Combo 2 chỉ chứa 4 khóa đầu tiên
    courses: MOCK_COURSES.filter(course => ["1", "2", "3", "4"].includes(course.id))
  }
];

export const MOCK_COURSE_CATEGORIES = [
  { id: "toan-12", name: "Toán 12", slug: "toan-12" },
  { id: "toan-11", name: "Toán 11", slug: "toan-11" },
  { id: "tong-on", name: "Tổng ôn", slug: "tong-on" },
  { id: "luyen-de", name: "Luyện đề", slug: "luyen-de" },
];

export const MOCK_COURSE_CURRICULUM = [
  {
    id: "chap-1",
    title: "Phụ lục. 8 chủ đề Toán 10, 11 cần nắm để học lên chương trình Toán 12",
    stats: "8 Bài giảng / 8 Bài thi online",
    themes: [
      { id: "3677420a-5889-4ff4-aec5-6cc8e0c7389b", title: "Theme 1. Các quy tắc tính đạo hàm", stats: "1 Bài giảng / 1 Bài tập / 3 Tài liệu" },
      { id: "t2", title: "Theme 2. Đạo hàm hàm hợp - đạo hàm cấp hai", stats: "1 Bài giảng / 1 Bài tập / 3 Tài liệu" },
      { id: "t3", title: "Theme 3. Các khái niệm mở đầu về vectơ", stats: "1 Bài giảng / 1 Bài tập / 3 Tài liệu" },
      { id: "t4", title: "Theme 4. Tổng và hiệu của hai vectơ", stats: "1 Bài giảng / 1 Bài tập / 3 Tài liệu" }
    ]
  },
  {
    id: "chap-2",
    title: "Chapter 1. Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số",
    stats: "22 Bài giảng / 22 Bài thi online",
    themes: [
      { id: "t5", title: "Theme 1. Tính đơn điệu của hàm số", stats: "2 Bài giảng / 2 Bài tập / 1 Tài liệu" },
      { id: "t6", title: "Theme 2. Cực trị của hàm số", stats: "3 Bài giảng / 3 Bài tập / 2 Tài liệu" }
    ]
  },
  {
    id: "chap-3",
    title: "Chapter 2. Nguyên hàm và tích phân",
    stats: "11 Bài giảng / 11 Bài thi online",
    themes: [
      { id: "t7", title: "Theme 1. Nguyên hàm", stats: "2 Bài giảng / 2 Bài tập / 1 Tài liệu" }
    ]
  }
];
