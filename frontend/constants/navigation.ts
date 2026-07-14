import { Home, BookOpen, User, Star, GraduationCap, Calendar, Book, Search } from "lucide-react";

export const SIDEBAR_MENUS = [
  { id: 1, title: "Trang chủ", url: "/", icon: Home },
  { id: 2, title: "BON 2026 (Bonner 2008)", url: "/bon-2026", icon: BookOpen },
  { id: 3, title: "BON 2027 (Bonner 2009)", url: "/bon-2027", icon: BookOpen },
  { id: 4, title: "BON 2028 (Bonner 2010)", url: "/bon-2028", icon: BookOpen },
  { id: 5, title: "BON 2029 (Bonner 2011)", url: "/bon-2029", icon: BookOpen },
  { id: 6, title: "Sách tự học", url: "/books", icon: Book },
  { id: 7, title: "Giới thiệu", url: "/about", icon: User },
];

export const HEADER_MENUS = [
  { id: 1, title: "Khóa học", url: "/courses", icon: GraduationCap },
  { id: 2, title: "Lịch đào tạo", url: "/schedule", icon: Calendar },
  { id: 3, title: "Tài liệu", url: "/materials", icon: Book },
  { id: 4, title: "Tra cứu học bạ", url: "/transcript", icon: Search },
];

export const SOCIAL_LINKS = [
  { id: 1, title: "Hotline", url: "tel:0123456789", iconType: "phone" },
  { id: 2, title: "Facebook", url: "https://facebook.com", iconType: "facebook" },
  { id: 3, title: "TikTok", url: "https://tiktok.com", iconType: "tiktok" },
  { id: 4, title: "YouTube", url: "https://youtube.com", iconType: "youtube" },
  { id: 5, title: "Threads", url: "https://threads.net", iconType: "threads" },
];

export const FOOTER_MENUS = [
  {
    id: 1,
    title: "Liên hệ",
    items: [
      { id: 11, title: "Email hỗ trợ", url: "#" },
      { id: 12, title: "Tuyển dụng", url: "#" },
    ]
  },
  {
    id: 2,
    title: "Các chính sách",
    items: [
      { id: 21, title: "Điều khoản sử dụng", url: "/terms" },
      { id: 22, title: "Chính sách bảo mật", url: "/privacy" },
      { id: 23, title: "Chính sách chung", url: "/policies/general" },
      { id: 24, title: "Chính sách bảo mật thông tin", url: "/policies/privacy" },
      { id: 25, title: "Hướng dẫn mua hàng", url: "/policies/buying-guide" },
      { id: 26, title: "Hướng dẫn kích hoạt khoá học", url: "/policies/activation-guide" },
      { id: 27, title: "Chính sách hoàn trả học phí", url: "/policies/refund" },
    ]
  }
];

export const HOME_BANNERS = [
  { id: 1, image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop", title: "Khai giảng BON 2027", link_url: "/bon-2027" },
  { id: 2, image_url: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=1200&auto=format&fit=crop", title: "Khóa luyện đề đặc biệt", link_url: "/luyen-de" },
];

export const EXAM_COUNTDOWN = {
  title: "Comparison kills progress. Focus builds it",
  target_date: "2027-06-01T00:00:00Z", // Target date for countdown
};
