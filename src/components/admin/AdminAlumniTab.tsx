import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  Search,
  FileSpreadsheet,
  FileDown,
  Upload,
  Plus,
  Lock,
  Unlock,
  Building,
  MapPin,
  Phone,
  Edit2,
  Trash2,
  UserCheck,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';
import { Student, UserSession } from '../../types';
import { exportAlumniReportPDF } from '../../services/pdfExport';
import {
  downloadAlumniTemplate,
  exportAlumniToExcelTemplate,
} from '../../services/excelTemplate';
import { simulateAesEncrypt } from '../../services/encryption';
import { ExcelImportModal } from '../common/ExcelImportModal';

interface AdminAlumniTabProps {
  session: UserSession;
  students: Student[];
  onAddAlumni: (alumni: Student) => void;
  onUpdateAlumni?: (alumni: Student) => void;
  onDeleteAlumni: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminAlumniTab: React.FC<AdminAlumniTabProps> = ({
  session,
  students,
  onAddAlumni,
  onUpdateAlumni,
  onDeleteAlumni,
  onNavigateToWebsiteTab,
}) => {
  // Hanya ambil data yang berstatus 'alumni'
  const alumniList = students.filter((s) => s.status === 'alumni');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState<string>('semua');
  const [filterMajor, setFilterMajor] = useState<string>('semua');
  const [showDecryptedData, setShowDecryptedData] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Student | null>(null);

  // Form state untuk tambah alumni baru
  const [newAlumni, setNewAlumni] = useState({
    name: '',
    nisn: '',
    nik: '',
    gender: 'L' as 'L' | 'P',
    major: 'MIPA' as 'MIPA' | 'IPS' | 'Bahasa & Budaya',
    graduationYear: 2024,
    alumniCampus: '',
    alumniOccupation: '',
    phone: '',
    address: '',
    gpa: 90.0,
  });

  // Ambil daftar tahun kelulusan unik
  const availableYears = Array.from(
    new Set(alumniList.map((a) => a.graduationYear).filter(Boolean))
  ).sort((a, b) => (b as number) - (a as number)) as number[];

  // Filter alumni
  const filteredAlumni = alumniList.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.nisn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.alumniCampus || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.alumniOccupation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.address || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesYear =
      filterYear === 'semua' || a.graduationYear?.toString() === filterYear;

    const matchesMajor = filterMajor === 'semua' || a.major === filterMajor;

    return matchesSearch && matchesYear && matchesMajor;
  });

  // Metrik Statistik
  const totalAlumni = alumniList.length;
  const collegeCount = alumniList.filter(
    (a) => a.alumniCampus && a.alumniCampus.trim().length > 0
  ).length;
  const careerCount = alumniList.filter(
    (a) => a.alumniOccupation && a.alumniOccupation.trim().length > 0
  ).length;
  const collegePct = totalAlumni > 0 ? Math.round((collegeCount / totalAlumni) * 100) : 0;

  const toggleDecryption = () => {
    if (!showDecryptedData) {
      const pin = prompt('Masukkan PIN Administrator untuk mendekripsi NIK & Data Sensitif:');
      if (pin === '1234' || pin === 'admin') {
        setShowDecryptedData(true);
      } else if (pin !== null) {
        alert('PIN Keamanan Salah!');
      }
    } else {
      setShowDecryptedData(false);
    }
  };

  const handleCreateAlumni = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumni.name || !newAlumni.nisn) {
      alert('Nama alumni dan NISN wajib diisi!');
      return;
    }

    const created: Student = {
      id: `alumni-${Date.now()}`,
      nisn: newAlumni.nisn,
      nik: newAlumni.nik || '5310021405070001',
      name: newAlumni.name,
      gender: newAlumni.gender,
      classLevel: 'XII',
      className: `Alumni-${newAlumni.graduationYear}-${newAlumni.major}`,
      major: newAlumni.major,
      status: 'alumni',
      graduationYear: Number(newAlumni.graduationYear),
      alumniCampus: newAlumni.alumniCampus,
      alumniOccupation: newAlumni.alumniOccupation,
      phone: newAlumni.phone || '081234567890',
      parentName: 'Keluarga Alumni',
      parentPhone: '081234567890',
      address: newAlumni.address || 'Ruteng, Flores, NTT',
      gpa: Number(newAlumni.gpa) || 90.0,
      attendanceRate: 100,
      tuitionStatus: 'Lunas',
      encryptedHash: simulateAesEncrypt(`${newAlumni.nik}:${newAlumni.name}`),
    };

    onAddAlumni(created);
    setShowAddModal(false);
    setNewAlumni({
      name: '',
      nisn: '',
      nik: '',
      gender: 'L',
      major: 'MIPA',
      graduationYear: 2024,
      alumniCampus: '',
      alumniOccupation: '',
      phone: '',
      address: '',
      gpa: 90.0,
    });
    alert(`Data alumni "${created.name}" angkatan ${created.graduationYear} berhasil ditambahkan!`);
  };

  const handleUpdateCareer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlumni) return;

    if (onUpdateAlumni) {
      onUpdateAlumni(editingAlumni);
    } else {
      // Fallback: hapus lalu tambahkan kembali
      onDeleteAlumni(editingAlumni.id);
      onAddAlumni(editingAlumni);
    }
    setEditingAlumni(null);
    alert('Informasi karir & studi alumni berhasil diperbarui!');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-[#0f1d38] to-[#16274e] p-6 rounded-3xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Tracer Study & Ikatan Alumni</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Direktori & Data Alumni
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Basis data lulusan SMAK Setia Bakti Ruteng, pelacakan karir, studi lanjut perguruan
            tinggi, dan jaringan alumni terintegrasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportAlumniToExcelTemplate(alumniList, filterYear)}
            className="px-3.5 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl border border-emerald-500/30 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Ekspor Data Alumni ke Excel/CSV Sesuai Format Resmi"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor Excel</span>
          </button>

          <button
            type="button"
            onClick={downloadAlumniTemplate}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Unduh Format Template Excel Kosong untuk Alumni"
          >
            <FileDown className="w-4 h-4 text-sky-400" />
            <span>Template Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-xl border border-indigo-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Impor Data Alumni dari Template Excel/CSV"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Impor Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Alumni</span>
          </button>
        </div>
      </div>

      {/* Metrik Statistik Ringkas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 leading-tight">{totalAlumni}</div>
            <div className="text-[11px] font-bold text-slate-500">Total Alumni Terdata</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 leading-tight">
              {collegeCount} <span className="text-xs text-indigo-600 font-semibold">({collegePct}%)</span>
            </div>
            <div className="text-[11px] font-bold text-slate-500">Melanjutkan ke PTN/PTS</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 leading-tight">{careerCount}</div>
            <div className="text-[11px] font-bold text-slate-500">Berkarir Profesional</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 leading-tight">100%</div>
            <div className="text-[11px] font-bold text-slate-500">Tingkat Keterserapan</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Pencarian, Filter Tahun, Jurusan, Dekripsi, dan Cetak PDF */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nama, NISN, kampus, profesi, domisili..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Tahun Lulus */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Tahun:</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Angkatan</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr.toString()}>
                  Tahun {yr}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Jurusan */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Jurusan:</span>
            <select
              value={filterMajor}
              onChange={(e) => setFilterMajor(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="semua">Semua Jurusan</option>
              <option value="MIPA">MIPA</option>
              <option value="IPS">IPS</option>
              <option value="Bahasa & Budaya">Bahasa & Budaya</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            type="button"
            onClick={toggleDecryption}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              showDecryptedData
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
            title="Buka Enkripsi NIK & Data Sensitif"
          >
            {showDecryptedData ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{showDecryptedData ? 'Data Terbuka' : 'Dekripsi NIK'}</span>
          </button>

          <button
            type="button"
            onClick={() => exportAlumniReportPDF(alumniList, filterYear)}
            className="px-3.5 py-2 bg-[#5d3b9e] hover:bg-[#4d2f88] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* Tabel Data Alumni */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="p-3.5 pl-4">No</th>
                <th className="p-3.5">Nama Lengkap Alumni & Gelar</th>
                <th className="p-3.5">Tahun & Jurusan</th>
                <th className="p-3.5">Perguruan Tinggi / Kampus</th>
                <th className="p-3.5">Profesi / Karir Saat Ini</th>
                <th className="p-3.5">Kontak & Domisili</th>
                <th className="p-3.5 text-center">Nilai Akhir</th>
                <th className="p-3.5 pr-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredAlumni.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <GraduationCap className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold">Tidak ada data alumni yang cocok dengan pencarian.</p>
                  </td>
                </tr>
              ) : (
                filteredAlumni.map((a, idx) => (
                  <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3.5">
                      <div className="font-black text-slate-900">{a.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                        <span>NISN: {a.nisn}</span>
                        <span>•</span>
                        <span>
                          NIK:{' '}
                          {showDecryptedData
                            ? a.nik
                            : `${a.nik.slice(0, 6)}******${a.nik.slice(-4)}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-100">
                        <span>{a.graduationYear || 2023}</span>
                        <span>•</span>
                        <span>{a.major}</span>
                      </div>
                    </td>
                    <td className="p-3.5 max-w-[220px]">
                      {a.alumniCampus ? (
                        <div className="flex items-start gap-1.5 text-slate-800 font-medium">
                          <Building className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span className="truncate">{a.alumniCampus}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum diisi</span>
                      )}
                    </td>
                    <td className="p-3.5 max-w-[220px]">
                      {a.alumniOccupation ? (
                        <div className="flex items-start gap-1.5 text-slate-800 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className="truncate">{a.alumniOccupation}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Belum diisi</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="text-[11px] text-slate-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{showDecryptedData ? a.phone : '0812****' + a.phone.slice(-4)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[160px]">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{a.address || 'Ruteng'}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-center font-bold text-slate-800">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                        {a.gpa.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingAlumni(a)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Perbarui Karir & Studi Alumni"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus data alumni "${a.name}"?`)) {
                              onDeleteAlumni(a.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hapus Alumni"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Tambah Alumni Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Tambah Data Alumni Baru</h3>
                  <p className="text-[11px] text-slate-500">
                    Masukkan data identitas dan tracer study lulusan SMAK Setia Bakti
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlumni} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: dr. Fransiskus Xaverius, S.Ked."
                    value={newAlumni.name}
                    onChange={(e) => setNewAlumni({ ...newAlumni, name: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    placeholder="10 digit NISN"
                    value={newAlumni.nisn}
                    onChange={(e) => setNewAlumni({ ...newAlumni, nisn: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">NIK (Terenkripsi)</label>
                  <input
                    type="text"
                    placeholder="16 digit NIK"
                    value={newAlumni.nik}
                    onChange={(e) => setNewAlumni({ ...newAlumni, nik: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={newAlumni.gender}
                    onChange={(e) =>
                      setNewAlumni({ ...newAlumni, gender: e.target.value as 'L' | 'P' })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Kelulusan *</label>
                  <input
                    type="number"
                    required
                    min={1970}
                    max={2030}
                    value={newAlumni.graduationYear}
                    onChange={(e) =>
                      setNewAlumni({ ...newAlumni, graduationYear: parseInt(e.target.value) || 2024 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jurusan di SMAK</label>
                  <select
                    value={newAlumni.major}
                    onChange={(e) =>
                      setNewAlumni({
                        ...newAlumni,
                        major: e.target.value as 'MIPA' | 'IPS' | 'Bahasa & Budaya',
                      })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="MIPA">MIPA</option>
                    <option value="IPS">IPS</option>
                    <option value="Bahasa & Budaya">Bahasa & Budaya</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Perguruan Tinggi / Kampus Studi Lanjut
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Universitas Gadjah Mada (UGM) / Undana Kupang"
                    value={newAlumni.alumniCampus}
                    onChange={(e) => setNewAlumni({ ...newAlumni, alumniCampus: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Profesi / Pekerjaan / Instansi Saat Ini
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dokter Residen / Software Engineer / Wirausaha"
                    value={newAlumni.alumniOccupation}
                    onChange={(e) =>
                      setNewAlumni({ ...newAlumni, alumniOccupation: e.target.value })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={newAlumni.phone}
                    onChange={(e) => setNewAlumni({ ...newAlumni, phone: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nilai Rata-rata Ijazah</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={newAlumni.gpa}
                    onChange={(e) =>
                      setNewAlumni({ ...newAlumni, gpa: parseFloat(e.target.value) || 90.0 })
                    }
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Kota / Alamat Domisili Sekarang
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ruteng, Manggarai / Jakarta / Surabaya"
                    value={newAlumni.address}
                    onChange={(e) => setNewAlumni({ ...newAlumni, address: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Data Alumni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Karir & Studi Alumni */}
      {editingAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Perbarui Jejak Karir Alumni</h3>
                  <p className="text-[11px] text-slate-500">{editingAlumni.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingAlumni(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCareer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Perguruan Tinggi / Kampus Studi Lanjut
                </label>
                <input
                  type="text"
                  value={editingAlumni.alumniCampus || ''}
                  onChange={(e) =>
                    setEditingAlumni({ ...editingAlumni, alumniCampus: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Profesi / Pekerjaan / Instansi Saat Ini
                </label>
                <input
                  type="text"
                  value={editingAlumni.alumniOccupation || ''}
                  onChange={(e) =>
                    setEditingAlumni({ ...editingAlumni, alumniOccupation: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={editingAlumni.phone || ''}
                    onChange={(e) =>
                      setEditingAlumni({ ...editingAlumni, phone: e.target.value })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Lulus</label>
                  <input
                    type="number"
                    value={editingAlumni.graduationYear || 2023}
                    onChange={(e) =>
                      setEditingAlumni({
                        ...editingAlumni,
                        graduationYear: parseInt(e.target.value) || 2023,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kota / Domisili Saat Ini</label>
                <input
                  type="text"
                  value={editingAlumni.address || ''}
                  onChange={(e) =>
                    setEditingAlumni({ ...editingAlumni, address: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingAlumni(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Impor Alumni dari Excel */}
      {showImportModal && (
        <ExcelImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="alumni"
          onImportAlumni={(importedList) => {
            importedList.forEach((a) => onAddAlumni(a));
          }}
        />
      )}
    </div>
  );
};
