import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Award,
  BarChart3,
  Percent,
  TrendingUp,
  TrendingDown,
  Printer,
  ChevronDown,
  Globe,
  FileText,
  Calendar,
  Image,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { Student, TeacherStaff, PPDBRegistration, NewsItem, SchoolEvent, GalleryItem } from '../../types';
import { exportStudentReportPDF } from '../../services/pdfExport';

interface AdminOverviewTabProps {
  students: Student[];
  teachers: TeacherStaff[];
  newsList: NewsItem[];
  eventsList: SchoolEvent[];
  galleryList: GalleryItem[];
  ppdbList: PPDBRegistration[];
  onNavigateToTab: (menuId: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  students,
  teachers,
  newsList,
  eventsList,
  galleryList,
  ppdbList,
  onNavigateToTab,
  onNavigateToWebsiteTab,
}) => {
  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [term, setTerm] = useState('2nd Term');

  // Dynamic calculations based on live students state
  const totalCount = students.length > 0 ? students.length : 1250;
  const passedCount = students.filter((s) => s.gpa >= 75).length;
  const passedPercent = students.length > 0 ? ((passedCount / students.length) * 100).toFixed(1) : '86.2';
  const distinctionCount = students.filter((s) => s.gpa >= 88).length;
  const distinctionPercent = students.length > 0 ? ((distinctionCount / students.length) * 100).toFixed(1) : '25.0';
  const avgGpa = students.length > 0
    ? (students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(1)
    : '76.4';
  const failPercent = (100 - parseFloat(passedPercent)).toFixed(1);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TOP HEADER: OVERVIEW + FILTER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-3 font-sans">
            <span>IKHTISAR KINERJA</span>
            <span className="text-sm sm:text-base font-normal text-slate-500 tracking-normal">
              Rangkuman Capaian Akademik Sekolah
            </span>
          </h2>
        </div>

        {/* Right Controls: Academic Year, Term, Purple Print Button */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="relative">
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="appearance-none bg-white text-slate-700 text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="2024/2025">Tahun Ajaran: 2024/2025</option>
              <option value="2025/2026">Tahun Ajaran: 2025/2026</option>
              <option value="2026/2027">Tahun Ajaran: 2026/2027</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="appearance-none bg-white text-slate-700 text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="1st Term">Semester: Ganjil</option>
              <option value="2nd Term">Semester: Genap</option>
              <option value="Final Term">Semester: Ujian Akhir</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => exportStudentReportPDF(students, 'semua')}
            className="w-10 h-10 rounded-xl bg-[#5d3b9e] hover:bg-[#4d2f88] text-white flex items-center justify-center shadow-md shadow-purple-500/20 transition-transform active:scale-95 cursor-pointer"
            title="Cetak / Unduh Laporan PDF"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 5 COLORFUL METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. TOTAL STUDENTS (Royal Blue) */}
        <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white p-5 rounded-2xl shadow-lg shadow-blue-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-100 block">
              TOTAL SISWA
            </span>
            <p className="text-2xl font-black tracking-tight mt-0.5">{totalCount.toLocaleString()}</p>
            <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> ↑ 8.5% vs Semester Lalu
            </span>
          </div>
        </div>

        {/* 2. STUDENTS PASSED (Emerald Green) */}
        <div className="bg-gradient-to-br from-[#059669] to-[#047857] text-white p-5 rounded-2xl shadow-lg shadow-emerald-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-100 block">
              SISWA LULUS / TUNTAS
            </span>
            <p className="text-2xl font-black tracking-tight mt-0.5">{passedCount > 0 ? passedCount : '1,078'}</p>
            <span className="text-[11px] font-semibold text-emerald-200 block mt-0.5">
              {passedPercent}% Tingkat Kelulusan
            </span>
          </div>
        </div>

        {/* 3. DISTINCTIONS (Purple) */}
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] text-white p-5 rounded-2xl shadow-lg shadow-purple-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-100 block">
              PRESTASI UNGGUL
            </span>
            <p className="text-2xl font-black tracking-tight mt-0.5">{distinctionCount > 0 ? distinctionCount : '312'}</p>
            <span className="text-[11px] font-semibold text-purple-200 block mt-0.5">
              {distinctionPercent}% dari Total Siswa
            </span>
          </div>
        </div>

        {/* 4. AVERAGE SCORE (Amber / Orange) */}
        <div className="bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white p-5 rounded-2xl shadow-lg shadow-amber-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-100 block">
              RERATA NILAI
            </span>
            <p className="text-2xl font-black tracking-tight mt-0.5">{avgGpa}%</p>
            <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3 h-3" /> ↑ 4.7% vs Semester Lalu
            </span>
          </div>
        </div>

        {/* 5. FAIL RATE (Cyan / Teal) */}
        <div className="bg-gradient-to-br from-[#0891b2] to-[#0e7490] text-white p-5 rounded-2xl shadow-lg shadow-cyan-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
          <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
            <Percent className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-100 block">
              TINGKAT REMEDIAL
            </span>
            <p className="text-2xl font-black tracking-tight mt-0.5">{failPercent}%</p>
            <span className="text-[11px] font-semibold text-cyan-200 flex items-center gap-0.5 mt-0.5">
              <TrendingDown className="w-3 h-3" /> ↓ 4.7% vs Semester Lalu
            </span>
          </div>
        </div>
      </div>

      {/* WEBSITE SYNC STATUS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Status Integrasi Website Sekolah SMAK Setia Bakti</h4>
            <p className="text-[11px] text-slate-500">
              Seluruh input dan perubahan data di dasbor admin langsung disinkronkan ke halaman publik website.
            </p>
          </div>
        </div>

        {/* Quick Data Count Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => onNavigateToTab('berita')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>{newsList.length} Berita</span>
          </button>

          <button
            onClick={() => onNavigateToTab('berita')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{eventsList.length} Agenda</span>
          </button>

          <button
            onClick={() => onNavigateToTab('ppdb')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
            <span>{ppdbList.length} Pendaftar PPDB</span>
          </button>

          <button
            onClick={() => onNavigateToTab('guru')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{teachers.length} Guru/Staf</span>
          </button>

          <button
            onClick={() => onNavigateToTab('galeri')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
          >
            <Image className="w-3.5 h-3.5 text-pink-600" />
            <span>{galleryList.length} Galeri</span>
          </button>

          {onNavigateToWebsiteTab && (
            <button
              onClick={() => onNavigateToWebsiteTab('beranda')}
              className="px-3 py-1 rounded-lg bg-[#3b1d70] hover:bg-[#2b1454] text-white font-bold transition-colors cursor-pointer shadow-sm"
            >
              Lihat Website →
            </button>
          )}
        </div>
      </div>

      {/* MIDDLE SECTION: 3 COLUMNS (Donut Chart, Subject Bar Chart, Top Performing Students) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1 (Left 4 cols): RESULT SUMMARY DONUT */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">REKAPITULASI NILAI</h3>
            <p className="text-xs text-slate-400 mt-0.5">Distribusi Predikat Nilai Seluruh Siswa</p>
          </div>

          {/* Donut Chart SVG */}
          <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray="25, 100"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500"
                strokeDasharray="35.6, 100"
                strokeDashoffset="-25"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-indigo-500"
                strokeDasharray="18.2, 100"
                strokeDashoffset="-60.6"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-amber-500"
                strokeDasharray="12.4, 100"
                strokeDashoffset="-78.8"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-rose-500"
                strokeDasharray="8.8, 100"
                strokeDashoffset="-91.2"
                strokeWidth="4.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-slate-800 tracking-tight">1,250</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TOTAL SISWA</span>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Sangat Baik / A (80 - 100)
              </span>
              <span className="font-bold text-slate-800">25.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Baik / B (60 - 79)
              </span>
              <span className="font-bold text-slate-800">35.6%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Cukup / C (50 - 59)
              </span>
              <span className="font-bold text-slate-800">18.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Kurang / D (40 - 49)
              </span>
              <span className="font-bold text-slate-800">12.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Remedial / E (0 - 39)
              </span>
              <span className="font-bold text-slate-800">8.8%</span>
            </div>
          </div>
        </div>

        {/* COLUMN 2 (Middle 4 cols): AVERAGE SCORE BY SUBJECT (BAR CHART) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">
              RERATA NILAI PER MAPEL
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Mata Pelajaran Pokok Akademik</p>
          </div>

          <div className="h-56 my-2 flex items-end justify-between gap-3 px-2 pt-6 relative border-b border-slate-200">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
              <div className="border-b border-slate-400 w-full" />
            </div>

            {[
              { subject: 'Matematika', score: 82, color: 'from-blue-500 to-indigo-600' },
              { subject: 'B. Inggris', score: 76, color: 'from-emerald-500 to-teal-600' },
              { subject: 'IPA Sains', score: 72, color: 'from-purple-500 to-indigo-600' },
              { subject: 'IPS Terpadu', score: 69, color: 'from-amber-500 to-orange-600' },
              { subject: 'Informatika', score: 65, color: 'from-cyan-500 to-blue-600' },
            ].map((col) => (
              <div key={col.subject} className="flex-1 flex flex-col items-center gap-2 z-10">
                <span className="text-[11px] font-bold text-slate-700">{col.score}%</span>
                <div
                  className={`w-full max-w-[36px] bg-gradient-to-t ${col.color} rounded-t-lg transition-all duration-500 shadow`}
                  style={{ height: `${col.score * 1.8}px` }}
                />
                <span className="text-[10px] font-semibold text-slate-500 text-center truncate w-full">
                  {col.subject}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Standar KKTP Sekolah: 75.0</span>
            <span className="font-bold text-emerald-600">80% Tercapai</span>
          </div>
        </div>

        {/* COLUMN 3 (Right 4 cols): TOP PERFORMING STUDENTS */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">
              SISWA PRESTASI TERBAIK
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Peringkat & Nilai Rapor Tertinggi</p>
          </div>

          <div className="space-y-2.5 my-3">
            {[
              { rank: 1, name: 'Maria Fransiska Jelita', score: '95.6%', medal: 'bg-amber-400 text-purple-950', border: 'border-amber-400/40' },
              { rank: 2, name: 'Yohanes Kevin Jebarus', score: '92.4%', medal: 'bg-slate-300 text-slate-900', border: 'border-slate-300' },
              { rank: 3, name: 'Theresia Avilla Ndua', score: '91.1%', medal: 'bg-amber-600 text-white', border: 'border-amber-600/40' },
              { rank: 4, name: 'Fransiskus Xaverius Dahu', score: '89.7%', medal: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
              { rank: 5, name: 'Katarina Melati Nardi', score: '88.9%', medal: 'bg-slate-100 text-slate-600', border: 'border-slate-200' },
            ].map((st) => (
              <div
                key={st.rank}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shadow-sm border ${st.medal} ${st.border}`}
                  >
                    {st.rank}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{st.name}</h4>
                    <p className="text-[10px] text-slate-400">SMAK Setia Bakti • X-MIPA</p>
                  </div>
                </div>
                <span className="text-xs font-black text-[#5d3b9e] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                  {st.score}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateToTab('siswa')}
            className="w-full py-2 bg-slate-50 hover:bg-purple-50 text-purple-900 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
          >
            Lihat Semua Siswa &gt;
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION: CLASS PERFORMANCE OVERVIEW TABLE & PASS RATE DONUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table 8 cols */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">
                IKHTISAR KINERJA PER KELAS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Rangkuman capaian akademik per rombongan belajar</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">5 Rombongan Belajar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1730] text-slate-200 text-[10px] uppercase font-bold tracking-wider rounded-xl">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">KELAS / ROMBEL</th>
                  <th className="py-3 px-3">TOTAL SISWA</th>
                  <th className="py-3 px-3">RERATA NILAI</th>
                  <th className="py-3 px-3">PERSENTASE LULUS</th>
                  <th className="py-3 px-3">PRESTASI SANGAT BAIK</th>
                  <th className="py-3 px-3">TINGKAT REMEDIAL</th>
                  <th className="py-3 px-4 rounded-r-xl">TREN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {[
                  { cls: 'Kelas X - MIPA 1', total: 250, avg: '78.5%', pass: '88.0%', dist: 65, fail: '12.0%', trend: 'up' },
                  { cls: 'Kelas X - MIPA 2', total: 245, avg: '76.2%', pass: '85.7%', dist: 58, fail: '14.3%', trend: 'up' },
                  { cls: 'Kelas XI - MIPA 1', total: 255, avg: '74.8%', pass: '84.3%', dist: 62, fail: '15.7%', trend: 'down' },
                  { cls: 'Kelas XI - IPS 1', total: 248, avg: '77.1%', pass: '87.5%', dist: 68, fail: '12.5%', trend: 'up' },
                  { cls: 'Kelas XII - MIPA', total: 252, avg: '75.9%', pass: '85.3%', dist: 59, fail: '14.7%', trend: 'down' },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.cls}</td>
                    <td className="py-3 px-3 text-slate-600">{row.total}</td>
                    <td className="py-3 px-3 font-bold text-[#5d3b9e]">{row.avg}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">{row.pass}</td>
                    <td className="py-3 px-3 text-purple-700 font-semibold">{row.dist}</td>
                    <td className="py-3 px-3 text-rose-500 font-semibold">{row.fail}</td>
                    <td className="py-3 px-4">
                      {row.trend === 'up' ? (
                        <span className="inline-flex items-center text-emerald-600 font-bold text-[11px] gap-0.5">
                          <TrendingUp className="w-3.5 h-3.5" /> +2.4%
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-500 font-bold text-[11px] gap-0.5">
                          <TrendingDown className="w-3.5 h-3.5" /> -1.1%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pass Rate by Class Donut + Motivation Card 4 cols */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase mb-1">
              KELULUSAN PER KELAS
            </h3>
            <p className="text-xs text-slate-400 mb-4">Proporsi capaian kelulusan antar jenjang</p>

            <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  className="text-slate-100"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500"
                  strokeDasharray="86.2, 100"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-800">86.2%</span>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                  KELULUSAN TOTAL
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-[#1c274c] text-white p-5 rounded-2xl border border-indigo-700/40 shadow-md">
            <div className="flex items-center gap-2 text-amber-300 mb-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-sm">★</span>
              ))}
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Pertahankan Prestasi Membanggakan Ini!</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Capaian akademik siswa semester ini melampaui target yayasan dengan tingkat kelulusan 86.2%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
