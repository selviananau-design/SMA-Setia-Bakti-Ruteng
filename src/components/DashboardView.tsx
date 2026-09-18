import React from 'react';
import { UserCheck, FileSpreadsheet, FileDown, BookOpen } from 'lucide-react';
import {
  Student,
  PPDBRegistration,
  PushNotification,
  UserSession,
  TeacherStaff,
  NewsItem,
  SchoolEvent,
  GalleryItem,
} from '../types';
import { exportStudentReportPDF } from '../services/pdfExport';
import { downloadStudentTemplate } from '../services/excelTemplate';
import { AdminResultDashboard } from './AdminResultDashboard';

interface DashboardViewProps {
  session: UserSession;
  students: Student[];
  teachers: TeacherStaff[];
  newsList: NewsItem[];
  eventsList: SchoolEvent[];
  galleryList: GalleryItem[];
  ppdbList: PPDBRegistration[];
  notifications: PushNotification[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onAddTeacher: (teacher: TeacherStaff) => void;
  onDeleteTeacher: (id: string) => void;
  onAddNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onAddEvent: (event: SchoolEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddGallery: (item: GalleryItem) => void;
  onDeleteGallery: (id: string) => void;
  onAddPPDB: (reg: PPDBRegistration) => void;
  onUpdatePPDBStatus: (id: string, status: PPDBRegistration['status'], notes?: string) => void;
  onSendPushNotification: (
    title: string,
    message: string,
    target: 'all' | 'guru' | 'orangtua' | 'siswa',
    priority: 'urgent' | 'info' | 'akademik'
  ) => void;
  onBackToPortal?: () => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  session,
  students,
  teachers,
  newsList,
  eventsList,
  galleryList,
  ppdbList,
  notifications,
  onAddStudent,
  onDeleteStudent,
  onAddTeacher,
  onDeleteTeacher,
  onAddNews,
  onDeleteNews,
  onAddEvent,
  onDeleteEvent,
  onAddGallery,
  onDeleteGallery,
  onAddPPDB,
  onUpdatePPDBStatus,
  onSendPushNotification,
  onBackToPortal,
  onNavigateToWebsiteTab,
}) => {
  // 1. If role is admin, render the requested Student Result Dashboard matching the website and reference UI
  if (session.role === 'admin') {
    return (
      <AdminResultDashboard
        session={session}
        students={students}
        teachers={teachers}
        newsList={newsList}
        eventsList={eventsList}
        galleryList={galleryList}
        ppdbList={ppdbList}
        notifications={notifications}
        onAddStudent={onAddStudent}
        onDeleteStudent={onDeleteStudent}
        onAddTeacher={onAddTeacher}
        onDeleteTeacher={onDeleteTeacher}
        onAddNews={onAddNews}
        onDeleteNews={onDeleteNews}
        onAddEvent={onAddEvent}
        onDeleteEvent={onDeleteEvent}
        onAddGallery={onAddGallery}
        onDeleteGallery={onDeleteGallery}
        onAddPPDB={onAddPPDB}
        onUpdatePPDBStatus={onUpdatePPDBStatus}
        onSendPushNotification={onSendPushNotification}
        onBackToPortal={onBackToPortal}
        onNavigateToWebsiteTab={onNavigateToWebsiteTab}
      />
    );
  }

  // 2. Non-admin roles (Guru & Orang Tua)
  return (
    <div className="w-full py-8 bg-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Top Banner Session Profile */}
        <div className="bg-[#3b1d70] text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-900/80 border-2 border-purple-300/40 flex items-center justify-center text-amber-300 font-bold text-xl shadow">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-purple-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">
                  {session.role === 'guru' ? 'Portal Guru / Pendidik' : 'Portal Orang Tua Siswa'}
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

        {/* ROLE: GURU VIEW */}
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

        {/* ROLE: ORANG TUA VIEW */}
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
                      {
                        mapel: 'Pendidikan Agama Katolik & Budi Pekerti',
                        kkm: 75,
                        nilai: 94,
                        predikat: 'A',
                        ket: 'Sangat menguasai nilai-nilai etika kristiani dan sakramen gereja.',
                      },
                      {
                        mapel: 'Fisika Peminatan',
                        kkm: 75,
                        nilai: 91,
                        predikat: 'A',
                        ket: 'Terampil melakukan pemodelan praktikum mekanika gerak dan listrik dinamis.',
                      },
                      {
                        mapel: 'Biologi Peminatan',
                        kkm: 75,
                        nilai: 93,
                        predikat: 'A',
                        ket: 'Menunjukkan pemahaman mendalam pada analisis bioteknologi pangan lokal.',
                      },
                      {
                        mapel: 'Matematika Tingkat Lanjut',
                        kkm: 75,
                        nilai: 88,
                        predikat: 'B+',
                        ket: 'Mampu menyelesaikan persoalan kalkulus diferensial dan matriks.',
                      },
                      {
                        mapel: 'Bahasa & Sastra Inggris',
                        kkm: 75,
                        nilai: 87,
                        predikat: 'B+',
                        ket: 'Aktif berdialog dalam percakapan akademik formal.',
                      },
                      {
                        mapel: 'Pendidikan Pancasila',
                        kkm: 75,
                        nilai: 92,
                        predikat: 'A',
                        ket: 'Menghayati nilai toleransi dan wawasan kebangsaan yang luhur.',
                      },
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
      </div>
    </div>
  );
};
