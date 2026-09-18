import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { QuickActionRibbon } from './components/QuickActionRibbon';
import { UpcomingEvents } from './components/UpcomingEvents';
import { DistrictNews } from './components/DistrictNews';
import { StatsDashboard } from './components/StatsDashboard';
import { TeacherStaffSection } from './components/TeacherStaffSection';
import { StudentGallery } from './components/StudentGallery';
import { PPDBOnline } from './components/PPDBOnline';
import { LoginModal } from './components/LoginModal';
import { DashboardView } from './components/DashboardView';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { Footer } from './components/Footer';

import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_PPDB,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import { Student, TeacherStaff, PPDBRegistration, PushNotification, UserSession } from './types';
import { BookOpen, Award, GraduationCap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('smak_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Students state with localStorage sync
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('smak_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Teachers state
  const [teachers] = useState<TeacherStaff[]>(INITIAL_TEACHERS);

  // PPDB Registrations state
  const [ppdbList, setPpdbList] = useState<PPDBRegistration[]>(() => {
    const saved = localStorage.getItem('smak_ppdb');
    return saved ? JSON.parse(saved) : INITIAL_PPDB;
  });

  // Notifications state
  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const saved = localStorage.getItem('smak_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('smak_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('smak_ppdb', JSON.stringify(ppdbList));
  }, [ppdbList]);

  useEffect(() => {
    localStorage.setItem('smak_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('smak_user_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('smak_user_session');
    }
  }, [session]);

  // Handler: Add student
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };

  // Handler: Delete student
  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini dari sistem?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Handler: Add PPDB
  const handleAddPPDB = (newReg: PPDBRegistration) => {
    setPpdbList((prev) => [newReg, ...prev]);
  };

  // Handler: Update PPDB status
  const handleUpdatePPDBStatus = (id: string, status: PPDBRegistration['status'], notes?: string) => {
    setPpdbList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, notes: notes || item.notes } : item))
    );
  };

  // Handler: Send Push Notification
  const handleSendPushNotification = (
    title: string,
    message: string,
    target: 'all' | 'guru' | 'orangtua' | 'siswa',
    priority: 'urgent' | 'info' | 'akademik'
  ) => {
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      target,
      priority,
      timestamp: 'Baru Saja',
      isRead: false,
      link: '/ppdb',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handler: Mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* 1. School Header with Crest and Notification Bell */}
      <Header
        session={session}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => {
          setSession(null);
          setActiveTab('beranda');
        }}
        onOpenNotifications={() => {
          if (session) {
            setActiveTab('dashboard');
          } else {
            setActiveTab('berita');
          }
        }}
        onOpenEncryptionModal={() => {
          if (session) {
            setActiveTab('dashboard');
          } else {
            alert('Sistem Enkripsi AES-256 Aktif: Seluruh identitas NIK, NISN, dan kontak siswa terlindungi.');
          }
        }}
        notifications={notifications}
        onSearch={() => setActiveTab('statistik')}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* 2. Responsive Purple Primary Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'portal') {
            if (session) {
              setActiveTab('dashboard');
            } else {
              setIsLoginModalOpen(true);
            }
          } else {
            setActiveTab(tab);
          }
        }}
        session={session}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* 3. Main Dynamic Content Switcher */}
      <main className="flex-1 w-full">
        {/* PAGE 1: BERANDA (HOME) */}
        {activeTab === 'beranda' && (
          <div className="space-y-0">
            {/* Hero Slider with Quick Facts Badge */}
            <HeroSlider onNavigateTab={(tab) => setActiveTab(tab)} />

            {/* Quick Action Ribbon (PPDB Daring, Info Akademik, Data Siswa, Profil Guru, Galeri) */}
            <QuickActionRibbon onNavigateTab={(tab) => setActiveTab(tab)} />

            {/* Two-Column Showcase: Upcoming Events & District News */}
            <UpcomingEvents onNavigateTab={(tab) => setActiveTab(tab)} />
            <DistrictNews onNavigateTab={(tab) => setActiveTab(tab)} />

            {/* Interactive Statistics Dashboard Preview (Active vs Alumni Split!) */}
            <StatsDashboard students={students} />

            {/* Teachers & Staff Directory Preview */}
            <TeacherStaffSection teachers={teachers} />

            {/* Student Gallery Preview */}
            <StudentGallery />
          </div>
        )}

        {/* PAGE 2: AKADEMIK (INFORMASI KURIKULUM & PRESTASI) */}
        {activeTab === 'akademik' && (
          <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-3 py-1 rounded-full">
                Keunggulan Pendidikan Katolik
              </span>
              <h2 className="text-3xl font-bold text-[#321759] font-serif mt-2">
                Informasi Akademik & Kurikulum Merdeka
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Mengintegrasikan kecerdasan intelektual, keterampilan abad ke-21, penguasaan sains dan teknologi,
                serta penanaman karakter Kristiani yang berakar kuat pada kearifan budaya Manggarai.
              </p>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#432874] flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">MIPA (Matematika & Sains)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fasilitas laboratorium Fisika, Kimia, dan Biologi berstandar lengkap. Fokus pada eksperimen ilmiah,
                  bimbingan intensif Olimpiade Sains Nasional (OSN), dan persiapan masuk fakultas kedokteran & teknik terkemuka.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">IPS (Ilmu Pengetahuan Sosial)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Menelaah dinamika sosiologis, ekonomi moneter, kewirausahaan, serta sejarah dan hukum. Mempersiapkan lulusan
                  menjadi pemimpin publik, diplomat, advokat, ekonom, dan aparatur sipil negara handal.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Bahasa & Budaya</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Laboratorium multimedia bahasa modern. Penekanan pada penguasaan Bahasa Inggris aktif, Bahasa Jerman,
                  serta pemajuan sastra nusantara dan pelestarian seni budaya tarian Manggarai.
                </p>
              </div>
            </div>

            {/* Interactive Stats embedded */}
            <StatsDashboard students={students} />
          </div>
        )}

        {/* PAGE 3: PPDB DARING (ONLINE REGISTRATION & STATUS) */}
        {activeTab === 'ppdb' && (
          <PPDBOnline ppdbList={ppdbList} onAddRegistration={handleAddPPDB} />
        )}

        {/* PAGE 4: STATISTIK LENGKAP SISWA & ALUMNI */}
        {activeTab === 'statistik' && (
          <div className="py-6">
            <StatsDashboard students={students} />
          </div>
        )}

        {/* PAGE 5: PROFIL GURU & PEGAWAI */}
        {activeTab === 'guru' && (
          <TeacherStaffSection teachers={teachers} />
        )}

        {/* PAGE 6: GALERI KEGIATAN SISWA */}
        {activeTab === 'galeri' && (
          <StudentGallery />
        )}

        {/* PAGE 7: BERITA & PENGUMUMAN */}
        {activeTab === 'berita' && (
          <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 animate-fadeIn">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-1 rounded-full inline-block mb-1">
                Warta Sekolah
              </span>
              <h2 className="text-3xl font-bold text-[#321759] font-serif">
                Berita, Agenda & Pengumuman Resmi
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <DistrictNews onNavigateTab={(tab) => setActiveTab(tab)} />
              </div>
              <div>
                <UpcomingEvents onNavigateTab={(tab) => setActiveTab(tab)} />
              </div>
            </div>
          </div>
        )}

        {/* PAGE 8: AUTHENTICATED DASHBOARD (ADMIN / GURU / ORANG TUA) */}
        {activeTab === 'dashboard' && session && (
          <DashboardView
            session={session}
            students={students}
            ppdbList={ppdbList}
            notifications={notifications}
            onAddStudent={handleAddStudent}
            onDeleteStudent={handleDeleteStudent}
            onUpdatePPDBStatus={handleUpdatePPDBStatus}
            onSendPushNotification={handleSendPushNotification}
            onBackToPortal={() => setActiveTab('beranda')}
          />
        )}
      </main>

      {/* 4. Real-Time Push Notification Toast Alert */}
      <PushNotificationBanner
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onNavigateToPPDB={() => setActiveTab('ppdb')}
      />

      {/* 5. Login Modal for Admin, Guru, Orang Tua */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          setActiveTab('dashboard');
        }}
      />

      {/* 6. Comprehensive School Footer */}
      <Footer
        onNavigate={(tab) => setActiveTab(tab)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}
