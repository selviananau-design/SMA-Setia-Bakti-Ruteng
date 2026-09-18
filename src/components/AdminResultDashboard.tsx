import React, { useState } from 'react';
import {
  GraduationCap,
  LayoutGrid,
  Users,
  BarChart3,
  BookOpen,
  Building,
  UserCheck,
  CalendarDays,
  FileDown,
  Settings,
  Printer,
  ChevronDown,
  Trophy,
  Award,
  ClipboardList,
  Percent,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Plus,
  Search,
  FileSpreadsheet,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Send,
  Bell,
  ArrowLeft,
} from 'lucide-react';
import { Student, PPDBRegistration, PushNotification, UserSession, TeacherStaff } from '../types';
import { exportStudentReportPDF } from '../services/pdfExport';
import { downloadStudentTemplate, exportCurrentStudentsToCSV } from '../services/excelTemplate';
import { simulateAesEncrypt, maskSensitiveData, logAuditEvent } from '../services/encryption';
import { INITIAL_TEACHERS } from '../data/mockData';

interface AdminResultDashboardProps {
  session: UserSession;
  students: Student[];
  ppdbList: PPDBRegistration[];
  notifications: PushNotification[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onUpdatePPDBStatus: (id: string, status: PPDBRegistration['status'], notes?: string) => void;
  onSendPushNotification: (
    title: string,
    message: string,
    target: 'all' | 'guru' | 'orangtua' | 'siswa',
    priority: 'urgent' | 'info' | 'akademik'
  ) => void;
  onBackToPortal?: () => void;
}

export const AdminResultDashboard: React.FC<AdminResultDashboardProps> = ({
  session,
  students,
  ppdbList,
  notifications,
  onAddStudent,
  onDeleteStudent,
  onUpdatePPDBStatus,
  onSendPushNotification,
  onBackToPortal,
}) => {
  const [activeMenu, setActiveMenu] = useState<
    | 'overview'
    | 'students'
    | 'results'
    | 'subjects'
    | 'classes'
    | 'teachers'
    | 'attendance'
    | 'reports'
    | 'settings'
  >('overview');

  const [academicYear, setAcademicYear] = useState('2024/2025');
  const [term, setTerm] = useState('2nd Term');

  // Students Management state
  const [studentSearch, setStudentSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'semua' | 'aktif' | 'alumni'>('semua');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showDecryptedData, setShowDecryptedData] = useState(false);

  // Push notification broadcaster state
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState<'all' | 'guru' | 'orangtua' | 'siswa'>('all');
  const [notifPriority, setNotifPriority] = useState<'urgent' | 'info' | 'akademik'>('info');

  // Form input for new student
  const [newStudent, setNewStudent] = useState({
    name: '',
    nisn: '',
    nik: '',
    gender: 'L' as 'L' | 'P',
    classLevel: 'X' as 'X' | 'XI' | 'XII',
    className: 'X-MIPA 1',
    major: 'MIPA' as 'MIPA' | 'IPS' | 'Bahasa & Budaya',
    status: 'aktif' as 'aktif' | 'alumni',
    phone: '',
    parentName: '',
    parentPhone: '',
    address: 'Ruteng',
    gpa: '88.0',
    attendanceRate: '98.5',
    graduationYear: '',
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.nisn || !newStudent.nik) {
      alert('Nama, NISN, dan NIK wajib diisi.');
      return;
    }

    const studentRecord: Student = {
      id: `s-${Date.now()}`,
      name: newStudent.name,
      nisn: newStudent.nisn,
      nik: newStudent.nik,
      gender: newStudent.gender,
      classLevel: newStudent.classLevel,
      className: newStudent.className,
      major: newStudent.major,
      status: newStudent.status,
      phone: newStudent.phone || '081234567890',
      parentName: newStudent.parentName || 'Orang Tua Siswa',
      parentPhone: newStudent.parentPhone || '081398765432',
      address: newStudent.address,
      gpa: parseFloat(newStudent.gpa) || 85.0,
      attendanceRate: parseFloat(newStudent.attendanceRate) || 98.0,
      tuitionStatus: 'Lunas',
      encryptedHash: simulateAesEncrypt(`${newStudent.nik}:${newStudent.name}`),
      graduationYear: newStudent.status === 'alumni' ? parseInt(newStudent.graduationYear) || 2024 : undefined,
    };

    onAddStudent(studentRecord);
    logAuditEvent(session.name, 'ENCRYPT', `Pendaftaran Siswa Baru: ${newStudent.name}`, 'SUCCESS');
    setShowAddStudentModal(false);
    alert(`Data siswa ${newStudent.name} berhasil disimpan dan dienkripsi dengan standar AES-256!`);
  };

  const toggleDecryption = () => {
    if (!showDecryptedData) {
      const pin = prompt('Masukkan Kunci Otorisasi Keamanan Admin (Demo PIN: 1234):');
      if (pin === '1234') {
        setShowDecryptedData(true);
        logAuditEvent(session.name, 'DECRYPT', 'Dekripsi Data Sensitif Siswa', 'SUCCESS');
      } else {
        alert('Kunci Otorisasi salah! Akses ditolak demi privasi data.');
        logAuditEvent(session.name, 'DECRYPT', 'Otorisasi Gagal', 'DENIED');
      }
    } else {
      setShowDecryptedData(false);
    }
  };

  const handleBroadcastNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    onSendPushNotification(notifTitle, notifMessage, notifTarget, notifPriority);
    setNotifTitle('');
    setNotifMessage('');
    alert('Notifikasi push berhasil disiarkan secara real-time!');
  };

  // Filtered students for Students tab
  const filteredStudents = students.filter((s) => {
    const matchesStatus = filterStatus === 'semua' || s.status === filterStatus;
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisn.includes(studentSearch) ||
      s.className.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0d1527] p-2 sm:p-4 lg:p-6 font-sans antialiased text-slate-800">
      {/* Outer Rounded Container with dark navy header curve */}
      <div className="max-w-[1600px] mx-auto bg-[#0a0f1d] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col lg:flex-row">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-full lg:w-64 bg-[#0a1124] text-slate-300 flex flex-col justify-between border-r border-slate-800/60 p-5 flex-shrink-0">
          <div>
            {/* Logo / Brand matching the screenshot */}
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-wider leading-tight">
                  STUDENT RESULT
                </h1>
                <p className="text-[11px] font-bold text-sky-400 tracking-widest uppercase">
                  DASHBOARD
                </p>
              </div>
            </div>

            {/* Navigation Menu Items matching image */}
            <nav className="mt-6 space-y-1.5">
              {[
                { id: 'overview', label: 'Overview', icon: LayoutGrid },
                { id: 'students', label: 'Students', icon: Users },
                { id: 'results', label: 'Results', icon: BarChart3 },
                { id: 'subjects', label: 'Subjects', icon: BookOpen },
                { id: 'classes', label: 'Classes', icon: Building },
                { id: 'teachers', label: 'Teachers', icon: UserCheck },
                { id: 'attendance', label: 'Attendance', icon: CalendarDays },
                { id: 'reports', label: 'Reports', icon: FileDown },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id as any)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 translate-x-1'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Card: Education Quote with Trophy */}
          <div className="mt-8 pt-4">
            <div className="bg-gradient-to-b from-[#131c38] to-[#0d1429] p-4 rounded-2xl border border-blue-900/40 text-center relative overflow-hidden shadow-inner">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md shadow-amber-500/20 border border-amber-400/30">
                <Trophy className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-200 font-serif italic leading-relaxed">
                “ Education is the key to success. Keep learning, keep growing! ”
              </p>
              <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                <span>SMAK Setia Bakti</span>
                <span className="text-sky-400 font-mono font-bold">Ruteng</span>
              </div>
            </div>

            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="w-full mt-3 py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Web Portal</span>
              </button>
            )}
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 bg-[#f4f7fc] p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* ================= TAB 1: OVERVIEW (EXACT SCREENSHOT REPLICA) ================= */}
          {activeMenu === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* TOP HEADER: OVERVIEW + FILTER CONTROLS */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-3 font-sans">
                    <span>OVERVIEW</span>
                    <span className="text-sm sm:text-base font-normal text-slate-500 tracking-normal">
                      Performance at a Glance
                    </span>
                  </h2>
                </div>

                {/* Right Controls: Academic Year, Term, Purple Print Button */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                  {/* Academic Year Selector */}
                  <div className="relative">
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="appearance-none bg-white text-slate-700 text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="2024/2025">Academic Year: 2024/2025</option>
                      <option value="2025/2026">Academic Year: 2025/2026</option>
                      <option value="2026/2027">Academic Year: 2026/2027</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Term Selector */}
                  <div className="relative">
                    <select
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="appearance-none bg-white text-slate-700 text-xs font-semibold px-4 py-2.5 pr-8 rounded-xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="1st Term">Term: 1st Term</option>
                      <option value="2nd Term">Term: 2nd Term</option>
                      <option value="Final Term">Term: Final Term</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Purple Print / Export Button */}
                  <button
                    onClick={() => exportStudentReportPDF(students, 'semua')}
                    className="w-10 h-10 rounded-xl bg-[#5d3b9e] hover:bg-[#4d2f88] text-white flex items-center justify-center shadow-md shadow-purple-500/20 transition-transform active:scale-95 cursor-pointer"
                    title="Print / Unduh Laporan PDF"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 5 COLORFUL METRIC CARDS (Exact match to top row of screenshot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. TOTAL STUDENTS (Royal Blue) */}
                <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white p-5 rounded-2xl shadow-lg shadow-blue-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
                  <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-100 block">
                      TOTAL STUDENTS
                    </span>
                    <p className="text-2xl font-black tracking-tight mt-0.5">1,250</p>
                    <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-0.5 mt-0.5">
                      <TrendingUp className="w-3 h-3" /> ↑ 8.5% vs Last Term
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
                      STUDENTS PASSED
                    </span>
                    <p className="text-2xl font-black tracking-tight mt-0.5">1,078</p>
                    <span className="text-[11px] font-semibold text-emerald-200 block mt-0.5">
                      86.2% Pass Rate
                    </span>
                  </div>
                </div>

                {/* 3. DISTINCTIONS (Royal Purple) */}
                <div className="bg-gradient-to-br from-[#6d28d9] to-[#5b21b6] text-white p-5 rounded-2xl shadow-lg shadow-purple-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
                  <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-100 block">
                      DISTINCTIONS
                    </span>
                    <p className="text-2xl font-black tracking-tight mt-0.5">312</p>
                    <span className="text-[11px] font-semibold text-purple-200 block mt-0.5">
                      25.0% of Total
                    </span>
                  </div>
                </div>

                {/* 4. AVERAGE SCORE (Orange/Amber) */}
                <div className="bg-gradient-to-br from-[#ea580c] to-[#c2410c] text-white p-5 rounded-2xl shadow-lg shadow-orange-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
                  <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <ClipboardList className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-100 block">
                      AVERAGE SCORE
                    </span>
                    <p className="text-2xl font-black tracking-tight mt-0.5">76.4%</p>
                    <span className="text-[11px] font-semibold text-emerald-300 flex items-center gap-0.5 mt-0.5">
                      <TrendingUp className="w-3 h-3" /> ↑ 4.7% vs Last Term
                    </span>
                  </div>
                </div>

                {/* 5. FAIL RATE (Cyan/Teal) */}
                <div className="bg-gradient-to-br from-[#0891b2] to-[#0e7490] text-white p-5 rounded-2xl shadow-lg shadow-cyan-500/15 flex items-center gap-4 transition-transform hover:-translate-y-1">
                  <div className="w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                    <Percent className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-100 block">
                      FAIL RATE
                    </span>
                    <p className="text-2xl font-black tracking-tight mt-0.5">13.8%</p>
                    <span className="text-[11px] font-semibold text-rose-300 flex items-center gap-0.5 mt-0.5">
                      <TrendingDown className="w-3 h-3" /> ↓ 4.7% vs Last Term
                    </span>
                  </div>
                </div>
              </div>

              {/* MIDDLE 3 COLUMNS: RESULT SUMMARY (DONUT), AVERAGE SCORE BY SUBJECT (BARS), TOP PERFORMING STUDENTS (LIST) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. RESULT SUMMARY (Donut Chart) - 4 Cols */}
                <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
                    RESULT SUMMARY
                  </h3>

                  <div className="flex flex-col items-center justify-center my-2">
                    {/* SVG Donut Chart with center label */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                        {/* 1. Distinction: 25.0% - Purple (#8b5cf6) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#7c3aed"
                          strokeWidth="18"
                          strokeDasharray="59.7 179"
                          strokeDashoffset="0"
                        />
                        {/* 2. Credit: 35.6% - Green (#10b981) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="18"
                          strokeDasharray="85 153.7"
                          strokeDashoffset="-59.7"
                        />
                        {/* 3. Pass: 18.2% - Blue (#3b82f6) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#3b82f6"
                          strokeWidth="18"
                          strokeDasharray="43.5 195.2"
                          strokeDashoffset="-144.7"
                        />
                        {/* 4. Average: 12.4% - Orange (#f97316) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#f97316"
                          strokeWidth="18"
                          strokeDasharray="29.6 209.1"
                          strokeDashoffset="-188.2"
                        />
                        {/* 5. Fail: 8.8% - Red/Coral (#ef4444) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          fill="transparent"
                          stroke="#ef4444"
                          strokeWidth="18"
                          strokeDasharray="21 217.7"
                          strokeDashoffset="-217.8"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-black text-slate-900">1,250</span>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider">TOTAL</span>
                      </div>
                    </div>
                  </div>

                  {/* Legend matching exact values in screenshot */}
                  <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#7c3aed]"></span>
                        Distinction (80-100)
                      </span>
                      <span className="font-bold text-slate-900 font-mono">312 (25.0%)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                        Credit (60-79)
                      </span>
                      <span className="font-bold text-slate-900 font-mono">445 (35.6%)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]"></span>
                        Pass (50-59)
                      </span>
                      <span className="font-bold text-slate-900 font-mono">228 (18.2%)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]"></span>
                        Average (40-49)
                      </span>
                      <span className="font-bold text-slate-900 font-mono">155 (12.4%)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-700 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                        Fail (0-39)
                      </span>
                      <span className="font-bold text-slate-900 font-mono">110 (8.8%)</span>
                    </div>
                  </div>
                </div>

                {/* 2. AVERAGE SCORE BY SUBJECT (Bar Chart) - 5 Cols */}
                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                    AVERAGE SCORE BY SUBJECT
                  </h3>

                  {/* Vertical Bar Chart Container */}
                  <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-3 relative">
                    {/* Background Y-Axis Grid Lines */}
                    <div className="absolute inset-x-3 inset-y-6 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400 font-mono">
                      <div className="border-b border-dashed border-slate-200 flex justify-between">
                        <span>100%</span>
                      </div>
                      <div className="border-b border-dashed border-slate-200 flex justify-between">
                        <span>75%</span>
                      </div>
                      <div className="border-b border-dashed border-slate-200 flex justify-between">
                        <span>50%</span>
                      </div>
                      <div className="border-b border-dashed border-slate-200 flex justify-between">
                        <span>25%</span>
                      </div>
                      <div className="border-b border-slate-300 flex justify-between">
                        <span>0%</span>
                      </div>
                    </div>

                    {/* Bars matching the image */}
                    {[
                      { name: 'Mathematics', score: 82, color: 'bg-[#2563eb]' },
                      { name: 'English', score: 76, color: 'bg-[#10b981]' },
                      { name: 'Science', score: 72, color: 'bg-[#7c3aed]' },
                      { name: 'Social Studies', score: 69, color: 'bg-[#f97316]' },
                      { name: 'Computer Studies', score: 65, color: 'bg-[#06b6d4]' },
                    ].map((subject, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end z-10 group">
                        <span className="text-[11px] font-black text-slate-800 mb-1 opacity-90 group-hover:scale-110 transition-transform">
                          {subject.score}%
                        </span>
                        <div className="w-8 sm:w-11 bg-slate-100 rounded-t-lg overflow-hidden flex items-end h-[75%]">
                          <div
                            className={`w-full ${subject.color} rounded-t-lg transition-all duration-700 hover:brightness-110 shadow-sm`}
                            style={{ height: `${subject.score}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-2 text-center truncate max-w-[70px] sm:max-w-none block">
                          {subject.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. TOP PERFORMING STUDENTS (Rank List) - 3 Cols */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      TOP PERFORMING STUDENTS
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { rank: 1, name: 'Aisha Muhammad', score: '95.6%', badgeColor: 'bg-amber-400 text-white shadow-amber-400/40' },
                      { rank: 2, name: 'Ibrahim Yakubu', score: '92.4%', badgeColor: 'bg-slate-300 text-slate-700' },
                      { rank: 3, name: 'Fatima Ahmed', score: '91.1%', badgeColor: 'bg-amber-600 text-white' },
                      { rank: 4, name: 'Daniel Oladipo', score: '89.7%', badgeColor: 'bg-slate-100 text-slate-600' },
                      { rank: 5, name: 'Zainab Usman', score: '88.9%', badgeColor: 'bg-slate-100 text-slate-600' },
                    ].map((student) => (
                      <div
                        key={student.rank}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${student.badgeColor}`}
                          >
                            {student.rank}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{student.name}</span>
                        </div>
                        <span className="text-xs font-black text-emerald-600 font-mono">
                          {student.score}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                    <span className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer">
                      Lihat Semua Peringkat Siswa &gt;
                    </span>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: CLASS PERFORMANCE OVERVIEW (WIDE TABLE) + RIGHT STACK (PASS RATE DONUT + MOTIVATIONAL CARD) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. CLASS PERFORMANCE OVERVIEW TABLE (8 Cols) */}
                <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">
                    CLASS PERFORMANCE OVERVIEW
                  </h3>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      {/* Dark Navy Table Header matching screenshot */}
                      <thead>
                        <tr className="bg-[#121c38] text-white uppercase text-[10px] font-black tracking-wider rounded-xl">
                          <th className="py-3 px-4 rounded-l-xl">CLASS</th>
                          <th className="py-3 px-4 text-center">TOTAL STUDENTS</th>
                          <th className="py-3 px-4 text-center">AVERAGE SCORE</th>
                          <th className="py-3 px-4 text-center">PASS RATE</th>
                          <th className="py-3 px-4 text-center">DISTINCTIONS</th>
                          <th className="py-3 px-4 text-center">FAIL RATE</th>
                          <th className="py-3 px-4 rounded-r-xl text-center">TREND</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { cls: 'SS 1', students: 250, avg: '78.6%', pass: '88.5%', dist: '68 (27.2%)', fail: '11.5%', trendPositive: true },
                          { cls: 'SS 2', students: 240, avg: '76.1%', pass: '86.7%', dist: '60 (25.0%)', fail: '13.3%', trendPositive: true },
                          { cls: 'SS 3', students: 230, avg: '74.2%', pass: '84.1%', dist: '50 (21.7%)', fail: '15.9%', trendPositive: false },
                          { cls: 'SS 4', students: 270, avg: '75.8%', pass: '85.6%', dist: '64 (23.7%)', fail: '14.4%', trendPositive: true },
                          { cls: 'SS 5', students: 260, avg: '77.3%', pass: '86.1%', dist: '70 (26.9%)', fail: '13.9%', trendPositive: true },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-black text-slate-800">{row.cls}</td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-700 font-mono">
                              {row.students}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                              {row.avg}
                            </td>
                            <td className="py-3.5 px-4 text-center font-black text-emerald-600">
                              {row.pass}
                            </td>
                            <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                              {row.dist}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-rose-500">
                              {row.fail}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {/* Sparkline wave matching screenshot */}
                              <div className="flex items-center justify-center">
                                <svg className="w-16 h-5" viewBox="0 0 60 20" fill="none">
                                  {row.trendPositive ? (
                                    <path
                                      d="M2 15 L15 12 L28 14 L42 6 L58 4"
                                      stroke="#10b981"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  ) : (
                                    <path
                                      d="M2 5 L16 8 L30 6 L44 14 L58 16"
                                      stroke="#ef4444"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  )}
                                </svg>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. RIGHT SIDE STACK (4 Cols): PASS RATE BY CLASS + MOTIVATIONAL BANNER */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Card 1: PASS RATE BY CLASS (Donut) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                      PASS RATE BY CLASS
                    </h3>

                    <div className="flex items-center justify-center my-3">
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90 transform">
                          {/* 5 Slices for SS1, SS2, SS3, SS4, SS5 */}
                          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#3b82f6" strokeWidth="16" strokeDasharray="45 181" strokeDashoffset="0" />
                          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#06b6d4" strokeWidth="16" strokeDasharray="45 181" strokeDashoffset="-45" />
                          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#a855f7" strokeWidth="16" strokeDasharray="45 181" strokeDashoffset="-90" />
                          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#f97316" strokeWidth="16" strokeDasharray="45 181" strokeDashoffset="-135" />
                          <circle cx="50" cy="50" r="36" fill="transparent" stroke="#6366f1" strokeWidth="16" strokeDasharray="46 180" strokeDashoffset="-180" />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-base font-black text-slate-900">86.2%</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight leading-tight">
                            OVERALL<br />PASS RATE
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                        <span className="text-slate-600 font-medium">SS 1: 88.5%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                        <span className="text-slate-600 font-medium">SS 2: 86.7%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#a855f7]" />
                        <span className="text-slate-600 font-medium">SS 3: 84.1%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                        <span className="text-slate-600 font-medium">SS 4: 85.6%</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                        <span className="text-slate-600 font-medium">SS 5: 86.1%</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Keep up the great work! (Motivational Card with Books & Graduation Cap) */}
                  <div className="bg-gradient-to-br from-white to-blue-50/60 p-5 rounded-2xl border border-blue-100 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-slate-900 leading-snug">
                        Keep up the great work!
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        Consistent effort today leads to brighter tomorrows.
                      </p>
                      {/* 5 Stars */}
                      <div className="flex items-center gap-1 pt-1 text-amber-400 text-xs">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>
                    </div>

                    {/* Graduation Cap atop Books & Diploma Graphic */}
                    <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center relative">
                      <div className="w-16 h-12 bg-gradient-to-tr from-rose-600 to-rose-400 rounded-lg shadow-md absolute bottom-0 transform -rotate-3 flex items-center justify-center text-white text-[10px] font-bold">
                        <div className="w-full h-1 bg-white/40 mb-3" />
                      </div>
                      <div className="w-14 h-11 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-lg shadow absolute bottom-2 transform rotate-2 flex items-center justify-center">
                        <div className="w-full h-1 bg-white/40 mb-3" />
                      </div>
                      {/* Toga Cap on top */}
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center absolute -top-1 shadow-lg border-2 border-white">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER ATTRIBUTION BAR (Exact match to screenshot bottom) */}
              <div className="pt-4 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                <span>Data is updated as of May 27, 2025</span>
                <span>|</span>
                <span className="font-semibold text-slate-600">
                  Source: School Academic System • SMA Katolik Setia Bakti Ruteng
                </span>
              </div>
            </div>
          )}

          {/* ================= TAB 2: STUDENTS (MANAGEMENT & ENCRYPTION) ================= */}
          {activeMenu === 'students' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Kelola Data Siswa & Enkripsi NIK</h2>
                  <p className="text-xs text-slate-500">
                    Input data siswa baru, ekspor Excel/PDF, dan kelola privasi kriptografi 256-bit.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Input Siswa Baru</span>
                  </button>
                  <button
                    onClick={downloadStudentTemplate}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Template Excel</span>
                  </button>
                  <button
                    onClick={() => exportCurrentStudentsToCSV(students)}
                    className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Ekspor CSV</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={toggleDecryption}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      showDecryptedData
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {showDecryptedData ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showDecryptedData ? 'Kunci Enkripsi NIK' : 'Buka Masker NIK (PIN 1234)'}</span>
                  </button>

                  <select
                    value={filterStatus}
                    onChange={(e: any) => setFilterStatus(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none"
                  >
                    <option value="semua">Semua Siswa</option>
                    <option value="aktif">Siswa Aktif</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Cari nama, NISN, kelas..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Students Data Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#121c38] text-white uppercase text-[10px] font-black tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">NISN</th>
                        <th className="py-3.5 px-4">NIK (Terenkripsi AES-256)</th>
                        <th className="py-3.5 px-4">Nama Lengkap Siswa</th>
                        <th className="py-3.5 px-4">Kelas & Jurusan</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Wali Murid</th>
                        <th className="py-3.5 px-4 text-center">Nilai Rapor</th>
                        <th className="py-3.5 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-900">{s.nisn}</td>
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                            {showDecryptedData ? (
                              <span className="text-emerald-700 font-bold">{s.nik}</span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Lock className="w-3 h-3 text-purple-600 inline" />
                                <span>{maskSensitiveData(s.nik, 'nik')}</span>
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-purple-900">{s.className}</span>
                            <span className="text-[10px] text-slate-400 block">{s.major}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                s.status === 'aktif'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-indigo-100 text-indigo-800'
                              }`}
                            >
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-600">
                            <p className="font-semibold">{s.parentName}</p>
                            <p className="font-mono text-slate-400">
                              {showDecryptedData ? s.parentPhone : maskSensitiveData(s.parentPhone, 'phone')}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-center font-black text-blue-600 font-mono">
                            {s.gpa.toFixed(1)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => onDeleteStudent(s.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                              title="Hapus Siswa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: RESULTS (HASIL NILAI & UJIAN) ================= */}
          {activeMenu === 'results' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Rekapitulasi Nilai & Hasil Ujian Siswa</h2>
                  <p className="text-xs text-slate-500">Tahun Akademik: {academicYear} • {term}</p>
                </div>
                <button
                  onClick={() => exportStudentReportPDF(students, 'semua')}
                  className="px-4 py-2 bg-[#5d3b9e] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Buku Rapor PDF</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Rerata Sekolah</span>
                  <p className="text-2xl font-black text-blue-600 mt-1">76.4%</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Target 75.0% Tercapai</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Distinction (80+)</span>
                  <p className="text-2xl font-black text-purple-600 mt-1">312 Siswa</p>
                  <span className="text-[10px] text-purple-600 font-bold">25.0% dari Total</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Kelulusan</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">100%</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Standar Unggul</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Perlu Pengayaan</span>
                  <p className="text-2xl font-black text-orange-600 mt-1">110 Siswa</p>
                  <span className="text-[10px] text-slate-500 font-bold">Remedial Terjadwal</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: SUBJECTS (MATA PELAJARAN) ================= */}
          {activeMenu === 'subjects' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-900">Mata Pelajaran & Kurikulum Merdeka</h2>
                <p className="text-xs text-slate-500">Distribusi alokasi jam pelajaran dan koordinator mapel</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Mathematics', score: '82%', hours: '4 JP/Minggu', coord: 'Sr. Maria Anselma, S.Pd.' },
                  { name: 'English Language', score: '76%', hours: '4 JP/Minggu', coord: 'Yohanes Don Bosco, M.Pd.' },
                  { name: 'Science (Fisika & Biologi)', score: '72%', hours: '6 JP/Minggu', coord: 'Theresia Imelda Ndua, M.Si.' },
                  { name: 'Social Studies (Ekonomi & Sejarah)', score: '69%', hours: '5 JP/Minggu', coord: 'Drs. Petrus Kanisius Dadi' },
                  { name: 'Computer Studies / TIK', score: '65%', hours: '3 JP/Minggu', coord: 'Stefanus Ngganggu, S.Kom.' },
                  { name: 'Pendidikan Agama Katolik & Budi Pekerti', score: '92%', hours: '3 JP/Minggu', coord: 'RD. Fransiskus Xaverius, Pr' },
                ].map((s, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {s.hours}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                    <p className="text-xs text-slate-500">Koordinator: <span className="font-semibold text-slate-800">{s.coord}</span></p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Rerata Nilai:</span>
                      <span className="font-black text-emerald-600 text-sm font-mono">{s.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: CLASSES (KELAS / ROMBEL) ================= */}
          {activeMenu === 'classes' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-900">Struktur Rombongan Belajar (Rombel)</h2>
                <p className="text-xs text-slate-500">24 Kelas Terbagi dalam Tingkat X, XI, dan XII SMAK Setia Bakti</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Kelas X (Fase E)', total: '260 Siswa', rombel: '8 Kelas (X-1 s/d X-8)', walikelas: '8 Guru Pembimbing' },
                  { name: 'Kelas XI (Fase F)', total: '245 Siswa', rombel: '8 Kelas (MIPA, IPS, Bahasa)', walikelas: '8 Guru Pembimbing' },
                  { name: 'Kelas XII (Fase F Akhir)', total: '243 Siswa', rombel: '8 Kelas (Persiapan SNBT/PTN)', walikelas: '8 Guru Pembimbing' },
                ].map((c, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                    <p className="text-2xl font-black text-blue-600">{c.total}</p>
                    <p className="text-xs text-slate-600">{c.rombel}</p>
                    <span className="inline-block text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                      {c.walikelas}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 6: TEACHERS (DIREKTORI GURU) ================= */}
          {activeMenu === 'teachers' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Direktori Guru & Tenaga Kependidikan</h2>
                  <p className="text-xs text-slate-500">Daftar Pendidik Bersertifikasi SMAK Setia Bakti Ruteng</p>
                </div>
                <button
                  onClick={downloadStudentTemplate}
                  className="px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Template Excel Guru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_TEACHERS.map((t) => (
                  <div key={t.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <img
                      src={t.photoUrl}
                      alt={t.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-50 px-2 py-0.5 rounded">
                        {t.role}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{t.name}</h4>
                      <p className="text-[11px] text-slate-500 truncate">{t.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 7: ATTENDANCE (PRESENSI KEHADIRAN) ================= */}
          {activeMenu === 'attendance' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-900">Presensi & Kedisiplinan Siswa</h2>
                <p className="text-xs text-slate-500">Tingkat kehadiran rata-rata semester berjalan: 98.4%</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Kehadiran Hari Ini</span>
                  <p className="text-3xl font-black text-emerald-600 mt-1">98.9%</p>
                  <span className="text-xs text-slate-500">740 dari 748 Siswa Hadir</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Izin / Sakit Resmi</span>
                  <p className="text-3xl font-black text-amber-500 mt-1">8 Siswa</p>
                  <span className="text-xs text-slate-500">Surat Dokter & Izin Ortu</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Tanpa Keterangan (Alpa)</span>
                  <p className="text-3xl font-black text-slate-400 mt-1">0 Siswa</p>
                  <span className="text-xs text-emerald-600 font-bold">Tingkat Disiplin Tinggi</span>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 8: REPORTS (UNDUH PDF & EXCEL) ================= */}
          {activeMenu === 'reports' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-900">Pusat Laporan & Unduhan Dokumen</h2>
                <p className="text-xs text-slate-500">Unduh data resmi dalam format PDF berstempel dan Excel (.csv)</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-purple-700" />
                    <span>Laporan Resmi Format PDF (jsPDF)</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Laporan lengkap dengan surat kop resmi SMA Katolik Setia Bakti Ruteng.
                  </p>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => exportStudentReportPDF(students, 'aktif')}
                      className="w-full py-2.5 bg-[#5d3b9e] hover:bg-[#4d2f88] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Unduh Laporan Siswa Aktif (PDF)
                    </button>
                    <button
                      onClick={() => exportStudentReportPDF(students, 'alumni')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Unduh Laporan Rekapitulasi Alumni (PDF)
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    <span>Template & Data Excel (.csv)</span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    Format spreadsheet untuk integrasi data Dapodik dan arsip tata usaha sekolah.
                  </p>
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={downloadStudentTemplate}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Unduh Template Excel Data Siswa
                    </button>
                    <button
                      onClick={() => exportCurrentStudentsToCSV(students)}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Ekspor Seluruh Siswa Terdaftar (.csv)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 9: SETTINGS & ENCRYPTION / PPDB ================= */}
          {activeMenu === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-900">Pengaturan Sistem & Broadcast Notifikasi</h2>
                <p className="text-xs text-slate-500">Verifikasi PPDB, Siaran Notifikasi Push, dan Audit Keamanan Data</p>
              </div>

              {/* Push Notification Broadcast Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>Kirim Notifikasi Push Real-Time ke Pengguna</span>
                </h3>
                <form onSubmit={handleBroadcastNotif} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Judul Pengumuman</label>
                    <input
                      type="text"
                      required
                      value={notifTitle}
                      onChange={(e) => setNotifTitle(e.target.value)}
                      placeholder="Contoh: Pengumuman Hasil Seleksi PPDB Gelombang I"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Isi Pesan Notifikasi</label>
                    <textarea
                      required
                      rows={2}
                      value={notifMessage}
                      onChange={(e) => setNotifMessage(e.target.value)}
                      placeholder="Tuliskan isi pesan yang akan muncul di perangkat pengguna..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer"
                  >
                    Siarkan Notifikasi Sekarang
                  </button>
                </form>
              </div>

              {/* PPDB Quick Verification */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Status Verifikasi Pendaftar PPDB Online ({ppdbList.length})
                </h3>
                <div className="space-y-2">
                  {ppdbList.slice(0, 3).map((reg) => (
                    <div key={reg.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-blue-900">{reg.regNumber}</span>
                        <p className="font-semibold text-slate-800">{reg.fullName} ({reg.chosenMajor})</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {reg.status}
                        </span>
                        <button
                          onClick={() => onUpdatePPDBStatus(reg.id, 'Diterima')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded font-bold text-[10px] cursor-pointer"
                        >
                          Terima
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL INPUT SISWA BARU ================= */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#121c38] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Input Siswa Baru (Admin Utama)</h3>
                <p className="text-xs text-blue-200">Data otomatis terenkripsi standar AES-256</p>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-white/80 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    placeholder="Contoh: Yohanes Karel Pantur"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NISN (10 Digit) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={newStudent.nisn}
                    onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value.replace(/\D/g, '') })}
                    placeholder="0078129014"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    NIK (16 Digit - Terenkripsi) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={newStudent.nik}
                    onChange={(e) => setNewStudent({ ...newStudent, nik: e.target.value.replace(/\D/g, '') })}
                    placeholder="531002XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas & Rombel</label>
                  <input
                    type="text"
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                    placeholder="X-MIPA 1 / SS 1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Peminatan</label>
                  <select
                    value={newStudent.major}
                    onChange={(e: any) => setNewStudent({ ...newStudent, major: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="MIPA">MIPA</option>
                    <option value="IPS">IPS</option>
                    <option value="Bahasa & Budaya">Bahasa & Budaya</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan & Enkripsi Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
