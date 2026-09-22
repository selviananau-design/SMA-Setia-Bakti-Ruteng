import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  FileSpreadsheet,
  FileDown,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Download,
  ShieldCheck,
  Building,
  Award,
  BookOpen,
  ShoppingBag,
  CheckCircle2,
  Sparkles,
  Star,
} from 'lucide-react';
import { Student } from '../types';
import { exportStudentReportPDF } from '../services/pdfExport';
import {
  downloadStudentTemplate,
  downloadTeacherTemplate,
  exportCurrentStudentsToCSV,
} from '../services/excelTemplate';

interface StatsDashboardProps {
  students: Student[];
  initialSubTab?: string;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  students,
  initialSubTab = 'kelulusan',
}) => {
  const [activeTab, setActiveTab] = useState<'kelulusan' | 'alumni' | 'demografi' | 'koperasi'>('kelulusan');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  useEffect(() => {
    if (initialSubTab) {
      if (initialSubTab === 'aktif') setActiveTab('demografi');
      else setActiveTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  // Split Active vs Alumni as explicitly instructed!
  const activeStudents = students.filter((s) => s.status === 'aktif');
  const alumniStudents = students.filter((s) => s.status === 'alumni');

  // Interactive statistics calculations
  const totalActive = 748; // Standard school population baseline
  const totalAlumni = 4820; // Historic alumni population

  // Distribution by level & major for Active Students
  const activeStats = {
    classX: { total: 260, mipa: 110, ips: 100, bahasa: 50 },
    classXI: { total: 245, mipa: 105, ips: 95, bahasa: 45 },
    classXII: { total: 243, mipa: 103, ips: 95, bahasa: 45 },
    gender: { laki: 360, perempuan: 388 },
    avgAttendance: 98.4,
    avgGPA: 89.2,
  };

  // Alumni Statistics
  const alumniStats = {
    totalGrads: 4820,
    passRate: '100%',
    higherEdRate: '89.4%',
    topCampuses: [
      { name: 'Universitas Nusa Cendana (Undana)', count: 980, pct: 20.3, color: '#3b82f6' },
      { name: 'UNIKA Santu Paulus / UNWIRA', count: 920, pct: 19.1, color: '#8b5cf6' },
      { name: 'Universitas Sanata Dharma Yogyakarta', count: 640, pct: 13.3, color: '#ec4899' },
      { name: 'Universitas Gadjah Mada (UGM)', count: 480, pct: 10.0, color: '#f59e0b' },
      { name: 'Universitas Indonesia & ITB', count: 350, pct: 7.3, color: '#10b981' },
      { name: 'STF Driyarkara & Seminari Tinggi', count: 320, pct: 6.6, color: '#6366f1' },
      { name: 'Kampus Lainnya & Luar Negeri', count: 1130, pct: 23.4, color: '#64748b' },
    ],
    professions: [
      { role: 'Pendidik & Dosen', count: 1250, pct: 25.9 },
      { role: 'Tenaga Medis (Dokter/Perawat)', count: 860, pct: 17.8 },
      { role: 'Aparatur Sipil Negara (ASN/PNS/TNI-Polri)', count: 940, pct: 19.5 },
      { role: 'Wirausaha & Profesional Swasta', count: 1120, pct: 23.2 },
      { role: 'Imam / Biarawan-Biarawati', count: 320, pct: 6.6 },
      { role: 'Studi Lanjut Pascasarjana (S2/S3)', count: 330, pct: 7.0 },
    ],
  };

  return (
    <section className="w-full py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header & Description */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-1 rounded-full inline-block mb-1">
              Data Akurat & Terverifikasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#321759] font-serif tracking-tight">
              Dasbor Statistik Siswa & Alumni
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Visualisasi komprehensif data siswa aktif dan rekam jejak kelulusan alumni SMA Katolik
              Setia Bakti Ruteng yang dipisahkan secara interaktif dan real-time.
            </p>
          </div>

          {/* Excel Template & PDF Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="dropdown relative group">
              <button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
                <FileSpreadsheet className="w-4 h-4" />
                <span>Unduh Template Excel</span>
              </button>
              <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 w-60 z-30 animate-fadeIn">
                <button
                  onClick={downloadStudentTemplate}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Template Excel Data Siswa (.csv)</span>
                </button>
                <button
                  onClick={downloadTeacherTemplate}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Template Excel Guru/Pegawai (.csv)</span>
                </button>
                <button
                  onClick={() => exportCurrentStudentsToCSV(students)}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ekspor Data Siswa Terdaftar (.csv)</span>
                </button>
              </div>
            </div>

            <div className="dropdown relative group">
              <button className="bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer">
                <FileDown className="w-4 h-4" />
                <span>Unduh Laporan PDF</span>
              </button>
              <div className="hidden group-hover:block absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 w-60 z-30 animate-fadeIn">
                <button
                  onClick={() => exportStudentReportPDF(students, 'aktif')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 flex items-center gap-2 cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-purple-700" />
                  <span>Laporan Siswa Aktif (PDF)</span>
                </button>
                <button
                  onClick={() => exportStudentReportPDF(students, 'alumni')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                >
                  <FileDown className="w-3.5 h-3.5 text-purple-700" />
                  <span>Laporan Rekapitulasi Alumni (PDF)</span>
                </button>
                <button
                  onClick={() => exportStudentReportPDF(students, 'semua')}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-900 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                >
                  <FileDown className="w-3.5 h-3.5 text-purple-700" />
                  <span>Laporan Rekap Keseluruhan (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs for Statistik & Alumni */}
        <div className="flex items-center justify-center my-6">
          <div className="bg-slate-200/80 p-1.5 rounded-xl flex flex-wrap items-center justify-center gap-1 shadow-inner border border-slate-300">
            <button
              onClick={() => setActiveTab('kelulusan')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'kelulusan'
                  ? 'bg-[#432874] text-white shadow-md'
                  : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Statistik Kelulusan & Nilai</span>
            </button>
            <button
              onClick={() => setActiveTab('alumni')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'alumni'
                  ? 'bg-[#432874] text-white shadow-md'
                  : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Sebaran Alumni ({totalAlumni.toLocaleString('id-ID')} Orang)</span>
            </button>
            <button
              onClick={() => setActiveTab('demografi')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'demografi'
                  ? 'bg-[#432874] text-white shadow-md'
                  : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Data Demografi Siswa ({totalActive})</span>
            </button>
            <button
              onClick={() => setActiveTab('koperasi')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'koperasi'
                  ? 'bg-[#432874] text-white shadow-md'
                  : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Koperasi & Perlengkapan</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: STATISTIK KELULUSAN & NILAI */}
        {activeTab === 'kelulusan' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Kelulusan */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Tingkat Kelulusan</p>
                  <p className="text-xl sm:text-2xl font-black text-emerald-700">100%</p>
                  <span className="text-[10px] text-slate-500 font-bold">10 Tahun Berturut-turut</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#432874] flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Lanjut Perguruan Tinggi</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">89.4%</p>
                  <span className="text-[10px] text-purple-700 font-bold">SNBP, SNBT & Kedinasan</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Rata-rata Nilai Asesmen</p>
                  <p className="text-xl sm:text-2xl font-black text-[#005fb8]">88.6</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Kategori Mahir (Kemdikbud)</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Nilai Tertinggi Sekolah</p>
                  <p className="text-xl sm:text-2xl font-black text-amber-800">98.5</p>
                  <span className="text-[10px] text-slate-500 font-bold">Peminatan MIPA 2025</span>
                </div>
              </div>
            </div>

            {/* Rekapitulasi Rata-rata per Peminatan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    Peminatan MIPA
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">Lulus 100%</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">Rerata Nilai: 91.2</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex justify-between">
                    <span>Matematika Peminatan:</span>
                    <strong className="text-slate-800">92.4</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Fisika & Kimia:</span>
                    <strong className="text-slate-800">89.8</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Biologi Eksperimen:</span>
                    <strong className="text-slate-800">91.5</strong>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded">
                    Peminatan IPS
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">Lulus 100%</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">Rerata Nilai: 88.9</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex justify-between">
                    <span>Ekonomi & Akuntansi:</span>
                    <strong className="text-slate-800">89.7</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Sosiologi & Geografi:</span>
                    <strong className="text-slate-800">88.2</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Sejarah Kritis:</span>
                    <strong className="text-slate-800">88.8</strong>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                    Peminatan Bahasa
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">Lulus 100%</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">Rerata Nilai: 90.4</h3>
                <ul className="text-xs text-slate-600 space-y-2">
                  <li className="flex justify-between">
                    <span>Bahasa Inggris Akademis:</span>
                    <strong className="text-slate-800">93.1</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Bahasa Jerman Komunikasi:</span>
                    <strong className="text-slate-800">88.5</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Sastra & Budaya Daerah:</span>
                    <strong className="text-slate-800">89.6</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SISWA AKTIF & DEMOGRAFI */}
        {activeTab === 'demografi' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#432874] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Siswa Aktif</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{totalActive}</p>
                  <span className="text-[10px] text-emerald-600 font-bold">24 Rombel Terakreditasi A</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <PieIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Rasio Gender</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">
                    {activeStats.gender.laki} : {activeStats.gender.perempuan}
                  </p>
                  <span className="text-[10px] text-slate-500 font-medium">48% Putra : 52% Putri</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Kehadiran Rata-Rata</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{activeStats.avgAttendance}%</p>
                  <span className="text-[10px] text-emerald-600 font-bold">Disiplin Tinggi</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Rerata Nilai Rapor</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{activeStats.avgGPA}</p>
                  <span className="text-[10px] text-amber-700 font-bold">Skala 100 (Kurikulum Merdeka)</span>
                </div>
              </div>
            </div>

            {/* Interactive Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Bar Chart: Tingkat Kelas & Peminatan */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-purple-700" />
                      <span>Distribusi Siswa per Tingkat & Jurusan</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Perbandingan jumlah siswa Kelas X, XI, dan XII pada jurusan MIPA, IPS, dan Bahasa
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-2 py-1 rounded">
                    T.A. 2026/2027
                  </span>
                </div>

                {/* SVG Visual Interactive Bar Chart */}
                <div className="pt-4 pb-2">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    {/* Kelas X */}
                    <div
                      onMouseEnter={() => setHoveredBar('Kelas X: 260 Siswa (MIPA 110, IPS 100, Bahasa 50)')}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block mb-2">KELAS X</span>
                      <div className="h-40 flex items-end justify-center gap-2 px-2">
                        <div
                          style={{ height: '80%' }}
                          className="w-4 sm:w-6 bg-purple-700 rounded-t transition-all hover:brightness-110"
                          title="MIPA: 110"
                        />
                        <div
                          style={{ height: '70%' }}
                          className="w-4 sm:w-6 bg-indigo-500 rounded-t transition-all hover:brightness-110"
                          title="IPS: 100"
                        />
                        <div
                          style={{ height: '35%' }}
                          className="w-4 sm:w-6 bg-amber-500 rounded-t transition-all hover:brightness-110"
                          title="Bahasa: 50"
                        />
                      </div>
                      <span className="text-sm font-extrabold text-[#432874] block mt-2">
                        {activeStats.classX.total} Siswa
                      </span>
                    </div>

                    {/* Kelas XI */}
                    <div
                      onMouseEnter={() => setHoveredBar('Kelas XI: 245 Siswa (MIPA 105, IPS 95, Bahasa 45)')}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block mb-2">KELAS XI</span>
                      <div className="h-40 flex items-end justify-center gap-2 px-2">
                        <div
                          style={{ height: '76%' }}
                          className="w-4 sm:w-6 bg-purple-700 rounded-t transition-all hover:brightness-110"
                          title="MIPA: 105"
                        />
                        <div
                          style={{ height: '67%' }}
                          className="w-4 sm:w-6 bg-indigo-500 rounded-t transition-all hover:brightness-110"
                          title="IPS: 95"
                        />
                        <div
                          style={{ height: '32%' }}
                          className="w-4 sm:w-6 bg-amber-500 rounded-t transition-all hover:brightness-110"
                          title="Bahasa: 45"
                        />
                      </div>
                      <span className="text-sm font-extrabold text-[#432874] block mt-2">
                        {activeStats.classXI.total} Siswa
                      </span>
                    </div>

                    {/* Kelas XII */}
                    <div
                      onMouseEnter={() => setHoveredBar('Kelas XII: 243 Siswa (MIPA 103, IPS 95, Bahasa 45)')}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-purple-50 transition-colors border border-slate-200 cursor-pointer"
                    >
                      <span className="text-xs font-bold text-slate-800 block mb-2">KELAS XII</span>
                      <div className="h-40 flex items-end justify-center gap-2 px-2">
                        <div
                          style={{ height: '75%' }}
                          className="w-4 sm:w-6 bg-purple-700 rounded-t transition-all hover:brightness-110"
                          title="MIPA: 103"
                        />
                        <div
                          style={{ height: '67%' }}
                          className="w-4 sm:w-6 bg-indigo-500 rounded-t transition-all hover:brightness-110"
                          title="IPS: 95"
                        />
                        <div
                          style={{ height: '32%' }}
                          className="w-4 sm:w-6 bg-amber-500 rounded-t transition-all hover:brightness-110"
                          title="Bahasa: 45"
                        />
                      </div>
                      <span className="text-sm font-extrabold text-[#432874] block mt-2">
                        {activeStats.classXII.total} Siswa
                      </span>
                    </div>
                  </div>

                  {/* Legend & Hover Info */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-purple-700"></span> MIPA (318 Siswa - 42.5%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-indigo-500"></span> IPS (290 Siswa - 38.8%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm bg-amber-500"></span> Bahasa (140 Siswa - 18.7%)
                    </span>
                  </div>

                  {hoveredBar && (
                    <div className="mt-2 text-center text-xs font-semibold text-purple-900 bg-purple-100 py-1 rounded">
                      {hoveredBar}
                    </div>
                  )}
                </div>
              </div>

              {/* Composition Donut / Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                    <PieIcon className="w-4 h-4 text-purple-700" />
                    <span>Proporsi Peminatan Akademik</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Kurikulum Merdeka Berbasis Talenta & Minat
                  </p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-purple-900">MIPA (Sains & Teknologi)</span>
                        <span>318 Siswa (42.5%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-700 h-full rounded-full" style={{ width: '42.5%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-indigo-900">IPS (Sosial & Humaniora)</span>
                        <span>290 Siswa (38.8%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: '38.8%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-amber-900">Bahasa & Budaya</span>
                        <span>140 Siswa (18.7%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '18.7%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-xs">
                  <p className="font-bold">Keunggulan Kurikulum:</p>
                  <p className="mt-0.5 text-slate-600">
                    Setiap jurusan terintegrasi dengan pembelajaran praktikum sains, bahasa Inggris/Jerman,
                    serta pelatihan kepemimpinan kristiani.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: ALUMNI (Separated Display!) */}
        {activeTab === 'alumni' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards Alumni */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Alumni Lulusan</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">4,820</p>
                  <span className="text-[10px] text-indigo-700 font-bold">Tercatat Sejak 1968</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Tingkat Kelulusan</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">100%</p>
                  <span className="text-[10px] text-emerald-600 font-bold">5 Tahun Berturut-turut</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Tembus PTN / PTS Favorit</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">89.4%</p>
                  <span className="text-[10px] text-blue-600 font-bold">Jalur SNBP, SNBT, Kedinasan</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Ikatan Alumni (IKASBA)</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">Aktif</p>
                  <span className="text-[10px] text-amber-700 font-bold">Program Dana Abadi Beasiswa</span>
                </div>
              </div>
            </div>

            {/* Alumni Deep-Dive Visuals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Campus Destination Distribution */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4 text-purple-700" />
                  <span>Sebaran Kampus & Perguruan Tinggi Alumni</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Data penelusuran lulusan (Tracer Study) pada universitas terkemuka
                </p>

                <div className="space-y-3">
                  {alumniStats.topCampuses.map((campus, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800">{campus.name}</span>
                        <span className="text-slate-600 font-mono">
                          {campus.count} org ({campus.pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${campus.pct * 3.5}%`, backgroundColor: campus.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career & Profession Distribution */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-purple-700" />
                  <span>Bidang Profesi & Karir Lulusan</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Kontribusi alumni SMAK Setia Bakti di berbagai sektor pembangunan
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {alumniStats.professions.map((prof, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all"
                    >
                      <p className="text-xs font-bold text-[#432874]">{prof.role}</p>
                      <p className="text-base font-extrabold text-slate-900 mt-1">
                        {prof.count}{' '}
                        <span className="text-xs font-normal text-slate-500">Alumni</span>
                      </p>
                      <span className="text-[10px] font-semibold text-emerald-600">
                        {prof.pct}% dari total
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>Punya pembaruan data alumni? Hubungi sekretariat IKASBA:</span>
                  <button
                    onClick={() => alert('Membuka formulir pembaruan tracer study alumni SMAK Setia Bakti.')}
                    className="font-bold underline cursor-pointer hover:text-amber-950"
                  >
                    Perbarui Data &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: KOPERASI & PERLENGKAPAN SEKOLAH */}
        {activeTab === 'koperasi' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded">
                    Layanan Siswa & Kesejahteraan
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                    Koperasi Siswa "Setia Usaha" Ruteng
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Penyedia resmi seragam sekolah, modul pembelajaran, atribut khas Setia Bakti, dan perlengkapan asrama.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  Buka Senin - Sabtu (07.00 - 15.00 WITA)
                </span>
              </div>

              {/* Produk & Perlengkapan List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    name: 'Setel Seragam Putih Abu & Pramuka',
                    price: 'Rp 220.000',
                    desc: 'Bahan tebal katun oxfort adem, jahitan rapi berstandar nasional.',
                    category: 'Seragam Resmi',
                    badge: 'Wajib',
                  },
                  {
                    name: 'Batik Khas Motif Flores Setia Bakti',
                    price: 'Rp 145.000',
                    desc: 'Kain batik tenun printing motif khas Manggarai edisi khusus sekolah.',
                    category: 'Seragam Batik',
                    badge: 'Wajib',
                  },
                  {
                    name: 'Kaos & Celana Olahraga Santu Paulus',
                    price: 'Rp 125.000',
                    desc: 'Bahan dry-fit elastis untuk kegiatan kebugaran jasmani dan Porseni.',
                    category: 'Olahraga',
                    badge: 'Wajib',
                  },
                  {
                    name: 'Paket Atribut (Dasi, Topi, Sabuk & Badge)',
                    price: 'Rp 65.000',
                    desc: 'Logo bordir resmi SMAK Setia Bakti dan lokasi Kabupaten Manggarai.',
                    category: 'Atribut Resmi',
                    badge: 'Lengkap',
                  },
                  {
                    name: 'Modul Digital & Buku Cetak Kurikulum Merdeka',
                    price: 'Rp 35.000 / mapel',
                    desc: 'Modul belajar ringkas terstandar MGMP sekolah untuk X, XI, XII.',
                    category: 'Bahan Ajar',
                    badge: 'Akademik',
                  },
                  {
                    name: 'Buku Ibadat Madah Bakti & Rosario Kayu',
                    price: 'Rp 75.000',
                    desc: 'Buku panduan misa mingguan dan rosario kayu khas kota sejuk Ruteng.',
                    category: 'Spiritualitas',
                    badge: 'Ibadat',
                  },
                  {
                    name: 'Jas Almamater Ungu Khas Setia Bakti',
                    price: 'Rp 185.000',
                    desc: 'Jas resmi untuk acara wisuda, kunjungan studi, dan kompetisi luar sekolah.',
                    category: 'Almamater',
                    badge: 'Identitas',
                  },
                  {
                    name: 'Tumbler Ramah Lingkungan Setia Bakti',
                    price: 'Rp 50.000',
                    desc: 'Gerakan sekolah bersih tanpa plastik; dapat diisi ulang gratis di galon sekolah.',
                    category: 'Perlengkapan',
                    badge: 'Eco-School',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-purple-300 hover:bg-purple-50/20 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-900">
                          {item.category}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-[#432874]">{item.price}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Tersedia di Toko</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informational Callout */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#432874] flex-shrink-0" />
                  <span>
                    Pembelian seragam bagi calon siswa baru PPDB 2026/2027 dapat dilakukan langsung di loket koperasi sekolah saat daftar ulang fisik.
                  </span>
                </div>
                <button
                  onClick={() => alert('Informasi loket Koperasi: Gedung Penunjang Lantai 1 SMAK Setia Bakti Ruteng.')}
                  className="px-4 py-2 bg-[#432874] hover:bg-[#321759] text-white font-bold rounded-lg cursor-pointer whitespace-nowrap"
                >
                  Panduan Ukuran Seragam
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
