import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  FileDown,
  FileSpreadsheet,
  X,
  Award,
} from 'lucide-react';
import { TeacherStaff } from '../types';
import { exportTeacherDirectoryPDF } from '../services/pdfExport';
import { downloadTeacherTemplate } from '../services/excelTemplate';

interface TeacherStaffSectionProps {
  teachers: TeacherStaff[];
  initialDept?: string;
}

export const TeacherStaffSection: React.FC<TeacherStaffSectionProps> = ({
  teachers,
  initialDept = 'Semua',
}) => {
  const [selectedDept, setSelectedDept] = useState<string>(initialDept || 'Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherStaff | null>(null);

  React.useEffect(() => {
    if (initialDept) {
      setSelectedDept(initialDept);
    }
  }, [initialDept]);

  const departments = ['Semua', 'Pimpinan', 'MIPA', 'IPS & Bahasa', 'Agama & Budi Pekerti', 'Kesiswaan & BK', 'Tata Usaha'];

  const filteredTeachers = teachers.filter((t) => {
    const matchesDept =
      selectedDept === 'Semua' ||
      (selectedDept === 'Pimpinan' && (t.role === 'Kepala Sekolah' || t.role === 'Wakil Kepala Sekolah')) ||
      t.department === selectedDept;

    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.includes(searchQuery);

    return matchesDept && matchesSearch;
  });

  return (
    <section className="w-full py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
          <div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-1 rounded-full inline-block mb-1">
              Tenaga Pendidik Berpengalaman
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#321759] font-serif tracking-tight">
              Profil Guru & Pegawai
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Didukung oleh tenaga pendidik berkompeten lulusan universitas negeri dan swasta terkemuka,
              berdedikasi membimbing perkembangan intelektual dan karakter moral siswa.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTeacherDirectoryPDF(teachers)}
              className="bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Unduh Direktori Guru & Pegawai Format PDF Resmi"
            >
              <FileDown className="w-4 h-4" />
              <span>Unduh Daftar PDF</span>
            </button>
            <button
              onClick={downloadTeacherTemplate}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              title="Unduh Format Excel untuk Penambahan Data Guru/Pegawai"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Template Excel Guru</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
          {/* Department Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#432874] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-900'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama guru, NIP, mapel..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white text-slate-800"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="p-5 flex items-start gap-4">
                {/* Photo Thumbnail */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-purple-100 flex-shrink-0 border-2 border-purple-200 shadow-sm group-hover:border-purple-600 transition-colors">
                  <img
                    src={teacher.photoUrl}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Main Information */}
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded uppercase">
                    {teacher.role}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug group-hover:text-[#432874] transition-colors">
                    {teacher.name}
                  </h3>
                  <p className="text-xs text-purple-900 font-semibold mt-0.5 line-clamp-1">
                    {teacher.subject}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-700 flex-shrink-0" />
                    <span className="truncate">{teacher.education}</span>
                  </p>
                </div>
              </div>

              {/* Footer Meta & Action */}
              <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 mt-auto">
                <span className="font-mono text-[11px] text-slate-500">
                  NIP: {teacher.nip.slice(0, 8)}...
                </span>
                <button
                  onClick={() => setSelectedTeacher(teacher)}
                  className="text-xs font-bold text-[#432874] hover:text-purple-950 transition-colors cursor-pointer"
                >
                  Detail Profil &gt;
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada data guru yang cocok</p>
            <p className="text-xs text-slate-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </div>

      {/* Teacher Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#432874] text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedTeacher.photoUrl}
                  alt={selectedTeacher.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-white/60 shadow"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="bg-purple-900 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {selectedTeacher.role}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 leading-tight">
                    {selectedTeacher.name}
                  </h3>
                  <p className="text-xs text-purple-200">{selectedTeacher.subject}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs sm:text-sm text-slate-700">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">NIP Pegawai</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedTeacher.nip}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">NUPTK</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedTeacher.nuptk}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Riwayat Pendidikan:</h4>
                <p className="text-slate-600 bg-purple-50 p-2.5 rounded-lg border border-purple-200 text-xs">
                  {selectedTeacher.education}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Tentang & Dedikasi:</h4>
                <p className="text-slate-600 leading-relaxed text-xs">{selectedTeacher.bio}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-purple-700" />
                  <span>{selectedTeacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-purple-700" />
                  <span>{selectedTeacher.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 flex justify-end">
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-4 py-1.5 bg-[#432874] text-white text-xs font-semibold rounded hover:bg-[#341b5e] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
