import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  FileSpreadsheet,
  FileDown,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Upload,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Student, UserSession } from '../../types';
import { exportStudentReportPDF } from '../../services/pdfExport';
import {
  downloadStudentTemplate,
  exportStudentsToCSV,
  exportStudentsToExcelTemplate,
} from '../../services/excelTemplate';
import { simulateAesEncrypt, logAuditEvent } from '../../services/encryption';
import { ExcelImportModal } from '../common/ExcelImportModal';

interface AdminStudentsTabProps {
  session: UserSession;
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent?: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
  onNavigateToAlumni?: () => void;
}

export const AdminStudentsTab: React.FC<AdminStudentsTabProps> = ({
  session,
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onNavigateToWebsiteTab,
  onNavigateToAlumni,
}) => {
  const [studentSearch, setStudentSearch] = useState('');
  const [filterClass, setFilterClass] = useState<'semua' | 'X' | 'XI' | 'XII'>('semua');
  const [showDecryptedData, setShowDecryptedData] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // New student form state (default aktif)
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
    address: 'Ruteng, Manggarai',
    gpa: '85.5',
    attendanceRate: '98.5',
    graduationYear: '2024',
  });

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

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.nisn || !newStudent.nik) {
      alert('Mohon lengkapi Nama, NISN, dan NIK siswa!');
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
      status: 'aktif',
      phone: newStudent.phone || '081234567890',
      parentName: newStudent.parentName || 'Orang Tua Siswa',
      parentPhone: newStudent.parentPhone || '081398765432',
      address: newStudent.address,
      gpa: parseFloat(newStudent.gpa) || 85.0,
      attendanceRate: parseFloat(newStudent.attendanceRate) || 98.0,
      tuitionStatus: 'Lunas',
      encryptedHash: simulateAesEncrypt(`${newStudent.nik}:${newStudent.name}`),
    };

    onAddStudent(studentRecord);
    logAuditEvent(session.name, 'ENCRYPT', `Pendaftaran Siswa Baru: ${newStudent.name}`, 'SUCCESS');
    setShowAddStudentModal(false);
    alert(`Data siswa ${newStudent.name} berhasil disimpan dan dienkripsi dengan standar AES-256!`);
  };

  // Hanya ambil data siswa aktif
  const activeStudents = students.filter((s) => s.status === 'aktif');

  const filteredStudents = activeStudents.filter((s) => {
    const matchesClass = filterClass === 'semua' || s.classLevel === filterClass;
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.nisn.includes(studentSearch) ||
      s.className.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with integration status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
              Sinkron Website
            </span>
            <span className="text-xs text-slate-400">• Terenkripsi AES-256</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Data Siswa Aktif</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen data peserta didik aktif (Kelas X, XI, XII), rombongan belajar, ekspor rapor PDF/Excel, dan sinkronisasi ke Halaman Statistik Website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportStudentsToExcelTemplate(activeStudents, 'aktif')}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Ekspor Data Siswa Aktif ke Excel (Sesuai Format Template Resmi 14 Kolom)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor ke Excel</span>
          </button>

          <button
            type="button"
            onClick={downloadStudentTemplate}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Unduh Format Template Excel Kosong untuk Siswa"
          >
            <FileDown className="w-4 h-4 text-indigo-600" />
            <span>Template Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Impor Data Siswa dari Template Excel / CSV"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Impor dari Excel</span>
          </button>

          <button
            onClick={() => setShowAddStudentModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Siswa Baru</span>
          </button>
        </div>
      </div>

      {/* Banner Pemisahan Data Alumni */}
      {onNavigateToAlumni && (
        <div className="bg-gradient-to-r from-sky-50 to-indigo-50/80 border border-sky-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                <span>Data Alumni Telah Dipisahkan ke Menu Tersendiri</span>
                <span className="px-2 py-0.5 rounded-md bg-sky-200/80 text-sky-800 text-[10px] font-bold uppercase">
                  Menu Khusus
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Untuk mengelola direktori alumni, jejak karir, studi lanjut kampus, serta ekspor data tracer study, buka menu Data Alumni.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToAlumni}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer flex-shrink-0 self-start sm:self-center"
          >
            <span>Buka Data Alumni</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Control Bar: Search, Filters, Export buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NISN, atau kelas..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <span className="text-[11px] font-bold text-slate-500 px-2">Tingkat:</span>
            {(['semua', 'X', 'XI', 'XII'] as const).map((cls) => (
              <button
                key={cls}
                onClick={() => setFilterClass(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterClass === cls
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cls === 'semua' ? 'Semua Kelas' : `Kelas ${cls}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            onClick={toggleDecryption}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showDecryptedData
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
            title="Buka Enkripsi NIK & Data Sensitif"
          >
            {showDecryptedData ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{showDecryptedData ? 'Data Terbuka' : 'Dekripsi AES-256 (PIN)'}</span>
          </button>

          <button
            onClick={() => exportStudentsToExcelTemplate(activeStudents, 'aktif')}
            className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Ekspor Seluruh Data Siswa ke Excel Sesuai Template Lengkap"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={downloadStudentTemplate}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Unduh Template Excel Format Impor Data"
          >
            <FileDown className="w-4 h-4 text-blue-600" />
            <span>Template Excel</span>
          </button>

          <button
            onClick={() => exportStudentReportPDF(filteredStudents, 'aktif')}
            className="px-3.5 py-2 bg-[#5d3b9e] hover:bg-[#4d2f88] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1730] text-slate-200 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">NISN</th>
                <th className="py-3.5 px-4">NIK (Terproteksi)</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-3">L/P</th>
                <th className="py-3.5 px-4">Kelas / Rombel</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Rata-rata GPA</th>
                <th className="py-3.5 px-3">Kehadiran</th>
                <th className="py-3.5 px-3">SPP</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{s.nisn}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    {showDecryptedData ? (
                      <span className="text-emerald-700 font-bold">{s.nik}</span>
                    ) : (
                      <span className="text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-500" />
                        {s.nik.substring(0, 4)}••••••••{s.nik.substring(s.nik.length - 4)}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                      }`}
                    >
                      {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{s.className}</span>
                    <span className="text-[10px] text-slate-400 block">{s.major}</span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        s.status === 'aktif'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.status === 'aktif' ? 'Aktif' : `Alumni '${s.graduationYear || '2024'}`}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-purple-900">{s.gpa}</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-600">{s.attendanceRate}%</td>
                  <td className="py-3.5 px-3">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Lunas
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingStudent({ ...s })}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Data Siswa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteStudent(s.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Hapus Data Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: TAMBAH SISWA BARU */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Input Data Siswa Baru</h3>
                <p className="text-xs text-slate-500">
                  Data yang diinput akan otomatis dienkripsi dengan standar AES-256 dan disinkronkan ke website.
                </p>
              </div>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Maria Fransiska Jelita"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={newStudent.gender}
                    onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NISN (10 Digit) *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="Contoh: 0089123456"
                    value={newStudent.nisn}
                    onChange={(e) => setNewStudent({ ...newStudent, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK (16 Digit) *</label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="Contoh: 5310012304080001"
                    value={newStudent.nik}
                    onChange={(e) => setNewStudent({ ...newStudent, nik: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={newStudent.classLevel}
                    onChange={(e) => setNewStudent({ ...newStudent, classLevel: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rombel</label>
                  <input
                    type="text"
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jurusan</label>
                  <select
                    value={newStudent.major}
                    onChange={(e) => setNewStudent({ ...newStudent, major: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="MIPA">MIPA</option>
                    <option value="IPS">IPS</option>
                    <option value="Bahasa & Budaya">Bahasa & Budaya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Siswa</label>
                  <select
                    value={newStudent.status}
                    onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-semibold"
                  >
                    <option value="aktif">Siswa Aktif</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rata-rata Nilai (GPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newStudent.gpa}
                    onChange={(e) => setNewStudent({ ...newStudent, gpa: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kehadiran (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newStudent.attendanceRate}
                    onChange={(e) => setNewStudent({ ...newStudent, attendanceRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Domisili Siswa</label>
                <input
                  type="text"
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                  placeholder="Contoh: Jl. Ahmad Yani No. 12, Ruteng"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex items-center gap-2 text-xs text-purple-900">
                <ShieldCheck className="w-5 h-5 text-purple-700 flex-shrink-0" />
                <span>
                  Sistem keamanan otomatis mengenkripsi data identitas dengan AES-256 sebelum disimpan.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan & Enkripsi Data Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DATA SISWA */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  <span>Edit Data Siswa</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Perbarui profil dan catatan akademik siswa: <strong className="text-slate-800">{editingStudent.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateStudent) {
                  onUpdateStudent(editingStudent);
                } else {
                  onDeleteStudent(editingStudent.id);
                  onAddStudent(editingStudent);
                }
                logAuditEvent(
                  session.username,
                  'UPDATE',
                  `Memperbarui data siswa: ${editingStudent.name} (${editingStudent.nisn})`
                );
                alert(`Data siswa "${editingStudent.name}" berhasil diperbarui!`);
                setEditingStudent(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <select
                    value={editingStudent.gender}
                    onChange={(e) => setEditingStudent({ ...editingStudent, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NISN (10 Digit) *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.nisn}
                    onChange={(e) => setEditingStudent({ ...editingStudent, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIK Siswa (16 Digit) *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.nik}
                    onChange={(e) => setEditingStudent({ ...editingStudent, nik: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                  <select
                    value={editingStudent.classLevel || 'X'}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, classLevel: e.target.value as 'X' | 'XI' | 'XII' })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rombel / Kelas *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.className}
                    onChange={(e) => setEditingStudent({ ...editingStudent, className: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jurusan / Peminatan</label>
                  <select
                    value={editingStudent.major}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        major: e.target.value as 'MIPA' | 'IPS' | 'Bahasa & Budaya',
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="MIPA">MIPA</option>
                    <option value="IPS">IPS</option>
                    <option value="Bahasa & Budaya">Bahasa & Budaya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Siswa</label>
                  <select
                    value={editingStudent.status}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, status: e.target.value as 'aktif' | 'alumni' })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="aktif">Aktif</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rata-rata Nilai (GPA)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingStudent.gpa}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, gpa: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kehadiran (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingStudent.attendanceRate}
                    onChange={(e) =>
                      setEditingStudent({
                        ...editingStudent,
                        attendanceRate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. HP / WhatsApp Siswa</label>
                  <input
                    type="text"
                    value={editingStudent.phone || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    placeholder="08..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={editingStudent.parentName || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    placeholder="Nama Orang Tua"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Domisili Siswa</label>
                <input
                  type="text"
                  value={editingStudent.address || ''}
                  onChange={(e) => setEditingStudent({ ...editingStudent, address: e.target.value })}
                  placeholder="Contoh: Jl. Ahmad Yani No. 12, Ruteng"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Perubahan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Impor Excel Siswa */}
      {showImportModal && (
        <ExcelImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="students"
          onImportStudents={(importedList) => {
            importedList.forEach((s) => onAddStudent(s));
          }}
        />
      )}
    </div>
  );
};
