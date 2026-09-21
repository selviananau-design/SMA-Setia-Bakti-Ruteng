import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ExternalLink,
  Award,
  CheckCircle,
} from 'lucide-react';

interface AdminAcademicTabProps {
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminAcademicTab: React.FC<AdminAcademicTabProps> = ({ onNavigateToWebsiteTab }) => {
  const [selectedMajor, setSelectedMajor] = useState<'MIPA' | 'IPS' | 'Bahasa'>('MIPA');

  const subjects = {
    MIPA: [
      { code: 'MIPA-01', name: 'Matematika Tingkat Lanjut', kkm: 75, hours: 5, teacher: 'Theresia Imelda Ndua, M.Si.' },
      { code: 'MIPA-02', name: 'Fisika Peminatan', kkm: 75, hours: 5, teacher: 'Yohanes Bosko, S.Pd.' },
      { code: 'MIPA-03', name: 'Kimia Analitik & Sains', kkm: 75, hours: 4, teacher: 'Katarina Melati, M.Pd.' },
      { code: 'MIPA-04', name: 'Biologi Lingkungan Manggarai', kkm: 75, hours: 4, teacher: 'Fransiskus Xaverius, S.Si.' },
      { code: 'UMUM-01', name: 'Pendidikan Agama Katolik & Budi Pekerti', kkm: 78, hours: 3, teacher: 'Pastor Mikael Beding, Pr.' },
      { code: 'UMUM-02', name: 'Bahasa & Sastra Inggris', kkm: 75, hours: 4, teacher: 'Stefanus Ngganggur, S.Pd.' },
    ],
    IPS: [
      { code: 'IPS-01', name: 'Sosiologi Masyarakat Kepulauan', kkm: 75, hours: 5, teacher: 'Dra. Maria Yosefina' },
      { code: 'IPS-02', name: 'Geografi & Mitigasi Bencana NTT', kkm: 75, hours: 4, teacher: 'Petrus Mansetus, S.Pd.' },
      { code: 'IPS-03', name: 'Ekonomi Terapan & Koperasi', kkm: 75, hours: 5, teacher: 'Ignatius Riberu, SE., M.Pd.' },
      { code: 'IPS-04', name: 'Sejarah Indonesia & Peradaban Dunia', kkm: 75, hours: 4, teacher: 'Bernadus Beda, S.Pd.' },
      { code: 'UMUM-01', name: 'Pendidikan Agama Katolik & Budi Pekerti', kkm: 78, hours: 3, teacher: 'Pastor Mikael Beding, Pr.' },
      { code: 'UMUM-02', name: 'Bahasa Indonesia Akademik', kkm: 76, hours: 4, teacher: 'Klara Melati, M.Hum.' },
    ],
    Bahasa: [
      { code: 'BHS-01', name: 'Bahasa & Sastra Jerman', kkm: 75, hours: 5, teacher: 'Helena Lawang, B.A.' },
      { code: 'BHS-02', name: 'Bahasa & Sastra Inggris Lanjut', kkm: 78, hours: 5, teacher: 'Stefanus Ngganggur, S.Pd.' },
      { code: 'BHS-03', name: 'Linguistik Bahasa Manggarai & NTT', kkm: 75, hours: 4, teacher: 'Drs. Antonius Bagung' },
      { code: 'BHS-04', name: 'Antropologi Budaya Nusantara', kkm: 75, hours: 4, teacher: 'Klara Melati, M.Hum.' },
      { code: 'UMUM-01', name: 'Pendidikan Agama Katolik & Budi Pekerti', kkm: 78, hours: 3, teacher: 'Pastor Mikael Beding, Pr.' },
    ],
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold uppercase tracking-wider">
              Kurikulum Merdeka 2026
            </span>
            <span className="text-xs text-slate-400">• Tampil di Menu Akademik</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Struktur Kurikulum & Mata Pelajaran</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan alokasi jam belajar mingguan, KKTP (Kriteria Ketercapaian Tujuan Pembelajaran), dan guru pengampu.
          </p>
        </div>
      </div>

      {/* Major selector */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        {(['MIPA', 'IPS', 'Bahasa'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMajor(m)}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              selectedMajor === m
                ? 'bg-[#3b1d70] text-white shadow'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Peminatan {m === 'Bahasa' ? 'Bahasa & Budaya' : m}
          </button>
        ))}
      </div>

      {/* Subject Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Daftar Mata Pelajaran Kurikulum Merdeka - {selectedMajor}
          </h3>
          <span className="text-xs text-slate-500">Standar KKTP / KKM Nasional: 75.0</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1730] text-slate-200 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Kode Mapel</th>
                <th className="py-3 px-4">Nama Mata Pelajaran</th>
                <th className="py-3 px-3">Beban Jam / Minggu</th>
                <th className="py-3 px-3">Standar KKM / KKTP</th>
                <th className="py-3 px-4">Guru Pengampu</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {subjects[selectedMajor].map((sub) => (
                <tr key={sub.code} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-purple-900">{sub.code}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-3.5 px-3 font-semibold text-slate-700">{sub.hours} Jam Pelajaran</td>
                  <td className="py-3.5 px-3 font-bold text-emerald-700">{sub.kkm}</td>
                  <td className="py-3.5 px-4 text-slate-700">{sub.teacher}</td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
                      <CheckCircle className="w-3 h-3" /> Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
