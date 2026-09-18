import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Users,
  Plus,
  Search,
  FileSpreadsheet,
  FileDown,
  Trash2,
  Edit2,
  CheckCircle2,
  Send,
  Bell,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Upload,
  Calendar,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import { Student, PPDBRegistration, PushNotification, UserSession } from '../types';
import { exportStudentReportPDF, exportPPDBReceiptPDF } from '../services/pdfExport';
import { downloadStudentTemplate, exportCurrentStudentsToCSV } from '../services/excelTemplate';
import { simulateAesEncrypt, maskSensitiveData, logAuditEvent } from '../services/encryption';

interface DashboardViewProps {
  session: UserSession;
  students: Student[];
  ppdbList: PPDBRegistration[];
  notifications: PushNotification[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onUpdatePPDBStatus: (id: string, status: PPDBRegistration['status'], notes?: string) => void;
  onSendPushNotification: (title: string, message: string, target: 'all' | 'guru' | 'orangtua' | 'siswa', priority: 'urgent' | 'info' | 'akademik') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  session,
  students,
  ppdbList,
  notifications,
  onAddStudent,
  onDeleteStudent,
  onUpdatePPDBStatus,
  onSendPushNotification,
}) => {
  // Admin Tabs
  const [adminTab, setAdminTab] = useState<'siswa' | 'ppdb' | 'notif' | 'security'>('siswa');
  const [studentSearch, setStudentSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'semua' | 'aktif' | 'alumni'>('semua');
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showDecryptedData, setShowDecryptedData] = useState(false);

  // Push notification composer
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState<'all' | 'guru' | 'orangtua' | 'siswa'>('all');
  const [notifPriority, setNotifPriority] = useState<'urgent' | 'info' | 'akademik'>('info');

  // New Student Form State for Admin
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
    alert(`Data siswa ${newStudent.name} berhasil disimpan dengan enkripsi data 256-bit!`);
  };

  const handleBroadcastNotif = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    onSendPushNotification(notifTitle, notifMessage, notifTarget, notifPriority);
    setNotifTitle('');
    setNotifMessage('');
    alert('Notifikasi push berhasil disiarkan secara real-time ke seluruh perangkat pengguna!');
  };

  const toggleDecryption = () => {
    if (!showDecryptedData) {
      const pin = prompt('Masukkan Kunci Otorisasi Keamanan Admin untuk membuka masker data enkripsi: (Demo PIN: 1234)');
      if (pin === '1234') {
        setShowDecryptedData(true);
        logAuditEvent(session.name, 'DECRYPT', 'Dekripsi Sementara Data Sensitif Siswa', 'SUCCESS');
      } else {
        alert('Kunci Otorisasi salah! Akses dekripsi ditolak demi keamanan privasi.');
        logAuditEvent(session.name, 'DECRYPT', 'Percobaan Akses Kunci Otorisasi Gagal', 'DENIED');
      }
    } else {
      setShowDecryptedData(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesStatus = filterStatus === 'semua' || s.status === filterStatus;
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisn.includes(studentSearch) ||
      s.className.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Top Banner Session Profile */}
        <div className="bg-[#3b1d70] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/80 border-2 border-purple-300/40 flex items-center justify-center text-amber-300 font-bold text-xl shadow">
              {session.role === 'admin' ? <ShieldCheck className="w-8 h-8" /> : <UserCheck className="w-8 h-8" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-purple-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  {session.role === 'admin' && 'Administrator Utama'}
                  {session.role === 'guru' && 'Portal Guru / Pendidik'}
                  {session.role === 'orangtua' && 'Portal Orang Tua Siswa'}
                </span>
                <span className="text-purple-300 text-xs font-mono">• Terenkripsi Aktif</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mt-0.5 text-white">{session.name}</h2>
              <p className="text-xs text-purple-200">
                Sistem Terpadu SMAK Setia Bakti Ruteng • Terkoneksi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportStudentReportPDF(students, 'semua')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            >
              <FileDown className="w-4 h-4" />
              <span>Cetak Laporan PDF</span>
            </button>
            <button
              onClick={downloadStudentTemplate}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Template Excel</span>
            </button>
          </div>
        </div>

        {/* 1. ROLE: ADMIN UTAMA VIEW */}
        {session.role === 'admin' && (
          <div className="space-y-6">
            {/* Admin Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-300 pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setAdminTab('siswa')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'siswa'
                    ? 'bg-[#432874] text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-purple-50'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Input & Kelola Data Siswa ({students.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('ppdb')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'ppdb'
                    ? 'bg-[#432874] text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-purple-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verifikasi Berkas PPDB ({ppdbList.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('notif')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'notif'
                    ? 'bg-[#432874] text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-purple-50'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Broadcast Push Notifikasi</span>
              </button>

              <button
                onClick={() => setAdminTab('security')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  adminTab === 'security'
                    ? 'bg-[#432874] text-white shadow'
                    : 'bg-white text-slate-700 hover:bg-purple-50'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Audit Enkripsi & Keamanan</span>
              </button>
            </div>

            {/* TAB ADMIN: INPUT & KELOLA DATA SISWA */}
            {adminTab === 'siswa' && (
              <div className="space-y-4">
                {/* Actions & Filters */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Input Data Siswa Baru</span>
                    </button>
                    <button
                      onClick={toggleDecryption}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        showDecryptedData
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                      title="Buka / Kunci Masking Data Enkripsi"
                    >
                      {showDecryptedData ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showDecryptedData ? 'Kunci Enkripsi' : 'Buka Masker NIK'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <select
                      value={filterStatus}
                      onChange={(e: any) => setFilterStatus(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-purple-600"
                    >
                      <option value="semua">Semua Siswa</option>
                      <option value="aktif">Siswa Aktif</option>
                      <option value="alumni">Alumni</option>
                    </select>

                    <div className="relative flex-1 md:w-60">
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Cari nama, NISN, kelas..."
                        className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#432874] text-white uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="px-4 py-3">NISN</th>
                          <th className="px-4 py-3">NIK (Terenkripsi)</th>
                          <th className="px-4 py-3">Nama Lengkap Siswa</th>
                          <th className="px-4 py-3">Kelas & Jurusan</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Kontak Orang Tua</th>
                          <th className="px-4 py-3">Nilai Rapor</th>
                          <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                            <td className="px-4 py-3 font-mono font-bold text-slate-800">{s.nisn}</td>
                            <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                              {showDecryptedData ? (
                                <span className="text-emerald-700 font-bold">{s.nik}</span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Lock className="w-3 h-3 text-purple-600 inline" />
                                  <span>{maskSensitiveData(s.nik, 'nik')}</span>
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                            <td className="px-4 py-3">
                              <span className="text-purple-900 font-semibold">{s.className || s.classLevel}</span>
                              <span className="text-[10px] text-slate-500 block">{s.major}</span>
                            </td>
                            <td className="px-4 py-3">
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
                            <td className="px-4 py-3 text-[11px] text-slate-600">
                              <p className="font-semibold">{s.parentName}</p>
                              <p className="font-mono text-slate-400">
                                {showDecryptedData ? s.parentPhone : maskSensitiveData(s.parentPhone, 'phone')}
                              </p>
                            </td>
                            <td className="px-4 py-3 font-bold text-purple-900">{s.gpa.toFixed(1)}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => onDeleteStudent(s.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded hover:bg-rose-50"
                                title="Hapus Data Siswa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-xs">
                      Tidak ada data siswa yang cocok dengan pencarian.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB ADMIN: VERIFIKASI PPDB */}
            {adminTab === 'ppdb' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Daftar Pendaftar PPDB Online 2026/2027
                  </h3>
                  <span className="text-xs font-semibold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full">
                    Total: {ppdbList.length} Pendaftar
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#432874] text-white uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">No. Registrasi</th>
                        <th className="px-4 py-3">Nama Calon Siswa</th>
                        <th className="px-4 py-3">Asal Sekolah</th>
                        <th className="px-4 py-3">Peminatan</th>
                        <th className="px-4 py-3">Rata Rapor</th>
                        <th className="px-4 py-3">Status Saat Ini</th>
                        <th className="px-4 py-3 text-right">Ubah Status / Cetak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {ppdbList.map((reg) => (
                        <tr key={reg.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="px-4 py-3 font-mono font-bold text-purple-900">{reg.regNumber}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{reg.fullName}</td>
                          <td className="px-4 py-3 text-slate-600">{reg.originSchool}</td>
                          <td className="px-4 py-3 font-semibold text-purple-800">{reg.chosenMajor}</td>
                          <td className="px-4 py-3 font-bold text-slate-900">{reg.averageScore}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                reg.status === 'Diterima'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : reg.status === 'Berkas Lengkap'
                                  ? 'bg-blue-100 text-blue-800'
                                  : reg.status === 'Perlu Perbaikan'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right space-x-1.5">
                            <button
                              onClick={() => exportPPDBReceiptPDF(reg)}
                              className="px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded font-bold text-[11px] transition-colors cursor-pointer"
                              title="Cetak Bukti PDF"
                            >
                              PDF
                            </button>
                            <button
                              onClick={() => onUpdatePPDBStatus(reg.id, 'Diterima', 'Lolos verifikasi akhir panitia')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Terima
                            </button>
                            <button
                              onClick={() => onUpdatePPDBStatus(reg.id, 'Perlu Perbaikan', 'Periksa kembali legalisir ijazah')}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Revisi
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB ADMIN: BROADCAST NOTIFIKASI PUSH */}
            {adminTab === 'notif' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                    <Send className="w-4 h-4 text-purple-700" />
                    <span>Siarkan Notifikasi Push Real-Time</span>
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Kirim pembaruan penting sekolah langsung ke layar perangkat guru, orang tua, dan siswa.
                  </p>

                  <form onSubmit={handleBroadcastNotif} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Judul Notifikasi
                      </label>
                      <input
                        type="text"
                        required
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        placeholder="Contoh: Pengumuman Libur Hari Raya Santo Pelindung"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Isi Pesan Notifikasi
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={notifMessage}
                        onChange={(e) => setNotifMessage(e.target.value)}
                        placeholder="Tulis detail pengumuman yang akan diterima pengguna..."
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Target Penerima
                        </label>
                        <select
                          value={notifTarget}
                          onChange={(e: any) => setNotifTarget(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                        >
                          <option value="all">Semua Pengguna</option>
                          <option value="guru">Dewan Guru</option>
                          <option value="orangtua">Orang Tua Siswa</option>
                          <option value="siswa">Siswa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Tingkat Prioritas
                        </label>
                        <select
                          value={notifPriority}
                          onChange={(e: any) => setNotifPriority(e.target.value)}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
                        >
                          <option value="info">Informasi Biasa</option>
                          <option value="urgent">Mendesak / Penting</option>
                          <option value="akademik">Akademik / Ujian</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Siaran Notifikasi Sekarang</span>
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Riwayat Notifikasi Terkirim</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Pembaruan terkini yang telah disiarkan ke pengguna
                  </p>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              n.priority === 'urgent'
                                ? 'bg-rose-100 text-rose-800'
                                : n.priority === 'akademik'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {n.priority} • Target: {n.target}
                          </span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <h5 className="font-bold text-slate-900">{n.title}</h5>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB ADMIN: AUDIT ENKRIPSI & KEAMANAN DATA */}
            {adminTab === 'security' && (
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <span>Sistem Enkripsi & Privasi Data Pengguna (UU PDP No. 27/2022)</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Seluruh data identitas kependudukan siswa dan kontak orang tua terlindungi dengan enkripsi end-to-end.
                    </p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    ✓ Status Enkripsi Aktif
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block font-semibold">Algoritma Kriptografi</span>
                    <span className="font-mono font-bold text-slate-800">AES-256 GCM + SHA-256</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block font-semibold">Status Masking Data</span>
                    <span className="font-bold text-purple-900">
                      {showDecryptedData ? 'Terbuka Sementara (Otorisasi Admin)' : 'Terkunci & Termasking'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block font-semibold">Kepatuhan Hukum</span>
                    <span className="font-bold text-emerald-700">UU No. 27/2022 (Perlindungan Data Pribadi)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ROLE: GURU VIEW */}
        {session.role === 'guru' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-700" />
                    <span>Input Nilai Akademik & Presensi Kelas</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pengelolaan e-Rapor Kurikulum Merdeka dan absensi kehadiran harian siswa.
                  </p>
                </div>
                <button
                  onClick={() => alert('Fitur simpan nilai e-rapor berhasil disimpan ke server!')}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors"
                >
                  Simpan Nilai Semester
                </button>
              </div>

              {/* Quick Students Grading Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#432874] text-white uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">NISN</th>
                      <th className="px-4 py-3">Nama Siswa</th>
                      <th className="px-4 py-3">Kelas</th>
                      <th className="px-4 py-3">Kehadiran (%)</th>
                      <th className="px-4 py-3">Nilai Tugas</th>
                      <th className="px-4 py-3">Nilai UTS</th>
                      <th className="px-4 py-3">Nilai UAS</th>
                      <th className="px-4 py-3">Nilai Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {students.slice(0, 5).map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono">{s.nisn}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                        <td className="px-4 py-3">{s.className}</td>
                        <td className="px-4 py-3 font-bold text-emerald-700">{s.attendanceRate}%</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            defaultValue={88}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            defaultValue={90}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            defaultValue={89}
                            className="w-16 px-2 py-1 border border-slate-300 rounded text-xs font-bold"
                          />
                        </td>
                        <td className="px-4 py-3 font-extrabold text-purple-900">{s.gpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ROLE: ORANG TUA VIEW */}
        {session.role === 'orangtua' && (
          <div className="space-y-6">
            {/* Child Academic Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Data Siswa (Anak Anda)</span>
                <h3 className="text-lg font-bold text-[#432874] mt-1">Yohanes Maria Vianney Ndau</h3>
                <p className="text-xs text-slate-600 mt-0.5">NISN: 0078129011 • Kelas: X-MIPA 1</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Wali Kelas:</span>
                  <span className="font-semibold text-slate-800">Theresia Imelda Ndua, M.Si.</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Rekapitulasi Kehadiran</span>
                <p className="text-3xl font-black text-emerald-700 mt-1">98.6%</p>
                <p className="text-xs text-slate-600 mt-0.5">Hadir: 104 Hari • Sakit: 1 • Izin: 1 • Alpa: 0</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Kedisiplinan:</span>
                  <span className="font-bold text-emerald-700">Sangat Baik (A)</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Status SPP / Uang Sekolah</span>
                <p className="text-xl font-black text-emerald-600 mt-1">LUNAS</p>
                <p className="text-xs text-slate-600 mt-0.5">Semester Ganjil 2026/2027</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Bukti Bayar:</span>
                  <button
                    onClick={() => alert('Kuitansi pembayaran digital SPP terverifikasi bendahara sekolah.')}
                    className="font-bold text-purple-800 underline cursor-pointer"
                  >
                    Unduh Kuitansi
                  </button>
                </div>
              </div>
            </div>

            {/* Academic Report Card Table */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-sm font-bold text-slate-900">
                  Rapor Capaian Nilai Akademik Siswa Semester Ini
                </h3>
                <span className="text-xs font-bold text-purple-900 bg-purple-100 px-3 py-1 rounded-full">
                  Rata-rata: 89.4 (Peringkat 2 di Kelas)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#432874] text-white uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Mata Pelajaran</th>
                      <th className="px-4 py-3">KKTP / KKM</th>
                      <th className="px-4 py-3">Nilai Akhir</th>
                      <th className="px-4 py-3">Predikat</th>
                      <th className="px-4 py-3">Keterangan Kompetensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {[
                      { mapel: 'Pendidikan Agama Katolik & Budi Pekerti', kkm: 75, nilai: 94, predikat: 'A', ket: 'Sangat menguasai nilai-nilai etika kristiani dan sakramen gereja.' },
                      { mapel: 'Fisika Peminatan', kkm: 75, nilai: 91, predikat: 'A', ket: 'Terampil melakukan pemodelan praktikum mekanika gerak dan listrik dinamis.' },
                      { mapel: 'Biologi Peminatan', kkm: 75, nilai: 93, predikat: 'A', ket: 'Menunjukkan pemahaman mendalam pada analisis bioteknologi pangan lokal.' },
                      { mapel: 'Matematika Tingkat Lanjut', kkm: 75, nilai: 88, predikat: 'B+', ket: 'Mampu menyelesaikan persoalan kalkulus diferensial dan matriks.' },
                      { mapel: 'Bahasa & Sastra Inggris', kkm: 75, nilai: 87, predikat: 'B+', ket: 'Aktif berdialog dalam percakapan akademik formal.' },
                      { mapel: 'Pendidikan Pancasila', kkm: 75, nilai: 92, predikat: 'A', ket: 'Menghayati nilai toleransi dan wawasan kebangsaan yang luhur.' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{row.mapel}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono">{row.kkm}</td>
                        <td className="px-4 py-3 font-black text-purple-900">{row.nilai}</td>
                        <td className="px-4 py-3 font-bold text-emerald-700">{row.predikat}</td>
                        <td className="px-4 py-3 text-slate-600 text-[11px]">{row.ket}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODAL INPUT SISWA BARU OLEH ADMIN */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
              <div className="bg-[#432874] text-white p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Input Data Siswa Baru (Admin)</h3>
                  <p className="text-xs text-purple-200">Data otomatis dienkripsi dengan standar AES-256</p>
                </div>
                <button
                  onClick={() => setShowAddStudentModal(false)}
                  className="text-white/80 hover:text-white p-1 rounded"
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
                      placeholder="Nama Lengkap Siswa"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-purple-600"
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-1 focus:ring-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                    <select
                      value={newStudent.classLevel}
                      onChange={(e: any) => setNewStudent({ ...newStudent, classLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="X">Kelas X</option>
                      <option value="XI">Kelas XI</option>
                      <option value="XII">Kelas XII</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Rombel / Kelas</label>
                    <input
                      type="text"
                      value={newStudent.className}
                      onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                      placeholder="X-MIPA 1 / XI-IPS 2"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Peminatan / Jurusan</label>
                    <select
                      value={newStudent.major}
                      onChange={(e: any) => setNewStudent({ ...newStudent, major: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="MIPA">MIPA</option>
                      <option value="IPS">IPS</option>
                      <option value="Bahasa & Budaya">Bahasa & Budaya</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Status Kesiswaan</label>
                    <select
                      value={newStudent.status}
                      onChange={(e: any) => setNewStudent({ ...newStudent, status: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="aktif">Siswa Aktif</option>
                      <option value="alumni">Alumni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Orang Tua</label>
                    <input
                      type="text"
                      value={newStudent.parentName}
                      onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
                      placeholder="Nama Ayah / Ibu"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">No. HP Orang Tua (Terenkripsi)</label>
                    <input
                      type="text"
                      value={newStudent.parentPhone}
                      onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
                      placeholder="081234567890"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStudentModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#432874] hover:bg-[#341b5e] text-white font-bold rounded-lg transition-colors cursor-pointer shadow"
                  >
                    Simpan & Enkripsi Data Siswa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
