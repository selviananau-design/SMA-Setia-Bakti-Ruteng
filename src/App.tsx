import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { AcademicProgramsSection } from './components/AcademicProgramsSection';
import { CampusLifeSection } from './components/CampusLifeSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { HomepageWelcomeSection } from './components/HomepageWelcomeSection';
import { StudentVoiceAndNewsSection } from './components/StudentVoiceAndNewsSection';
import { QuickActionRibbon } from './components/QuickActionRibbon';
import { UpcomingEvents } from './components/UpcomingEvents';
import { DistrictNews } from './components/DistrictNews';
import { StatsDashboard } from './components/StatsDashboard';
import { PPDBOnline } from './components/PPDBOnline';
import { TeacherStaffSection } from './components/TeacherStaffSection';
import { StudentGallery } from './components/StudentGallery';
import { SchoolProfileSection } from './components/SchoolProfileSection';
import { AcademicProgramsFullPage } from './components/AcademicProgramsFullPage';
import { LoginModal } from './components/LoginModal';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { DashboardView } from './components/DashboardView';
import { ProfileSettingsModal } from './components/common/ProfileSettingsModal';
import { dbService } from './services/dbSync';
import { Footer } from './components/Footer';
import { DEFAULT_SIDEBAR_CONFIG } from './components/admin/AdminSidebarCustomizerTab';

import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_PPDB,
  INITIAL_NOTIFICATIONS,
  INITIAL_NEWS,
  INITIAL_EVENTS,
  INITIAL_GALLERY,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_WALI_NOTES,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_DISCUSSIONS,
  INITIAL_EXTRACURRICULARS,
  INITIAL_STUDENT_WORKS,
  INITIAL_MAJORS,
  INITIAL_SCHOOL_PROFILE,
  INITIAL_TEACHER_ADMIN_DOCS,
  INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
  DEFAULT_HOMEPAGE_CONFIG,
} from './data/mockData';
import {
  Student,
  TeacherStaff,
  PPDBRegistration,
  PushNotification,
  UserSession,
  NewsItem,
  SchoolEvent,
  GalleryItem,
  StudyMaterial,
  Assignment,
  AssignmentSubmission,
  WaliKelasNote,
  LeaveRequest,
  SubjectDiscussion,
  DiscussionReply,
  Extracurricular,
  StudentWork,
  MajorProgram,
  SchoolProfile,
  TeacherAdminDocument,
  SubjectAttendanceSession,
  HomepageConfig,
  AdminSidebarConfig,
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  const handleNavigateTab = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    setActiveSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  // Session - tetap di localStorage karena ini state per-perangkat
  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('smak_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ==========================================================
  // STATE DATA - Nilai awal dari mockData, akan diisi dari database
  // ==========================================================
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [teachers, setTeachers] = useState<TeacherStaff[]>(INITIAL_TEACHERS);
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS);
  const [eventsList, setEventsList] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [ppdbList, setPpdbList] = useState<PPDBRegistration[]>(INITIAL_PPDB);
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(INITIAL_SUBMISSIONS);
  const [waliNotes, setWaliNotes] = useState<WaliKelasNote[]>(INITIAL_WALI_NOTES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);
  const [discussions, setDiscussions] = useState<SubjectDiscussion[]>(INITIAL_DISCUSSIONS);
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(INITIAL_EXTRACURRICULARS);
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>(INITIAL_STUDENT_WORKS);
  const [majors, setMajors] = useState<MajorProgram[]>(INITIAL_MAJORS);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(INITIAL_SCHOOL_PROFILE);
  const [teacherAdminDocs, setTeacherAdminDocs] = useState<TeacherAdminDocument[]>(INITIAL_TEACHER_ADMIN_DOCS);
  const [subjectAttendanceSessions, setSubjectAttendanceSessions] = useState<SubjectAttendanceSession[]>(INITIAL_SUBJECT_ATTENDANCE_SESSIONS);
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(DEFAULT_HOMEPAGE_CONFIG);
  const [sidebarConfig, setSidebarConfig] = useState<AdminSidebarConfig>(DEFAULT_SIDEBAR_CONFIG);

  const [adminInitialMenu, setAdminInitialMenu] = useState<string>('overview');

  // ==========================================================
  // LOAD DATA DARI DATABASE saat aplikasi pertama kali dimuat
  // ==========================================================
  useEffect(() => {
    let mounted = true;

    const loadDataFromDatabase = async () => {
      try {
        const serverData = await dbService.loadAllData();
        if (!mounted) return;

        if (serverData && Object.keys(serverData).length > 0) {
          if (serverData.students?.length) setStudents(serverData.students);
          if (serverData.teachers?.length) setTeachers(serverData.teachers);
          if (serverData.news?.length) setNewsList(serverData.news);
          if (serverData.events?.length) setEventsList(serverData.events);
          if (serverData.gallery?.length) setGalleryList(serverData.gallery);
          if (serverData.ppdb?.length) setPpdbList(serverData.ppdb);
          if (serverData.notifications?.length) setNotifications(serverData.notifications);
          if (serverData.studyMaterials?.length) setStudyMaterials(serverData.studyMaterials);
          if (serverData.assignments?.length) setAssignments(serverData.assignments);
          if (serverData.submissions?.length) setSubmissions(serverData.submissions);
          if (serverData.waliNotes?.length) setWaliNotes(serverData.waliNotes);
          if (serverData.leaveRequests?.length) setLeaveRequests(serverData.leaveRequests);
          if (serverData.discussions?.length) setDiscussions(serverData.discussions);
          if (serverData.extracurriculars?.length) setExtracurriculars(serverData.extracurriculars);
          if (serverData.studentWorks?.length) setStudentWorks(serverData.studentWorks);
          if (serverData.majors?.length) setMajors(serverData.majors);
          if (serverData.schoolProfile) setSchoolProfile(serverData.schoolProfile);
          if (serverData.teacherAdminDocs?.length) setTeacherAdminDocs(serverData.teacherAdminDocs);
          if (serverData.subjectAttendance?.length) setSubjectAttendanceSessions(serverData.subjectAttendance);
          if (serverData.homepageConfig) setHomepageConfig(serverData.homepageConfig);
          if (serverData.sidebarConfig) setSidebarConfig(serverData.sidebarConfig);
        }
      } catch (err) {
        console.warn('[App] Gagal memuat data dari database:', err);
      } finally {
        if (mounted) setIsDataLoaded(true);
      }
    };

    loadDataFromDatabase();
    return () => {
      mounted = false;
    };
  }, []);

  // Sesi login tetap disimpan di localStorage
  useEffect(() => {
    try {
      if (session) {
        localStorage.setItem('smak_user_session', JSON.stringify(session));
      } else {
        localStorage.removeItem('smak_user_session');
      }
    } catch (e) {
      console.warn('[App] Gagal menyimpan sesi:', e);
    }
  }, [session]);

  // ==========================================================
  // HANDLERS: Data akan disinkronkan ke DB langsung di dalam handler
  // ==========================================================

  const handleUploadTeacherAdminDoc = (doc: TeacherAdminDocument) => {
    setTeacherAdminDocs((prev) => {
      const updated = [doc, ...prev];
      dbService.syncEntity('teacherAdminDocs', updated);
      return updated;
    });
  };

  const handleVerifyTeacherAdminDoc = (
    id: string,
    status: TeacherAdminDocument['status'],
    score?: number,
    notes?: string,
    verifierName?: string
  ) => {
    setTeacherAdminDocs((prev) => {
      const updated = prev.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              status,
              supervisionScore: score !== undefined ? score : doc.supervisionScore,
              feedbackNotes: notes !== undefined ? notes : doc.feedbackNotes,
              verifiedBy: verifierName || doc.verifiedBy,
              verifiedAt: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }),
            }
          : doc
      );
      dbService.syncEntity('teacherAdminDocs', updated);
      return updated;
    });
  };

  const handleSaveSubjectAttendanceSession = (sessionData: SubjectAttendanceSession) => {
    setSubjectAttendanceSessions((prev) => {
      const updated = [sessionData, ...prev];
      dbService.syncEntity('subjectAttendance', updated);
      return updated;
    });
  };

  // Handlers: Student
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => {
      const updated = [newStudent, ...prev];
      dbService.syncEntity('students', updated);
      return updated;
    });
  };
  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => {
      const updated = prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      dbService.syncEntity('students', updated);
      return updated;
    });
  };
  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini dari sistem?')) {
      setStudents((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        dbService.syncEntity('students', updated);
        return updated;
      });
    }
  };

  // Handlers: Teacher
  const handleAddTeacher = (newTeacher: TeacherStaff) => {
    setTeachers((prev) => {
      const updated = [newTeacher, ...prev];
      dbService.syncEntity('teachers', updated);
      return updated;
    });
  };
  const handleUpdateTeacher = (updatedTeacher: TeacherStaff) => {
    setTeachers((prev) => {
      const updated = prev.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t));
      dbService.syncEntity('teachers', updated);
      return updated;
    });
  };
  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      dbService.syncEntity('teachers', updated);
      return updated;
    });
  };

  // Handlers: News
  const handleAddNews = (newNews: NewsItem) => {
    setNewsList((prev) => {
      const updated = [newNews, ...prev];
      dbService.syncEntity('news', updated);
      return updated;
    });
  };
  const handleUpdateNews = (updatedNews: NewsItem) => {
    setNewsList((prev) => {
      const updated = prev.map((n) => (n.id === updatedNews.id ? updatedNews : n));
      dbService.syncEntity('news', updated);
      return updated;
    });
  };
  const handleDeleteNews = (id: string) => {
    setNewsList((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      dbService.syncEntity('news', updated);
      return updated;
    });
  };

  // Handlers: Events
  const handleAddEvent = (newEvent: SchoolEvent) => {
    setEventsList((prev) => {
      const updated = [newEvent, ...prev];
      dbService.syncEntity('events', updated);
      return updated;
    });
  };
  const handleUpdateEvent = (updatedEvent: SchoolEvent) => {
    setEventsList((prev) => {
      const updated = prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
      dbService.syncEntity('events', updated);
      return updated;
    });
  };
  const handleDeleteEvent = (id: string) => {
    setEventsList((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      dbService.syncEntity('events', updated);
      return updated;
    });
  };

  // Handlers: Gallery
  const handleAddGallery = (newItem: GalleryItem) => {
    setGalleryList((prev) => {
      const updated = [newItem, ...prev];
      dbService.syncEntity('gallery', updated);
      return updated;
    });
  };
  const handleUpdateGallery = (updatedGallery: GalleryItem) => {
    setGalleryList((prev) => {
      const updated = prev.map((g) => (g.id === updatedGallery.id ? updatedGallery : g));
      dbService.syncEntity('gallery', updated);
      return updated;
    });
  };
  const handleDeleteGallery = (id: string) => {
    setGalleryList((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      dbService.syncEntity('gallery', updated);
      return updated;
    });
  };

  // Handlers: PPDB
  const handleAddPPDB = (newReg: PPDBRegistration) => {
    setPpdbList((prev) => {
      const updated = [newReg, ...prev];
      dbService.syncEntity('ppdb', updated);
      return updated;
    });
  };
  const handleUpdatePPDB = (updatedPPDB: PPDBRegistration) => {
    setPpdbList((prev) => {
      const updated = prev.map((p) => (p.id === updatedPPDB.id ? updatedPPDB : p));
      dbService.syncEntity('ppdb', updated);
      return updated;
    });
  };
  const handleUpdatePPDBStatus = (id: string, status: PPDBRegistration['status'], notes?: string) => {
    setPpdbList((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, status, notes: notes || item.notes } : item
      );
      dbService.syncEntity('ppdb', updated);
      return updated;
    });
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
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      dbService.syncEntity('notifications', updated);
      return updated;
    });
  };

  // Handler: Mark notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      dbService.syncEntity('notifications', updated);
      return updated;
    });
  };

  // Handlers: Study Materials
  const handleAddStudyMaterial = (mat: StudyMaterial) => {
    setStudyMaterials((prev) => {
      const updated = [mat, ...prev];
      dbService.syncEntity('studyMaterials', updated);
      return updated;
    });
  };
  const handleDeleteStudyMaterial = (id: string) => {
    setStudyMaterials((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      dbService.syncEntity('studyMaterials', updated);
      return updated;
    });
  };

  // Handlers: Assignments
  const handleAddAssignment = (assignment: Assignment) => {
    setAssignments((prev) => {
      const updated = [assignment, ...prev];
      dbService.syncEntity('assignments', updated);
      return updated;
    });
  };
  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      dbService.syncEntity('assignments', updated);
      return updated;
    });
  };

  // Handlers: Submissions
  const handleAddSubmission = (submission: AssignmentSubmission) => {
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId)
      );
      const updated = [submission, ...filtered];
      dbService.syncEntity('submissions', updated);
      return updated;
    });
  };
  const handleGradeSubmission = (id: string, grade: number, feedback?: string) => {
    setSubmissions((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, grade, feedback, status: 'Dinilai' } : s));
      dbService.syncEntity('submissions', updated);
      return updated;
    });
  };

  // Handlers: Wali Kelas Notes
  const handleAddWaliNote = (note: WaliKelasNote) => {
    setWaliNotes((prev) => {
      const updated = [note, ...prev];
      dbService.syncEntity('waliNotes', updated);
      return updated;
    });
  };
  const handleDeleteWaliNote = (id: string) => {
    setWaliNotes((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      dbService.syncEntity('waliNotes', updated);
      return updated;
    });
  };

  // Handlers: Leave Requests
  const handleSubmitLeaveRequest = (req: LeaveRequest) => {
    setLeaveRequests((prev) => {
      const updated = [req, ...prev];
      dbService.syncEntity('leaveRequests', updated);
      return updated;
    });
  };
  const handleReviewLeaveRequest = (
    id: string,
    status: LeaveRequest['status'],
    notes?: string,
    reviewer?: string
  ) => {
    setLeaveRequests((prev) => {
      const updated = prev.map((r) =>
        r.id === id
          ? { ...r, status, reviewNotes: notes, reviewedBy: reviewer || 'Wali Kelas' }
          : r
      );
      dbService.syncEntity('leaveRequests', updated);
      return updated;
    });
  };

  // Handlers: Discussions
  const handleAddDiscussion = (disc: SubjectDiscussion) => {
    setDiscussions((prev) => {
      const updated = [disc, ...prev];
      dbService.syncEntity('discussions', updated);
      return updated;
    });
  };
  const handleAddDiscussionReply = (discussionId: string, reply: DiscussionReply) => {
    setDiscussions((prev) => {
      const updated = prev.map((d) =>
        d.id === discussionId ? { ...d, replies: [...d.replies, reply] } : d
      );
      dbService.syncEntity('discussions', updated);
      return updated;
    });
  };

  // Handlers: School Profile
  const handleUpdateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
    dbService.syncEntity('schoolProfile', profile);
  };

  // Handlers: Majors
  const handleAddMajor = (major: MajorProgram) => {
    setMajors((prev) => {
      const updated = [major, ...prev];
      dbService.syncEntity('majors', updated);
      return updated;
    });
  };
  const handleUpdateMajor = (updatedMajor: MajorProgram) => {
    setMajors((prev) => {
      const updated = prev.map((m) => (m.id === updatedMajor.id ? updatedMajor : m));
      dbService.syncEntity('majors', updated);
      return updated;
    });
  };
  const handleDeleteMajor = (id: string) => {
    setMajors((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      dbService.syncEntity('majors', updated);
      return updated;
    });
  };

  // Handlers: Extracurriculars
  const handleAddExtracurricular = (eskul: Extracurricular) => {
    setExtracurriculars((prev) => {
      const updated = [eskul, ...prev];
      dbService.syncEntity('extracurriculars', updated);
      return updated;
    });
  };
  const handleUpdateExtracurricular = (updatedEskul: Extracurricular) => {
    setExtracurriculars((prev) => {
      const updated = prev.map((e) => (e.id === updatedEskul.id ? updatedEskul : e));
      dbService.syncEntity('extracurriculars', updated);
      return updated;
    });
  };
  const handleDeleteExtracurricular = (id: string) => {
    setExtracurriculars((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      dbService.syncEntity('extracurriculars', updated);
      return updated;
    });
  };

  // Handlers: Student Works
  const handleAddStudentWork = (work: StudentWork) => {
    setStudentWorks((prev) => {
      const updated = [work, ...prev];
      dbService.syncEntity('studentWorks', updated);
      return updated;
    });
  };
  const handleUpdateStudentWork = (updatedWork: StudentWork) => {
    setStudentWorks((prev) => {
      const updated = prev.map((w) => (w.id === updatedWork.id ? updatedWork : w));
      dbService.syncEntity('studentWorks', updated);
      return updated;
    });
  };
  const handleDeleteStudentWork = (id: string) => {
    setStudentWorks((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      dbService.syncEntity('studentWorks', updated);
      return updated;
    });
  };

  // Handlers: Homepage Config
  const handleUpdateHomepageConfig = (updated: HomepageConfig) => {
    setHomepageConfig(updated);
    dbService.syncEntity('homepageConfig', updated);
  };

  const handleResetHomepageConfig = () => {
    setHomepageConfig(DEFAULT_HOMEPAGE_CONFIG);
    dbService.syncEntity('homepageConfig', DEFAULT_HOMEPAGE_CONFIG);
  };

  // Handlers: Sidebar Config
  const handleUpdateSidebarConfig = (updated: AdminSidebarConfig) => {
    setSidebarConfig(updated);
    dbService.syncEntity('sidebarConfig', updated);
  };

  const handleLogout = () => {
    setSession(null);
    try {
      localStorage.removeItem('smak_user_session');
    } catch (e) {
      console.warn(e);
    }
    handleNavigateTab('beranda');
  };

  const isDashboard = activeTab === 'dashboard' && !!session;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {!isDashboard && (
        <Header
          session={session}
          notifications={notifications}
          onNavigateTab={handleNavigateTab}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenNotifications={() => {
            if (session) {
              handleNavigateTab('dashboard');
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          activeTab={activeTab}
        />
      )}

      {!isDashboard && (
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab, subTab) => {
            if (tab === 'portal') {
              if (session) {
                handleNavigateTab('dashboard');
              } else {
                setIsLoginModalOpen(true);
              }
            } else {
              handleNavigateTab(tab, subTab);
            }
          }}
          session={session}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}

      <main className="flex-1 w-full">
        {activeTab === 'beranda' && (
          <div className="space-y-0">
            <HeroSlider
              onNavigateTab={handleNavigateTab}
              config={homepageConfig}
              isAdmin={session?.role === 'admin'}
              onOpenCustomizer={() => {
                setAdminInitialMenu('homepage');
                setActiveTab('dashboard');
              }}
            />

            <HomepageWelcomeSection
              welcome={homepageConfig.welcomeSection}
              onNavigateTab={handleNavigateTab}
            />

            <AcademicProgramsSection onNavigateTab={handleNavigateTab} />

            <CampusLifeSection
              onNavigateTab={handleNavigateTab}
              initialSubTab="ekskul"
              extracurriculars={extracurriculars}
              studentWorks={studentWorks}
            />

            <WhyChooseUsSection
              onNavigateTab={handleNavigateTab}
              config={homepageConfig.whyChooseUs}
            />

            <StudentVoiceAndNewsSection
              newsList={newsList}
              events={eventsList}
              onNavigateTab={handleNavigateTab}
            />

            <QuickActionRibbon onNavigateTab={handleNavigateTab} />

            <StatsDashboard students={students} />

            <TeacherStaffSection teachers={teachers} />

            <StudentGallery items={galleryList} />
          </div>
        )}

        {activeTab === 'profil' && (
          <SchoolProfileSection
            profile={schoolProfile}
            initialSubTab={activeSubTab}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {(activeTab === 'jurusan' || activeTab === 'akademik') && (
          <AcademicProgramsFullPage
            majors={majors}
            initialMajor={activeSubTab}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {activeTab === 'ppdb' && (
          <PPDBOnline
            ppdbList={ppdbList}
            onAddRegistration={handleAddPPDB}
            initialSubTab={activeSubTab}
          />
        )}

        {activeTab === 'guru' && (
          <TeacherStaffSection teachers={teachers} initialDept={activeSubTab} />
        )}

        {(activeTab === 'kehidupan' || activeTab === 'galeri') && (
          <CampusLifeSection
            onNavigateTab={handleNavigateTab}
            initialSubTab={activeSubTab}
            extracurriculars={extracurriculars}
            studentWorks={studentWorks}
          />
        )}

        {activeTab === 'statistik' && (
          <div className="py-6">
            <StatsDashboard students={students} initialSubTab={activeSubTab} />
          </div>
        )}

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
                <DistrictNews newsList={newsList} onNavigateTab={handleNavigateTab} />
              </div>
              <div>
                <UpcomingEvents events={eventsList} onNavigateTab={handleNavigateTab} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && session && (
          <DashboardView
            session={session}
            students={students}
            teachers={teachers}
            newsList={newsList}
            eventsList={eventsList}
            galleryList={galleryList}
            ppdbList={ppdbList}
            notifications={notifications}
            studyMaterials={studyMaterials}
            assignments={assignments}
            submissions={submissions}
            waliNotes={waliNotes}
            leaveRequests={leaveRequests}
            discussions={discussions}
            extracurriculars={extracurriculars}
            studentWorks={studentWorks}
            majors={majors}
            schoolProfile={schoolProfile}
            teacherAdminDocs={teacherAdminDocs}
            subjectAttendanceSessions={subjectAttendanceSessions}
            onUploadTeacherAdminDoc={handleUploadTeacherAdminDoc}
            onVerifyTeacherAdminDoc={handleVerifyTeacherAdminDoc}
            onSaveSubjectAttendanceSession={handleSaveSubjectAttendanceSession}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onAddTeacher={handleAddTeacher}
            onUpdateTeacher={handleUpdateTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onAddNews={handleAddNews}
            onUpdateNews={handleUpdateNews}
            onDeleteNews={handleDeleteNews}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddGallery={handleAddGallery}
            onUpdateGallery={handleUpdateGallery}
            onDeleteGallery={handleDeleteGallery}
            onAddPPDB={handleAddPPDB}
            onUpdatePPDB={handleUpdatePPDB}
            onUpdatePPDBStatus={handleUpdatePPDBStatus}
            onSendPushNotification={handleSendPushNotification}
            onAddStudyMaterial={handleAddStudyMaterial}
            onDeleteStudyMaterial={handleDeleteStudyMaterial}
            onAddAssignment={handleAddAssignment}
            onDeleteAssignment={handleDeleteAssignment}
            onAddSubmission={handleAddSubmission}
            onGradeSubmission={handleGradeSubmission}
            onAddWaliNote={handleAddWaliNote}
            onDeleteWaliNote={handleDeleteWaliNote}
            onSubmitLeaveRequest={handleSubmitLeaveRequest}
            onReviewLeaveRequest={handleReviewLeaveRequest}
            onAddDiscussion={handleAddDiscussion}
            onAddDiscussionReply={handleAddDiscussionReply}
            onUpdateSchoolProfile={handleUpdateSchoolProfile}
            onAddMajor={handleAddMajor}
            onUpdateMajor={handleUpdateMajor}
            onDeleteMajor={handleDeleteMajor}
            onAddExtracurricular={handleAddExtracurricular}
            onUpdateExtracurricular={handleUpdateExtracurricular}
            onDeleteExtracurricular={handleDeleteExtracurricular}
            onAddStudentWork={handleAddStudentWork}
            onUpdateStudentWork={handleUpdateStudentWork}
            onDeleteStudentWork={handleDeleteStudentWork}
            homepageConfig={homepageConfig}
            onUpdateHomepageConfig={handleUpdateHomepageConfig}
            onResetHomepageConfig={handleResetHomepageConfig}
            sidebarConfig={sidebarConfig}
            onUpdateSidebarConfig={handleUpdateSidebarConfig}
            initialAdminMenu={adminInitialMenu}
            onBackToPortal={handleLogout}
            onLogout={handleLogout}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      <PushNotificationBanner
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onNavigateToPPDB={() => setActiveTab('ppdb')}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          setActiveTab('dashboard');
        }}
      />

      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        session={session}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateSession={(updatedSession: UserSession) => {
          setSession(updatedSession);
        }}
      />

      {!isDashboard && (
        <Footer
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}
    </div>
  );
}