import React, { useState } from 'react';
import {
  UserPlus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Printer,
  Plus,
} from 'lucide-react';
import { PPDBRegistration } from '../../types';
import { exportPPDBReceiptPDF } from '../../services/pdfExport';

interface AdminPPDBTabProps {
  ppdbList: PPDBRegistration[];
  onAddPPDB: (reg: PPDBRegistration) => void;
  onUpdatePPDBStatus: (id: string, status: PPDBRegistration['status'], notes?: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminPPDBTab: React.FC<AdminPPDBTabProps> = ({
  ppdbList,
  onAddPPDB,
  onUpdatePPDBStatus,
  onNavigateToWebsiteTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMajor, setFilterMajor] = useState('Semua');
  const [showManualModal, setShowManualModal] = useState(false);

  // Form manual entry
  const [manualName, setManualName] = useState('');
  const [manualNisn, setManualNisn] = useState('');
  const [manualSchool, setManualSchool] = useState('');
  const [manualMajor, setManualMajor] = useState<'MIPA' | 'IPS' | 'Bahasa & Budaya'>('MIPA');
  const [manualGender, setManualGender] = useState<'L' | 'P'>('L');
  const [manualPhone, setManualPhone] = useState('');
  const [manualParent, setManualParent] = useState('');
  const [manualScore, setManualScore] = useState('88.5');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualSchool) {
      alert('Mohon isi nama calon siswa dan asal sekolah!');
      return;
    }

    const regNum = `PPDB-2026-${String(ppdbList.length + 1).padStart(3, '0')}`;
    const newReg: PPDBRegistration = {
      id: `reg-${Date.now()}`,
      regNumber: regNum,
      fullName: manualName,
      nisn: manualNisn || '0089876543',
      originSchool: manualSchool,
      chosenMajor: manualMajor,
      gender: manualGender,
      parentName: manualParent || 'Orang Tua Calon Siswa',
      parentPhone: manualPhone || '081234567890',
      parentIncome: 'Rp 3.000.000 - Rp 5.000.000',
      averageScore: parseFloat(manualScore) || 85.0,
      registeredDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Berkas Lengkap',
      documents: {
        ijazah: true,
        kartuKeluarga: true,
        raporSMP: true,
        pasFoto: true,
      },
      notes: 'Pendaftaran mandiri melalui loket administrasi panitia PPDB SMAK Setia Bakti.',
    };

    onAddPPDB(newReg);
    setShowManualModal(false);
    setManualName('');
    setManualNisn('');
    setManualSchool('');
    alert(`Pendaftar ${manualName} berhasil dicatat dengan No. Registrasi: ${regNum}!`);
  };

  const filteredPPDB = ppdbList.filter((reg) => {
    const matchesMajor = filterMajor === 'Semua' || reg.chosenMajor === filterMajor;
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.regNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.originSchool.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMajor && matchesSearch;
  });

  const totalDiterima = ppdbList.filter((p) => p.status === 'Diterima').length;
  const totalPerbaikan = ppdbList.filter((p) => p.status === 'Perlu Perbaikan').length;
  const totalMenunggu = ppdbList.filter((p) => p.status === 'Menunggu Verifikasi' || p.status === 'Berkas Lengkap').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with integration status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
              PPDB Online 2026/2027
            </span>
            <span className="text-xs text-slate-400">• Terhubung ke Formulir Pendaftaran Website</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Verifikasi Pendaftaran Siswa Baru (PPDB)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verifikasi kelengkapan berkas ijazah, rapor, KK, ubah status kelulusan, dan cetak kuitansi pendaftaran.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToWebsiteTab && (
            <button
              onClick={() => onNavigateToWebsiteTab('ppdb')}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#432874] text-xs font-bold rounded-xl border border-purple-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Buka Formulir PPDB Website</span>
            </button>
          )}

          <button
            onClick={() => setShowManualModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Input Calon Siswa Manual</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Pendaftar</span>
            <p className="text-2xl font-black text-slate-900">{ppdbList.length}</p>
            <span className="text-[11px] text-slate-500">Semua Jalur & Peminatan</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Lolos Seleksi</span>
            <p className="text-2xl font-black text-emerald-600">{totalDiterima}</p>
            <span className="text-[11px] text-slate-500">Status Diterima</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Perlu Perbaikan</span>
            <p className="text-2xl font-black text-amber-600">{totalPerbaikan}</p>
            <span className="text-[11px] text-slate-500">Menunggu Berkas Tambahan</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Menunggu Verifikasi</span>
            <p className="text-2xl font-black text-purple-700">{totalMenunggu}</p>
            <span className="text-[11px] text-slate-500">Dalam Antrean Panitia</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nomor registrasi, nama calon siswa, atau asal SMP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Peminatan:</span>
          <select
            value={filterMajor}
            onChange={(e) => setFilterMajor(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="Semua">Semua Peminatan</option>
            <option value="MIPA">MIPA</option>
            <option value="IPS">IPS</option>
            <option value="Bahasa & Budaya">Bahasa & Budaya</option>
          </select>
        </div>
      </div>

      {/* PPDB Registrations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1730] text-slate-200 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No. Registrasi</th>
                <th className="py-3.5 px-4">Nama Calon Siswa</th>
                <th className="py-3.5 px-4">Asal SMP</th>
                <th className="py-3.5 px-3">Peminatan</th>
                <th className="py-3.5 px-3">Rata-rata Rapor</th>
                <th className="py-3.5 px-3">Dokumen</th>
                <th className="py-3.5 px-4">Status Seleksi</th>
                <th className="py-3.5 px-4 text-center">Cetak Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPPDB.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-900">{reg.regNumber}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{reg.fullName}</span>
                    <span className="text-[10px] text-slate-400">NISN: {reg.nisn}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{reg.originSchool}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                      {reg.chosenMajor}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-800">{reg.averageScore}</td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1 text-[10px] font-bold">
                      <span className={reg.documents.ijazah ? 'text-emerald-600' : 'text-slate-300'}>Ijazah</span>
                      <span>•</span>
                      <span className={reg.documents.raporSMP ? 'text-emerald-600' : 'text-slate-300'}>Rapor</span>
                      <span>•</span>
                      <span className={reg.documents.kartuKeluarga ? 'text-emerald-600' : 'text-slate-300'}>KK</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={reg.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as PPDBRegistration['status'];
                        onUpdatePPDBStatus(reg.id, newStatus);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer outline-none ${
                        reg.status === 'Diterima'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : reg.status === 'Perlu Perbaikan'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : 'bg-blue-50 text-blue-800 border-blue-300'
                      }`}
                    >
                      <option value="Diterima">Diterima</option>
                      <option value="Berkas Lengkap">Berkas Lengkap</option>
                      <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                      <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => exportPPDBReceiptPDF(reg)}
                      className="p-1.5 bg-slate-100 hover:bg-purple-100 text-purple-900 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 font-bold text-[11px]"
                      title="Cetak Kuitansi Resmi PPDB"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: INPUT CALON SISWA MANUAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Input Pendaftaran PPDB Manual</h3>
                <p className="text-xs text-slate-500">
                  Untuk calon siswa yang mendaftar langsung di loket pendaftaran SMAK Setia Bakti.
                </p>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Calon Siswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap sesuai ijazah SMP..."
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NISN SMP</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="0081234567"
                    value={manualNisn}
                    onChange={(e) => setManualNisn(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={manualGender}
                    onChange={(e) => setManualGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Asal Sekolah (SMP/MTs) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMPN 1 Ruteng"
                    value={manualSchool}
                    onChange={(e) => setManualSchool(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilihan Peminatan</label>
                  <select
                    value={manualMajor}
                    onChange={(e) => setManualMajor(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  >
                    <option value="MIPA">MIPA (Matematika & Ilmu Alam)</option>
                    <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                    <option value="Bahasa & Budaya">Bahasa & Budaya</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nilai Rata-rata Rapor SMP</label>
                  <input
                    type="number"
                    step="0.1"
                    value={manualScore}
                    onChange={(e) => setManualScore(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                  <input
                    type="text"
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={manualParent}
                    onChange={(e) => setManualParent(e.target.value)}
                    placeholder="Nama bapak/ibu..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Pendaftaran PPDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
