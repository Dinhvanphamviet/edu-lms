"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  CheckCircle2,
  Clock,
  Send,
  X,
  Eye,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StudentItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  avatarColor: string;
  enrolledCourse: string;
  courseId: string;
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  lastActive: string;
  enrolledDate: string;
  status: "ACTIVE" | "COMPLETED" | "INACTIVE";
}

const mockStudents: StudentItem[] = [
  {
    id: "std-001",
    fullName: "Nguyễn Hoàng Nam",
    email: "hoangnam.nguyen@gmail.com",
    phone: "0912 345 678",
    city: "Hà Nội",
    avatarColor: "from-blue-500 to-indigo-600",
    enrolledCourse: "Toán 12 - Chinh Phục Cực Trị & Hàm Số",
    courseId: "c-101",
    progressPercent: 92,
    completedLessons: 33,
    totalLessons: 36,
    lastActive: "10 phút trước",
    enrolledDate: "05/09/2026",
    status: "ACTIVE",
  },
  {
    id: "std-002",
    fullName: "Trần Thùy Linh",
    email: "thuylinh.tran@gmail.com",
    phone: "0987 654 321",
    city: "TP. Hồ Chí Minh",
    avatarColor: "from-pink-500 to-rose-600",
    enrolledCourse: "Luyện Thi ĐGNL ĐHQG - Toán Logic",
    courseId: "c-103",
    progressPercent: 78,
    completedLessons: 33,
    totalLessons: 42,
    lastActive: "1 giờ trước",
    enrolledDate: "02/09/2026",
    status: "ACTIVE",
  },
  {
    id: "std-003",
    fullName: "Lê Quốc Bảo",
    email: "quocbao.le@gmail.com",
    phone: "0905 112 233",
    city: "Đà Nẵng",
    avatarColor: "from-emerald-500 to-teal-600",
    enrolledCourse: "Phương Pháp Tọa Độ Không Gian Oxyz",
    courseId: "c-102",
    progressPercent: 100,
    completedLessons: 28,
    totalLessons: 28,
    lastActive: "Hôm qua",
    enrolledDate: "28/08/2026",
    status: "COMPLETED",
  },
  {
    id: "std-004",
    fullName: "Phạm Minh Đức",
    email: "minhduc.pham@gmail.com",
    phone: "0934 556 789",
    city: "Hải Phòng",
    avatarColor: "from-amber-500 to-orange-600",
    enrolledCourse: "Toán 12 - Chinh Phục Cực Trị & Hàm Số",
    courseId: "c-101",
    progressPercent: 45,
    completedLessons: 16,
    totalLessons: 36,
    lastActive: "2 ngày trước",
    enrolledDate: "10/09/2026",
    status: "ACTIVE",
  },
  {
    id: "std-005",
    fullName: "Võ Thị Mai Chi",
    email: "maichi.vo@gmail.com",
    phone: "0944 888 999",
    city: "Cần Thơ",
    avatarColor: "from-purple-500 to-violet-600",
    enrolledCourse: "Luyện Thi ĐGNL ĐHQG - Toán Logic",
    courseId: "c-103",
    progressPercent: 15,
    completedLessons: 6,
    totalLessons: 42,
    lastActive: "5 ngày trước",
    enrolledDate: "12/09/2026",
    status: "INACTIVE",
  },
  {
    id: "std-006",
    fullName: "Đỗ Gia Huy",
    email: "giahuy.do@gmail.com",
    phone: "0977 123 456",
    city: "Nghệ An",
    avatarColor: "from-cyan-500 to-blue-600",
    enrolledCourse: "Phương Pháp Tọa Độ Không Gian Oxyz",
    courseId: "c-102",
    progressPercent: 64,
    completedLessons: 18,
    totalLessons: 28,
    lastActive: "3 giờ trước",
    enrolledDate: "06/09/2026",
    status: "ACTIVE",
  },
];

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("ALL");
  const [selectedProgress, setSelectedProgress] = useState("ALL");
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery);

    const matchesCourse =
      selectedCourse === "ALL" || s.courseId === selectedCourse;

    let matchesProgress = true;
    if (selectedProgress === "HIGH") matchesProgress = s.progressPercent >= 80;
    else if (selectedProgress === "MEDIUM")
      matchesProgress = s.progressPercent >= 40 && s.progressPercent < 80;
    else if (selectedProgress === "LOW") matchesProgress = s.progressPercent < 40;

    return matchesSearch && matchesCourse && matchesProgress;
  });

  const totalStudents = students.length;
  const avgProgress = Math.round(
    students.reduce((acc, s) => acc + s.progressPercent, 0) / (totalStudents || 1)
  );
  const completedCount = students.filter((s) => s.progressPercent === 100).length;
  const needHelpCount = students.filter((s) => s.progressPercent < 30).length;

  return (
    <div className="space-y-8 w-full pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Quản lý Học sinh
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Theo dõi danh sách học viên, tiến độ hoàn thành bài giảng và kết quả học tập trong các khóa học phụ trách.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 dark:border-slate-800 text-xs flex items-center gap-2 bg-white dark:bg-slate-900"
            onClick={() => alert("Đang xuất danh sách học sinh ra file Excel...")}
          >
            <Download className="size-4" />
            <span>Xuất Excel</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tổng số học viên
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Users className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-400">học sinh</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tiến độ trung bình
            </span>
            <div className="p-2 rounded-xl bg-[var(--surface-muted)] text-[var(--surface-strong)]">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {avgProgress}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">Toàn khóa</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Đã hoàn thành
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {completedCount}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Đạt 100%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Cần hỗ trợ
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <AlertCircle className="size-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
              {needHelpCount}
            </span>
            <span className="text-xs text-amber-600 font-medium">Tiến độ &lt; 30%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo tên học sinh, email, SĐT..."
            className="pl-9 bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Lọc theo khóa học */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Tất cả khóa học</option>
            <option value="c-101">Toán 12 - Chinh Phục Cực Trị & Hàm Số</option>
            <option value="c-102">Phương Pháp Tọa Độ Không Gian Oxyz</option>
            <option value="c-103">Luyện Thi ĐGNL ĐHQG - Toán Logic</option>
          </select>

          {/* Lọc theo tiến độ */}
          <select
            value={selectedProgress}
            onChange={(e) => setSelectedProgress(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">Tất cả tiến độ</option>
            <option value="HIGH">Tiến độ nhanh (≥ 80%)</option>
            <option value="MEDIUM">Tiến độ trung bình (40-79%)</option>
            <option value="LOW">Cần thúc đẩy (&lt; 40%)</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Học sinh</th>
                <th className="py-3.5 px-4">Khóa học ghi danh</th>
                <th className="py-3.5 px-4 min-w-[200px]">Tiến độ học tập</th>
                <th className="py-3.5 px-4">Hoạt động gần nhất</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => (
                  <tr
                    key={std.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Học sinh info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "size-10 rounded-full bg-gradient-to-tr text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs",
                            std.avatarColor
                          )}
                        >
                          {std.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {std.fullName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {std.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Khóa học */}
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-1 max-w-xs">
                        {std.enrolledCourse}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Ngày vào: {std.enrolledDate}
                      </div>
                    </td>

                    {/* Tiến độ */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">
                            {std.progressPercent}%
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {std.completedLessons}/{std.totalLessons} bài
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              std.progressPercent >= 80 && "bg-emerald-500",
                              std.progressPercent >= 40 && std.progressPercent < 80 && "bg-[var(--surface-strong)]",
                              std.progressPercent < 40 && "bg-amber-500"
                            )}
                            style={{ width: `${std.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Hoạt động gần nhất */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-slate-400" />
                        <span>{std.lastActive}</span>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4">
                      <Badge
                        className={cn(
                          "text-[10px] font-semibold border",
                          std.status === "ACTIVE" && "bg-emerald-50 text-emerald-600 border-emerald-200",
                          std.status === "COMPLETED" && "bg-blue-50 text-blue-600 border-blue-200",
                          std.status === "INACTIVE" && "bg-slate-100 text-slate-600 border-slate-200"
                        )}
                      >
                        {std.status === "ACTIVE" && "Đang học"}
                        {std.status === "COMPLETED" && "Hoàn thành"}
                        {std.status === "INACTIVE" && "Tạm dừng"}
                      </Badge>
                    </td>

                    {/* Chi tiết action */}
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedStudent(std)}
                        className="size-8 p-0 rounded-lg text-slate-500 hover:text-[var(--surface-strong)] hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Eye className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Chi tiết học sinh */}
      {selectedStudent && (
        <div
          onClick={() => setSelectedStudent(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-6 cursor-default"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-12 rounded-full bg-gradient-to-tr text-white flex items-center justify-center font-bold text-base shadow-sm",
                    selectedStudent.avatarColor
                  )}
                >
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.fullName}
                  </h2>
                  <span className="text-xs text-slate-400">
                    ID: {selectedStudent.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Email liên hệ
                  </span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 block truncate">
                    {selectedStudent.email}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    Số điện thoại
                  </span>
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1 block">
                    {selectedStudent.phone}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {selectedStudent.enrolledCourse}
                  </span>
                  <Badge className="bg-[var(--surface-strong)] text-white text-[10px]">
                    {selectedStudent.progressPercent}% Hoàn thành
                  </Badge>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--surface-strong)] rounded-full"
                    style={{ width: `${selectedStudent.progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Đã học: {selectedStudent.completedLessons} / {selectedStudent.totalLessons} bài</span>
                  <span>Ngày tham gia: {selectedStudent.enrolledDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl text-xs"
              >
                Đóng
              </Button>
              <Button
                onClick={() => alert(`Gửi tin nhắn thông báo đến ${selectedStudent.fullName}`)}
                className="bg-[var(--surface-strong)] hover:bg-[var(--surface-strong-dark)] text-white text-xs rounded-xl flex items-center gap-1.5"
              >
                <Mail className="size-3.5" />
                <span>Gửi lời nhắc học tập</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
