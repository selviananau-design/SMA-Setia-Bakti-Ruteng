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
} from './types';
import { BookOpen, Award, GraduationCap, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);

  const handleNavigateTab = (tab: string, subTab?: string) => {
    setActiveTab(tab);
    setActiveSubTab(subTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('smak_user_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Students state with localStorage sync
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('smak_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  // Teachers state with localStorage sync
  const [teachers, setTeachers] = useState<TeacherStaff[]>(() => {
    const saved = localStorage.getItem('smak_teachers');
    return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
  });

  // News state with localStorage sync
  const [newsList, setNewsList] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('smak_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  // Events state with localStorage sync
  const [eventsList, setEventsList] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem('smak_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // Gallery state with localStorage sync
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('smak_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

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

  // Study Materials state (Bahan Ajar)
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('smak_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  // Assignments state (Tugas Siswa)
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('smak_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  // Submissions state (Pengumpulan Tugas Siswa)
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(() => {
    const saved = localStorage.getItem('smak_submissions');
    return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
  });

  // Wali Kelas Notes state (Catatan Khusus Wali Kelas)
  const [waliNotes, setWaliNotes] = useState<WaliKelasNote[]>(() => {
    const saved = localStorage.getItem('smak_wali_notes');
    return saved ? JSON.parse(saved) : INITIAL_WALI_NOTES;
  });

  // Leave Requests state (Permohonan Izin dari Orang Tua ke Wali Kelas)
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('smak_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  // Subject Discussions state (Forum Diskusi Siswa & Guru)
  const [discussions, setDiscussions] = useState<SubjectDiscussion[]>(() => {
    const saved = localStorage.getItem('smak_discussions');
    return saved ? JSON.parse(saved) : INITIAL_DISCUSSIONS;
  });

  // Extracurriculars state (Ekskul Siswa)
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(() => {
    const saved = localStorage.getItem('smak_extracurriculars');
    return saved ? JSON.parse(saved) : INITIAL_EXTRACURRICULARS;
  });

  // Student Works state (Karya Siswa: Cerita, Puisi, Jurnalistik)
  const [studentWorks, setStudentWorks] = useState<StudentWork[]>(() => {
    const saved = localStorage.getItem('smak_student_works');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_WORKS;
  });

  // Majors state (Jurusan & Peminatan)
  const [majors, setMajors] = useState<MajorProgram[]>(() => {
    const saved = localStorage.getItem('smak_majors');
    return saved ? JSON.parse(saved) : INITIAL_MAJORS;
  });

  // School Profile state (Profil Sekolah Admin Utama)
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    const saved = localStorage.getItem('smak_school_profile');
    return saved ? JSON.parse(saved) : INITIAL_SCHOOL_PROFILE;
  });

  // Teacher Admin Documents state (Administrasi Guru Mapel & Supervisi)
  const [teacherAdminDocs, setTeacherAdminDocs] = useState<TeacherAdminDocument[]>(() => {
    const saved = localStorage.getItem('smak_teacher_admin_docs');
    return saved ? JSON.parse(saved) : INITIAL_TEACHER_ADMIN_DOCS;
  });

  // Subject Attendance Sessions state (Presensi Guru Mapel Per Pertemuan)
  const [subjectAttendanceSessions, setSubjectAttendanceSessions] = useState<SubjectAttendanceSession[]>(() => {
    const saved = localStorage.getItem('smak_subject_attendance');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECT_ATTENDANCE_SESSIONS;
  });

  // Homepage Config state (Kustomisasi Gambar & Tulisan Halaman Utama Website)
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    try {
      const saved = localStorage.getItem('smak_homepage_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_HOMEPAGE_CONFIG;
  });

  const [adminInitialMenu, setAdminInitialMenu] = useState<string>('overview');

  // Muat data dari MySQL Database Server saat aplikasi pertama kali dimuat
  useEffect(() => {
    dbService.loadAllData().then((serverData) => {
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
      }
    });
  }, []);

  // Sync state changes to localStorage and MySQL Database
  useEffect(() => {
    localStorage.setItem('smak_students', JSON.stringify(students));
    dbService.syncEntity('students', students);
  }, [students]);

  useEffect(() => {
    localStorage.setItem('smak_teachers', JSON.stringify(teachers));
    dbService.syncEntity('teachers', teachers);
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('smak_news', JSON.stringify(newsList));
    dbService.syncEntity('news', newsList);
  }, [newsList]);

  useEffect(() => {
    localStorage.setItem('smak_events', JSON.stringify(eventsList));
    dbService.syncEntity('events', eventsList);
  }, [eventsList]);

  useEffect(() => {
    localStorage.setItem('smak_gallery', JSON.stringify(galleryList));
    dbService.syncEntity('gallery', galleryList);
  }, [galleryList]);

  useEffect(() => {
    localStorage.setItem('smak_ppdb', JSON.stringify(ppdbList));
    dbService.syncEntity('ppdb', ppdbList);
  }, [ppdbList]);

  useEffect(() => {
    localStorage.setItem('smak_notifications', JSON.stringify(notifications));
    dbService.syncEntity('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('smak_materials', JSON.stringify(studyMaterials));
    dbService.syncEntity('studyMaterials', studyMaterials);
  }, [studyMaterials]);

  useEffect(() => {
    localStorage.setItem('smak_assignments', JSON.stringify(assignments));
    dbService.syncEntity('assignments', assignments);
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('smak_submissions', JSON.stringify(submissions));
    dbService.syncEntity('submissions', submissions);
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('smak_wali_notes', JSON.stringify(waliNotes));
    dbService.syncEntity('waliNotes', waliNotes);
  }, [waliNotes]);

  useEffect(() => {
    localStorage.setItem('smak_leave_requests', JSON.stringify(leaveRequests));
    dbService.syncEntity('leaveRequests', leaveRequests);
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('smak_discussions', JSON.stringify(discussions));
    dbService.syncEntity('discussions', discussions);
  }, [discussions]);

  useEffect(() => {
    localStorage.setItem('smak_extracurriculars', JSON.stringify(extracurriculars));
    dbService.syncEntity('extracurriculars', extracurriculars);
  }, [extracurriculars]);

  useEffect(() => {
    localStorage.setItem('smak_student_works', JSON.stringify(studentWorks));
    dbService.syncEntity('studentWorks', studentWorks);
  }, [studentWorks]);

  useEffect(() => {
    localStorage.setItem('smak_majors', JSON.stringify(majors));
    dbService.syncEntity('majors', majors);
  }, [majors]);

  useEffect(() => {
    localStorage.setItem('smak_school_profile', JSON.stringify(schoolProfile));
    dbService.syncEntity('schoolProfile', schoolProfile);
  }, [schoolProfile]);

  useEffect(() => {
    localStorage.setItem('smak_teacher_admin_docs', JSON.stringify(teacherAdminDocs));
    dbService.syncEntity('teacherAdminDocs', teacherAdminDocs);
  }, [teacherAdminDocs]);

  useEffect(() => {
    localStorage.setItem('smak_subject_attendance', JSON.stringify(subjectAttendanceSessions));
    dbService.syncEntity('subjectAttendance', subjectAttendanceSessions);
  }, [subjectAttendanceSessions]);

  useEffect(() => {
    localStorage.setItem('smak_homepage_config', JSON.stringify(homepageConfig));
    dbService.syncEntity('homepageConfig', homepageConfig);
  }, [homepageConfig]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('smak_user_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('smak_user_session');
    }
  }, [session]);

  // Handlers: Teacher Administration Documents
  const handleUploadTeacherAdminDoc = (doc: TeacherAdminDocument) => {
    setTeacherAdminDocs((prev) => [doc, ...prev]);
  };

  const handleVerifyTeacherAdminDoc = (
    id: string,
    status: TeacherAdminDocument['status'],
    score?: number,
    notes?: string,
    verifierName?: string
  ) => {
    setTeacherAdminDocs((prev) =>
      prev.map((doc) =>
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
      )
    );
  };

  // Handlers: Subject Attendance Sessions
  const handleSaveSubjectAttendanceSession = (sessionData: SubjectAttendanceSession) => {
    setSubjectAttendanceSessions((prev) => [sessionData, ...prev]);
  };

  // Handlers: Student
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
  };
  const handleDeleteStudent = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data siswa ini dari sistem?')) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Handlers: Teacher
  const handleAddTeacher = (newTeacher: TeacherStaff) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };
  const handleDeleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  // Handlers: News
  const handleAddNews = (newNews: NewsItem) => {
    setNewsList((prev) => [newNews, ...prev]);
  };
  const handleDeleteNews = (id: string) => {
    setNewsList((prev) => prev.filter((n) => n.id !== id));
  };

  // Handlers: Events
  const handleAddEvent = (newEvent: SchoolEvent) => {
    setEventsList((prev) => [newEvent, ...prev]);
  };
  const handleDeleteEvent = (id: string) => {
    setEventsList((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers: Gallery
  const handleAddGallery = (newItem: GalleryItem) => {
    setGalleryList((prev) => [newItem, ...prev]);
  };
  const handleDeleteGallery = (id: string) => {
    setGalleryList((prev) => prev.filter((g) => g.id !== id));
  };

  // Handlers: PPDB
  const handleAddPPDB = (newReg: PPDBRegistration) => {
    setPpdbList((prev) => [newReg, ...prev]);
  };
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

  // Handlers: Study Materials (Bahan Ajar)
  const handleAddStudyMaterial = (mat: StudyMaterial) => {
    setStudyMaterials((prev) => [mat, ...prev]);
  };
  const handleDeleteStudyMaterial = (id: string) => {
    setStudyMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  // Handlers: Assignments (Tugas)
  const handleAddAssignment = (assignment: Assignment) => {
    setAssignments((prev) => [assignment, ...prev]);
  };
  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Handlers: Submissions (Pengumpulan Tugas)
  const handleAddSubmission = (submission: AssignmentSubmission) => {
    setSubmissions((prev) => {
      const filtered = prev.filter(
        (s) => !(s.assignmentId === submission.assignmentId && s.studentId === submission.studentId)
      );
      return [submission, ...filtered];
    });
  };
  const handleGradeSubmission = (id: string, grade: number, feedback?: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, grade, feedback, status: 'Dinilai' } : s))
    );
  };

  // Handlers: Wali Kelas Notes
  const handleAddWaliNote = (note: WaliKelasNote) => {
    setWaliNotes((prev) => [note, ...prev]);
  };
  const handleDeleteWaliNote = (id: string) => {
    setWaliNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Handlers: Leave Requests (Izin Orang Tua)
  const handleSubmitLeaveRequest = (req: LeaveRequest) => {
    setLeaveRequests((prev) => [req, ...prev]);
  };
  const handleReviewLeaveRequest = (
    id: string,
    status: LeaveRequest['status'],
    notes?: string,
    reviewer?: string
  ) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              reviewNotes: notes,
              reviewedBy: reviewer || 'Wali Kelas',
            }
          : r
      )
    );
  };

  // Handlers: Discussions (Diskusi Siswa & Guru)
  const handleAddDiscussion = (disc: SubjectDiscussion) => {
    setDiscussions((prev) => [disc, ...prev]);
  };
  const handleAddDiscussionReply = (discussionId: string, reply: DiscussionReply) => {
    setDiscussions((prev) =>
      prev.map((d) => (d.id === discussionId ? { ...d, replies: [...d.replies, reply] } : d))
    );
  };

  // Handlers: School Profile
  const handleUpdateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
  };

  // Handlers: Majors
  const handleAddMajor = (major: MajorProgram) => {
    setMajors((prev) => [major, ...prev]);
  };
  const handleDeleteMajor = (id: string) => {
    setMajors((prev) => prev.filter((m) => m.id !== id));
  };

  // Handlers: Extracurriculars
  const handleAddExtracurricular = (eskul: Extracurricular) => {
    setExtracurriculars((prev) => [eskul, ...prev]);
  };
  const handleDeleteExtracurricular = (id: string) => {
    setExtracurriculars((prev) => prev.filter((e) => e.id !== id));
  };

  // Handlers: Student Works (Cerita, Puisi, Jurnalistik)
  const handleAddStudentWork = (work: StudentWork) => {
    setStudentWorks((prev) => [work, ...prev]);
  };
  const handleDeleteStudentWork = (id: string) => {
    setStudentWorks((prev) => prev.filter((w) => w.id !== id));
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('smak_user_session');
    handleNavigateTab('beranda');
  };

  const isDashboard = activeTab === 'dashboard' && !!session;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans">
      {/* 1. School Header with Crest and Notification Bell (Disembunyikan saat di Dasbor) */}
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

      {/* 2. Top Navigation Bar with Distinct Tabs (Disembunyikan saat di Dasbor) */}
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

      {/* 3. Main Dynamic Content Switcher */}
      <main className="flex-1 w-full">
        {/* PAGE 1: BERANDA (HOME) */}
        {activeTab === 'beranda' && (
          <div className="space-y-0">
            {/* 1. Grand Hero Slider with Overlapping Stats Ribbon (matches reference) */}
            <HeroSlider
              onNavigateTab={handleNavigateTab}
              config={homepageConfig}
              isAdmin={session?.role === 'admin'}
              onOpenCustomizer={() => {
                setAdminInitialMenu('homepage');
                setActiveTab('dashboard');
              }}
            />

            {/* 1B. Sambutan Resmi Kepala Sekolah (Dinamis dari Kustomisasi Beranda) */}
            <HomepageWelcomeSection
              welcome={homepageConfig.welcomeSection}
              onNavigateTab={handleNavigateTab}
            />

            {/* 2. Academic Excellence: "Find the Program That Inspires You" (matches reference) */}
            <AcademicProgramsSection onNavigateTab={handleNavigateTab} />

            {/* 3. Vibrant Campus Life: "Experience More Than Education" Dark Navy Showcase + Karya Siswa & Ekskul */}
            <CampusLifeSection
              onNavigateTab={handleNavigateTab}
              initialSubTab="ekskul"
              extracurriculars={extracurriculars}
              studentWorks={studentWorks}
            />

            {/* 4. Why SMAK Setia Bakti: "A School That Supports You" 4-Pillars (matches reference) */}
            <WhyChooseUsSection
              onNavigateTab={handleNavigateTab}
              config={homepageConfig.whyChooseUs}
            />

            {/* 5. Tri-Column Showcase: Student Voice + Latest News & Events + PPDB Next Step Callout (matches reference) */}
            <StudentVoiceAndNewsSection
              newsList={newsList}
              events={eventsList}
              onNavigateTab={handleNavigateTab}
            />

            {/* 6. Quick Action Facility Modals (Athletics, Asrama, Kantin Sehat, Kalender Akademik) */}
            <QuickActionRibbon onNavigateTab={handleNavigateTab} />

            {/* 7. Interactive Statistics & Alumni Tracker */}
            <StatsDashboard students={students} />

            {/* 8. Teachers & Faculty Directory Preview */}
            <TeacherStaffSection teachers={teachers} />

            {/* 9. Student Gallery & Campus Life Documentation */}
            <StudentGallery items={galleryList} />
          </div>
        )}

        {/* PAGE 2: PROFIL KAMI (TERPISAH SEBAGAI HALAMAN MANDIRI DENGAN SUB-MENU LENGKAP) */}
        {activeTab === 'profil' && (
          <SchoolProfileSection
            profile={schoolProfile}
            initialSubTab={activeSubTab}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {/* PAGE 3: JURUSAN & PROGRAM (TERPISAH SEBAGAI HALAMAN MANDIRI DENGAN SUB-MENU PEMINATAN) */}
        {(activeTab === 'jurusan' || activeTab === 'akademik') && (
          <AcademicProgramsFullPage
            majors={majors}
            initialMajor={activeSubTab}
            onNavigateTab={handleNavigateTab}
          />
        )}

        {/* PAGE 4: INFORMASI PPDB (ONLINE REGISTRATION & STATUS DENGAN SUB-MENU LENGKAP) */}
        {activeTab === 'ppdb' && (
          <PPDBOnline
            ppdbList={ppdbList}
            onAddRegistration={handleAddPPDB}
            initialSubTab={activeSubTab}
          />
        )}

        {/* PAGE 5: DEWAN GURU & STAF (DENGAN FILTER DEPARTEMEN / SUB-MENU) */}
        {activeTab === 'guru' && (
          <TeacherStaffSection
            teachers={teachers}
            initialDept={activeSubTab}
          />
        )}

        {/* PAGE 6: KEHIDUPAN SISWA (EKSKUL, KARYA SASTRA & JURNALISTIK, OSIS, ASRAMA, GALERI) */}
        {(activeTab === 'kehidupan' || activeTab === 'galeri') && (
          <CampusLifeSection
            onNavigateTab={handleNavigateTab}
            initialSubTab={activeSubTab}
            extracurriculars={extracurriculars}
            studentWorks={studentWorks}
          />
        )}

        {/* PAGE 7: STATISTIK LENGKAP SISWA, KELULUSAN, ALUMNI & KOPERASI */}
        {activeTab === 'statistik' && (
          <div className="py-6">
            <StatsDashboard
              students={students}
              initialSubTab={activeSubTab}
            />
          </div>
        )}

        {/* PAGE 8: BERITA & PENGUMUMAN */}
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

        {/* PAGE 8: AUTHENTICATED DASHBOARD (ADMIN / GURU / SISWA / ORANG TUA) */}
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
            onDeleteStudent={handleDeleteStudent}
            onAddTeacher={handleAddTeacher}
            onDeleteTeacher={handleDeleteTeacher}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddGallery={handleAddGallery}
            onDeleteGallery={handleDeleteGallery}
            onAddPPDB={handleAddPPDB}
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
            onDeleteMajor={handleDeleteMajor}
            onAddExtracurricular={handleAddExtracurricular}
            onDeleteExtracurricular={handleDeleteExtracurricular}
            onAddStudentWork={handleAddStudentWork}
            onDeleteStudentWork={handleDeleteStudentWork}
            homepageConfig={homepageConfig}
            onUpdateHomepageConfig={(updated) => setHomepageConfig(updated)}
            onResetHomepageConfig={() => setHomepageConfig(DEFAULT_HOMEPAGE_CONFIG)}
            initialAdminMenu={adminInitialMenu}
            onBackToPortal={handleLogout}
            onLogout={handleLogout}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Real-Time Push Notification Toast Alert */}
      <PushNotificationBanner
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onNavigateToPPDB={() => setActiveTab('ppdb')}
      />

      {/* 5. Login Modal for Admin, Guru, Siswa, Orang Tua */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(newSession) => {
          setSession(newSession);
          setActiveTab('dashboard');
        }}
      />

      {/* 5b. Profile Settings Modal (Admin, Guru, Siswa, Orang Tua) */}
      <ProfileSettingsModal
        isOpen={isProfileModalOpen}
        session={session}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateSession={(updatedSession: UserSession) => {
          setSession(updatedSession);
          localStorage.setItem('smak_user_session', JSON.stringify(updatedSession));
        }}
      />

      {/* 6. Comprehensive School Footer (Disembunyikan saat di Dasbor) */}
      {!isDashboard && (
        <Footer
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />
      )}
    </div>
  );
}
