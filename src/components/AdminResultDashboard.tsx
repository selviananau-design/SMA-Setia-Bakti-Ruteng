import React, { useState } from 'react';
import {
  LayoutGrid,
  LayoutTemplate,
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
  Settings,
  Palette,
  Edit3,
  Cross,
  Award,
  FolderCheck,
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
  AdminSidebarConfig,
  HomepageConfig,
} from '../types';
import {
  INITIAL_SCHOOL_PROFILE,
  INITIAL_MAJORS,
  INITIAL_EXTRACURRICULARS,
  INITIAL_STUDENT_WORKS,
  INITIAL_TEACHER_ADMIN_DOCS,
  INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
  DEFAULT_HOMEPAGE_CONFIG,
} from '../data/mockData';

import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminNewsEventsTab } from './admin/AdminNewsEventsTab';
import { AdminStudentsTab } from './admin/AdminStudentsTab';
import { AdminAlumniTab } from './admin/AdminAlumniTab';
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
import {
  AdminSidebarCustomizerTab,
  DEFAULT_SIDEBAR_CONFIG,
} from './admin/AdminSidebarCustomizerTab';
import { AdminHomepageCustomizerTab } from './admin/AdminHomepageCustomizerTab';

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
  onUpdateStudent?: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onAddTeacher: (teacher: TeacherStaff) => void;
  onUpdateTeacher?: (teacher: TeacherStaff) => void;
  onDeleteTeacher: (id: string) => void;
  onAddNews: (news: NewsItem) => void;
  onUpdateNews?: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onAddEvent: (event: SchoolEvent) => void;
  onUpdateEvent?: (event: SchoolEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddGallery: (item: GalleryItem) => void;
  onUpdateGallery?: (item: GalleryItem) => void;
  onDeleteGallery: (id: string) => void;
  onAddPPDB: (reg: PPDBRegistration) => void;
  onUpdatePPDB?: (reg: PPDBRegistration) => void;
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
  onUpdateMajor?: (major: MajorProgram) => void;
  onDeleteMajor?: (id: string) => void;
  onAddExtracurricular?: (eskul: Extracurricular) => void;
  onUpdateExtracurricular?: (eskul: Extracurricular) => void;
  onDeleteExtracurricular?: (id: string) => void;
  onAddStudentWork?: (work: StudentWork) => void;
  onUpdateStudentWork?: (work: StudentWork) => void;
  onDeleteStudentWork?: (id: string) => void;
  homepageConfig?: HomepageConfig;
  onUpdateHomepageConfig?: (updated: HomepageConfig) => void;
  onResetHomepageConfig?: () => void;
  initialActiveMenu?: string;
  onBackToPortal?: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
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
  homepageConfig,
  onUpdateHomepageConfig,
  onResetHomepageConfig,
  initialActiveMenu,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onAddNews,
  onUpdateNews,
  onDeleteNews,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddGallery,
  onUpdateGallery,
  onDeleteGallery,
  onAddPPDB,
  onUpdatePPDB,
  onUpdatePPDBStatus,
  onSendPushNotification,
  onUpdateTeacherAdminDoc,
  onVerifyTeacherAdminDoc,
  onDeleteTeacherAdminDoc = () => {},
  onUpdateSchoolProfile = () => {},
  onAddMajor = () => {},
  onUpdateMajor = () => {},
  onDeleteMajor = () => {},
  onAddExtracurricular = () => {},
  onUpdateExtracurricular = () => {},
  onDeleteExtracurricular = () => {},
  onAddStudentWork = () => {},
  onUpdateStudentWork = () => {},
  onDeleteStudentWork = () => {},
  onBackToPortal,
  onLogout,
  onOpenProfile,
  onNavigateToWebsiteTab,
}) => {
  const [activeMenu, setActiveMenu] = useState<
    | 'overview'
    | 'homepage'
    | 'profil'
    | 'jurusan'
    | 'guru'
    | 'administrasi'
    | 'siswa'
    | 'alumni'
    | 'berita'
    | 'kehidupan'
    | 'ppdb'
    | 'galeri'
    | 'akademik'
    | 'laporan'
    | 'keamanan'
    | 'sidebar'
  >((initialActiveMenu as any) || 'overview');

  const [currentHomepageConfig, setCurrentHomepageConfig] = useState<HomepageConfig>(() => {
    if (homepageConfig) return homepageConfig;
    try {
      const saved = localStorage.getItem('smak_homepage_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_HOMEPAGE_CONFIG;
  });

  const [sidebarConfig, setSidebarConfig] = useState<AdminSidebarConfig>(() => {
    try {
      const saved = localStorage.getItem('smak_sidebar_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SIDEBAR_CONFIG;
  });

  const menuItems = [
    { id: 'overview', label: 'Ringkasan Kinerja', icon: LayoutGrid, sub: 'Ikhtisar & Statistik' },
    { id: 'homepage', label: 'Kustomisasi Halaman Utama', icon: LayoutTemplate, sub: 'Ganti Gambar & Tulisan Beranda' },
    { id: 'profil', label: 'Profil Sekolah', icon: School, sub: 'Visi, Misi & Legalitas' },
    { id: 'jurusan', label: 'Jurusan & Peminatan', icon: GraduationCap, sub: 'MIPA, IPS, Bahasa' },
    { id: 'guru', label: 'Profil Guru & Pegawai', icon: UserCheck, sub: 'Direktori Pendidik' },
    { id: 'administrasi', label: 'Administrasi Guru', icon: FolderCheck, sub: 'Perangkat Ajar & Presensi' },
    { id: 'siswa', label: 'Data Siswa Aktif', icon: Users, sub: 'Kelas X, XI, XII & Rombel' },
    { id: 'alumni', label: 'Data Alumni', icon: Award, sub: 'Tracer Study & Karir' },
    { id: 'berita', label: 'Warta & Berita Sekolah', icon: Newspaper, sub: 'Pengumuman & Agenda' },
    { id: 'kehidupan', label: 'Kehidupan Siswa & Eskul', icon: Sparkles, sub: 'Upload Karya Siswa & Eskul' },
    { id: 'ppdb', label: 'PPDB Online', icon: UserPlus, sub: 'Verifikasi Calon Siswa' },
    { id: 'galeri', label: 'Galeri Kegiatan', icon: Image, sub: 'Dokumentasi Siswa' },
    { id: 'akademik', label: 'Kurikulum & Mapel', icon: BookOpen, sub: 'Kurikulum Merdeka' },
    { id: 'laporan', label: 'Statistik & Laporan', icon: FileDown, sub: 'Unduh PDF & Excel' },
    { id: 'keamanan', label: 'Notifikasi & Keamanan', icon: ShieldCheck, sub: 'Push & AES-256' },
    { id: 'sidebar', label: 'Kustomisasi Sidebar', icon: Palette, sub: 'Ganti Foto & Tulisan' },
  ];

  // Helper untuk warna aksen sidebar
  const getSidebarAccentGradient = () => {
    switch (sidebarConfig.themeAccent) {
      case 'purple':
        return 'from-purple-600 to-fuchsia-600';
      case 'blue':
        return 'from-sky-500 to-blue-600';
      case 'emerald':
        return 'from-emerald-500 to-teal-600';
      case 'amber':
        return 'from-amber-500 to-orange-600';
      case 'indigo':
      default:
        return 'from-blue-600 to-indigo-500';
    }
  };

  const getLogoShapeRadius = () => {
    switch (sidebarConfig.logoShape) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-lg';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1527] p-2 sm:p-4 lg:p-6 font-sans antialiased text-slate-800">
      {/* Outer Rounded Container with dark navy header curve */}
      <div className="max-w-[1600px] mx-auto bg-[#0a0f1d] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col lg:flex-row">
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-full lg:w-72 bg-[#0a1124] text-slate-300 flex flex-col justify-between border-r border-slate-800/60 p-5 flex-shrink-0">
          <div>
            {/* Logo / Brand with edit shortcut */}
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800/80 group">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 ${getLogoShapeRadius()} bg-gradient-to-tr ${getSidebarAccentGradient()} flex items-center justify-center text-white shadow-lg overflow-hidden flex-shrink-0 border border-white/10`}
                >
                  {sidebarConfig.logoType === 'image' && sidebarConfig.logoUrl ? (
                    <img
                      src={sidebarConfig.logoUrl}
                      alt="Logo Sidebar"
                      className="w-full h-full object-cover"
                    />
                  ) : sidebarConfig.presetIcon === 'cross' ? (
                    <Cross className="w-5 h-5" />
                  ) : sidebarConfig.presetIcon === 'book' ? (
                    <BookOpen className="w-5 h-5" />
                  ) : sidebarConfig.presetIcon === 'shield' ? (
                    <ShieldCheck className="w-5 h-5" />
                  ) : sidebarConfig.presetIcon === 'award' ? (
                    <Award className="w-5 h-5" />
                  ) : (
                    <GraduationCap className="w-6 h-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xs font-black text-white tracking-wider leading-tight truncate uppercase">
                    {sidebarConfig.title || 'DASBOR ADMINISTRATOR'}
                  </h1>
                  <p className="text-[11px] font-bold text-sky-400 tracking-widest uppercase truncate">
                    {sidebarConfig.subtitle || 'SMAK SETIA BAKTI'}
                  </p>
                  {sidebarConfig.tagline && (
                    <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                      {sidebarConfig.tagline}
                    </p>
                  )}
                </div>
              </div>

              {/* Quick shortcut to customize sidebar */}
              <button
                type="button"
                onClick={() => setActiveMenu('sidebar')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
                title="Kustomisasi Foto, Logo & Tulisan Sidebar"
              >
                <Palette className="w-4 h-4 text-sky-400" />
              </button>
            </div>

            {/* Profile Quick Widget */}
            <div className="mt-3 p-2.5 rounded-2xl bg-[#131c38] border border-slate-700/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                  AD
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">
                    {sidebarConfig.adminRoleLabel || 'Admin Utama'}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {sidebarConfig.statusBadgeText || 'MySQL Aktif'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveMenu('sidebar')}
                  className="p-1 text-slate-400 hover:text-sky-400 hover:bg-slate-800 rounded-md cursor-pointer transition-colors"
                  title="Ganti Foto & Tulisan Sidebar"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                {onOpenProfile && (
                  <button
                    type="button"
                    onClick={onOpenProfile}
                    className="px-2 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                    title="Buka Pengaturan Profil Admin"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Profil</span>
                  </button>
                )}
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

          {/* TAB: KUSTOMISASI HALAMAN UTAMA WEBSITE (GANTI GAMBAR & TULISAN BERANDA) */}
          {activeMenu === 'homepage' && (
            <AdminHomepageCustomizerTab
              config={currentHomepageConfig}
              onSaveConfig={(newCfg) => {
                setCurrentHomepageConfig(newCfg);
                onUpdateHomepageConfig?.(newCfg);
              }}
              onResetDefault={() => {
                setCurrentHomepageConfig(DEFAULT_HOMEPAGE_CONFIG);
                onResetHomepageConfig?.();
              }}
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
              onUpdateMajor={onUpdateMajor}
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
              onUpdateExtracurricular={onUpdateExtracurricular}
              onDeleteExtracurricular={onDeleteExtracurricular}
              onAddStudentWork={onAddStudentWork}
              onUpdateStudentWork={onUpdateStudentWork}
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
              onUpdateNews={onUpdateNews}
              onDeleteNews={onDeleteNews}
              onAddEvent={onAddEvent}
              onUpdateEvent={onUpdateEvent}
              onDeleteEvent={onDeleteEvent}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 3: DATA SISWA AKTIF */}
          {activeMenu === 'siswa' && (
            <AdminStudentsTab
              session={session}
              students={students}
              onAddStudent={onAddStudent}
              onUpdateStudent={onUpdateStudent}
              onDeleteStudent={onDeleteStudent}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
              onNavigateToAlumni={() => setActiveMenu('alumni')}
            />
          )}

          {/* TAB: DATA ALUMNI & TRACER STUDY */}
          {activeMenu === 'alumni' && (
            <AdminAlumniTab
              session={session}
              students={students}
              onAddAlumni={onAddStudent}
              onUpdateAlumni={(updatedAlumni) => {
                onDeleteStudent(updatedAlumni.id);
                onAddStudent(updatedAlumni);
              }}
              onDeleteAlumni={onDeleteStudent}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 4: PPDB ONLINE */}
          {activeMenu === 'ppdb' && (
            <AdminPPDBTab
              ppdbList={ppdbList}
              onAddPPDB={onAddPPDB}
              onUpdatePPDB={onUpdatePPDB}
              onUpdatePPDBStatus={onUpdatePPDBStatus}
              onNavigateToWebsiteTab={onNavigateToWebsiteTab}
            />
          )}

          {/* TAB 5: PROFIL GURU & PEGAWAI */}
          {activeMenu === 'guru' && (
            <AdminTeachersTab
              teachers={teachers}
              onAddTeacher={onAddTeacher}
              onUpdateTeacher={onUpdateTeacher}
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
              onUpdateGallery={onUpdateGallery}
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

          {/* TAB 10: KUSTOMISASI SIDEBAR (FOTO & TULISAN) */}
          {activeMenu === 'sidebar' && (
            <AdminSidebarCustomizerTab
              config={sidebarConfig}
              onSaveConfig={(newCfg) => setSidebarConfig(newCfg)}
            />
          )}
        </main>
      </div>
    </div>
  );
};
