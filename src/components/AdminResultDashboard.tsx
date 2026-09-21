import React, { useState } from 'react';
import {
  LayoutGrid,
  Users,
  Newspaper,
  BookOpen,
  UserCheck,
  UserPlus,
  Image,
  FileDown,
  ShieldCheck,
  Trophy,
  GraduationCap,
  ArrowLeft,
  Globe,
  School,
  Sparkles,
  LogOut,
} from 'lucide-react';
import {
  Student,
  PPDBRegistration,
  PushNotification,
  UserSession,
  TeacherStaff,
  NewsItem,
  SchoolEvent,
  GalleryItem,
  SchoolProfile,
  MajorProgram,
  Extracurricular,
  StudentWork,
  TeacherAdministrationDoc,
  SubjectAttendanceSession,
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_MAJORS,
  INITIAL_EXTRACURRICULARS,
  INITIAL_STUDENT_WORKS,
  INITIAL_TEACHER_ADMIN_DOCS,
  INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
} from '../data/mockData';

import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminNewsEventsTab } from './admin/AdminNewsEventsTab';
import { AdminStudentsTab } from './admin/AdminStudentsTab';
import { AdminPPDBTab } from './admin/AdminPPDBTab';
import { AdminTeachersTab } from './admin/AdminTeachersTab';
import { AdminGalleryTab } from './admin/AdminGalleryTab';
import { AdminAcademicTab } from './admin/AdminAcademicTab';
import { AdminReportsTab } from './admin/AdminReportsTab';
import { AdminSecurityNotifTab } from './admin/AdminSecurityNotifTab';
import { AdminProfileTab } from './admin/AdminProfileTab';
import { AdminMajorsTab } from './admin/AdminMajorsTab';
import { AdminCampusLifeTab } from './admin/AdminCampusLifeTab';
import { AdminTeacherAdminTab } from './admin/AdminTeacherAdminTab';
import { FolderCheck } from 'lucide-react';

interface AdminResultDashboardProps {
  session: UserSession;
  students: Student[];
  teachers: TeacherStaff[];
  newsList: NewsItem[];
  eventsList: SchoolEvent[];
  galleryList: GalleryItem[];
  ppdbList: PPDBRegistration[];
  notifications: PushNotification[];
  schoolProfile?: SchoolProfile;
  majors?: MajorProgram[];
  extracurriculars?: Extracurricular[];
  studentWorks?: StudentWork[];
  teacherAdminDocs?: TeacherAdministrationDoc[];
  subjectAttendanceSessions?: SubjectAttendanceSession[];
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
  onUpdateTeacherAdminDoc?: (
    id: string,
    status: TeacherAdministrationDoc['status'],
    feedbackNotes?: string,
    supervisionScore?: number,
    verifiedBy?: string
  ) => void;
  onVerifyTeacherAdminDoc?: (
    id: string,
    status: TeacherAdministrationDoc['status'],
    score?: number,
    notes?: string,
    verifierName?: string
  ) => void;
  onDeleteTeacherAdminDoc?: (id: string) => void;
  onUpdateSchoolProfile?: (profile: SchoolProfile) => void;
  onAddMajor?: (major: MajorProgram) => void;
  onDeleteMajor?: (id: string) => void;
  onAddExtracurricular?: (eskul: Extracurricular) => void;
  onDeleteExtracurricular?: (id: string) => void;
  onAddStudentWork?: (work: StudentWork) => void;
  onDeleteStudentWork?: (id: string) => void;
  onBackToPortal?: () => void;
  onLogout?: () => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminResultDashboard: React.FC<AdminResultDashboardProps> = ({
  session,
  students,
  teachers,
  newsList,
  eventsList,
  galleryList,
  ppdbList,
  notifications,
  schoolProfile = INITIAL_SCHOOL_PROFILE,
  majors = INITIAL_MAJORS,
  extracurriculars = INITIAL_EXTRACURRICULARS,
  studentWorks = INITIAL_STUDENT_WORKS,
  teacherAdminDocs = INITIAL_TEACHER_ADMIN_DOCS,
  subjectAttendanceSessions = INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
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
  onUpdateTeacherAdminDoc,
  onVerifyTeacherAdminDoc,
  onDeleteTeacherAdminDoc = () => {},
  onUpdateSchoolProfile = () => {},
  onAddMajor = () => {},
  onDeleteMajor = () => {},
  onAddExtracurricular = () => {},
  onDeleteExtracurricular = () => {},
  onAddStudentWork = () => {},
  onDeleteStudentWork = () => {},
  onBackToPortal,
  onLogout,
  onNavigateToWebsiteTab,
}) => {
  const [activeMenu, setActiveMenu] = useState<
    'overview' | 'profil' | 'jurusan' | 'guru' | 'administrasi' | 'siswa' | 'berita' | 'kehidupan' | 'ppdb' | 'galeri' | 'akademik' | 'laporan' | 'keamanan'
  >('overview');

  const menuItems = [
    { id: 'overview', label: 'Ringkasan Kinerja', icon: LayoutGrid, sub: 'Ikhtisar & Statistik' },
    { id: 'profil', label: 'Profil Sekolah', icon: School, sub: 'Visi, Misi & Legalitas' },
    { id: 'jurusan', label: 'Jurusan & Peminatan', icon: GraduationCap, sub: 'MIPA, IPS, Bahasa' },
    { id: 'guru', label: 'Profil Guru & Pegawai', icon: UserCheck, sub: 'Direktori Pendidik' },
    { id: 'administrasi', label: 'Administrasi Guru', icon: FolderCheck, sub: 'Perangkat Ajar & Presensi' },
    { id: 'siswa', label: 'Data Siswa & Alumni', icon: Users, sub: 'Input & Kelola Siswa' },
    { id: 'berita', label: 'Warta & Berita Sekolah', icon: Newspaper, sub: 'Pengumuman & Agenda' },
    { id: 'kehidupan', label: 'Kehidupan Siswa & Eskul', icon: Sparkles, sub: 'Upload Karya Siswa & Eskul' },
    { id: 'ppdb', label: 'PPDB Online', icon: UserPlus, sub: 'Verifikasi Calon Siswa' },
    { id: 'galeri', label: 'Galeri Kegiatan', icon: Image, sub: 'Dokumentasi Siswa' },
    { id: 'akademik', label: 'Kurikulum & Mapel', icon: BookOpen, sub: 'Kurikulum Merdeka' },
    { id: 'laporan', label: 'Statistik & Laporan', icon: FileDown, sub: 'Unduh PDF & Excel' },
    { id: 'keamanan', label: 'Notifikasi & Keamanan', icon: ShieldCheck, sub: 'Push & AES-256' },
  ];

  return (
    <div className="min-h-screen bg-[#0d1527] p-2 sm:p-4 lg:p-6 font-sans antialiased text-slate-800">
      {/* Outer Rounded Container with dark navy header curve */}
      <div className="max-w-[1600px] mx-auto bg-[#0a0f1d] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col lg:flex-row">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-full lg:w-72 bg-[#0a1124] text-slate-300 flex flex-col justify-between border-r border-slate-800/60 p-5 flex-shrink-0">
          <div>
            {/* Logo / Brand matching the screenshot */}
            <div className="flex items-center gap-3 pb-6 border-b border-slate-800/80">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-wider leading-tight">
                  DASBOR ADMINISTRATOR
                </h1>
                <p className="text-[11px] font-bold text-sky-400 tracking-widest uppercase">
                  SMAK SETIA BAKTI
                </p>
              </div>
            </div>

            {/* Navigation Menu Items */}
            <nav className="mt-5 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/40 translate-x-1'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <div className="truncate">
                      <span className="block leading-tight">{item.label}</span>
                      <span className={`text-[10px] font-normal block ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                        {item.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Card: Education Quote with Trophy + Back to website button */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
            <div className="bg-gradient-to-b from-[#131c38] to-[#0d1429] p-3.5 rounded-2xl border border-blue-900/40 text-center relative overflow-hidden shadow-inner">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-md shadow-amber-500/20 border border-amber-400/30">
                <Trophy className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-200 font-serif italic leading-relaxed">
                “ Pendidikan adalah kunci keberhasilan. Teruslah belajar dan bertumbuh dalam iman! ”
              </p>
              <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400">
                <span>SMAK Setia Bakti</span>
                <span className="text-sky-400 font-mono font-bold">Ruteng</span>
              </div>
            </div>

            {(onLogout || onBackToPortal) && (
              <button
                onClick={() => (onLogout ? onLogout() : onBackToPortal?.())}
                className="w-full py-2.5 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-200 hover:text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-red-800/40 shadow-sm"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Keluar dari Dasbor</span>
              </button>
            )}
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 bg-[#f4f7fc] p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-[700px]">
          {/* TAB 1: OVERVIEW */}
          {activeMenu === 'overview' && (
            <AdminOverviewTab
              students={students}
              teachers={teachers}
              newsList={newsList}
              eventsList={eventsList}
              galleryList={galleryList}
              ppdbList={ppdbList}
              onNavigateToTab={(id) => setActiveMenu(id as any)}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB: PROFIL SEKOLAH */}
          {activeMenu === 'profil' && (
            <AdminProfileTab
              profile={schoolProfile}
              onUpdateProfile={onUpdateSchoolProfile}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB: JURUSAN & PEMINATAN */}
          {activeMenu === 'jurusan' && (
            <AdminMajorsTab
              majors={majors}
              onAddMajor={onAddMajor}
              onDeleteMajor={onDeleteMajor}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB: KEHIDUPAN SISWA & ESKUL (UPLOAD KARYA SISWA) */}
          {activeMenu === 'kehidupan' && (
            <AdminCampusLifeTab
              extracurriculars={extracurriculars}
              studentWorks={studentWorks}
              onAddExtracurricular={onAddExtracurricular}
              onDeleteExtracurricular={onDeleteExtracurricular}
              onAddStudentWork={onAddStudentWork}
              onDeleteStudentWork={onDeleteStudentWork}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 2: BERITA & AGENDA SEKOLAH */}
          {activeMenu === 'berita' && (
            <AdminNewsEventsTab
              newsList={newsList}
              eventsList={eventsList}
              onAddNews={onAddNews}
              onDeleteNews={onDeleteNews}
              onAddEvent={onAddEvent}
              onDeleteEvent={onDeleteEvent}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 3: DATA SISWA & ALUMNI */}
          {activeMenu === 'siswa' && (
            <AdminStudentsTab
              session={session}
              students={students}
              onAddStudent={onAddStudent}
              onDeleteStudent={onDeleteStudent}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 4: PPDB ONLINE */}
          {activeMenu === 'ppdb' && (
            <AdminPPDBTab
              ppdbList={ppdbList}
              onAddPPDB={onAddPPDB}
              onUpdatePPDBStatus={onUpdatePPDBStatus}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 5: PROFIL GURU & PEGAWAI */}
          {activeMenu === 'guru' && (
            <AdminTeachersTab
              teachers={teachers}
              onAddTeacher={onAddTeacher}
              onDeleteTeacher={onDeleteTeacher}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB: ADMINISTRASI GURU (VERIFIKASI PERANGKAT AJAR & MONITORING PRESENSI) */}
          {activeMenu === 'administrasi' && (
            <AdminTeacherAdminTab
              session={session}
              teacherAdminDocs={teacherAdminDocs}
              subjectAttendanceSessions={subjectAttendanceSessions}
              onUpdateTeacherAdminDoc={
                onUpdateTeacherAdminDoc ||
                ((id, status, notes, score, verifier) => {
                  onVerifyTeacherAdminDoc?.(id, status, score, notes, verifier);
                })
              }
              onDeleteTeacherAdminDoc={onDeleteTeacherAdminDoc}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 6: GALERI KEGIATAN SISWA */}
          {activeMenu === 'galeri' && (
            <AdminGalleryTab
              galleryList={galleryList}
              onAddGallery={onAddGallery}
              onDeleteGallery={onDeleteGallery}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 7: KURIKULUM & AKADEMIK */}
          {activeMenu === 'akademik' && (
            <AdminAcademicTab onNavigateToWebsiteTab={onNavigateToWebsiteTab} />
          )}

          {/* TAB 8: STATISTIK & LAPORAN */}
          {activeMenu === 'laporan' && (
            <AdminReportsTab
              students={students}
              teachers={teachers}
              ppdbList={ppdbList}
            />
          )}

          {/* TAB 9: NOTIFIKASI & KEAMANAN */}
          {activeMenu === 'keamanan' && (
            <AdminSecurityNotifTab
              session={session}
              notifications={notifications}
              onSendPushNotification={onSendPushNotification}
            />
          )}
        </main>
      </div>
    </div>
  );
};
