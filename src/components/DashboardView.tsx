import React from 'react';
import { LogOut, GraduationCap, Settings } from 'lucide-react';
import {
  Student,
  PPDBRegistration,
  PushNotification,
  UserSession,
  TeacherStaff,
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
} from '../types';
import { AdminResultDashboard } from './AdminResultDashboard';
import { TeacherDashboard } from './dashboard/TeacherDashboard';
import { WaliKelasDashboard } from './dashboard/WaliKelasDashboard';
import { GuruMapelDashboard } from './dashboard/GuruMapelDashboard';
import { StudentDashboard } from './dashboard/StudentDashboard';
import { ParentDashboard } from './dashboard/ParentDashboard';

// Top Header Khusus Dasbor Pengguna (Menggantikan Header Menu Utama Website)
const DashboardPortalHeader: React.FC<{
  session: UserSession;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}> = ({ session, onLogout, onOpenProfile }) => {
  const getRoleBadge = () => {
    switch (session.role) {
      case 'admin':
        return { label: 'Admin Utama', bg: 'bg-indigo-600/90 text-white border-indigo-500' };
      case 'wali_kelas':
        return { label: `Wali Kelas ${session.className || 'X-MIPA 1'}`, bg: 'bg-purple-700/90 text-white border-purple-500' };
      case 'guru_mapel':
        return { label: 'Guru Mata Pelajaran', bg: 'bg-sky-700/90 text-white border-sky-500' };
      case 'guru':
        return { label: session.teacherType === 'wali_kelas' ? 'Guru Wali Kelas' : 'Guru Mapel', bg: 'bg-purple-700/90 text-white border-purple-500' };
      case 'siswa':
        return { label: `Siswa ${session.className ? `Kelas ${session.className}` : ''}`, bg: 'bg-emerald-700/90 text-white border-emerald-500' };
      case 'orangtua':
        return { label: 'Orang Tua / Wali Siswa', bg: 'bg-amber-700/90 text-white border-amber-500' };
      default:
        return { label: session.role.toUpperCase(), bg: 'bg-slate-700 text-white border-slate-600' };
    }
  };

  const badge = getRoleBadge();

  return (
    <header className="bg-[#151f38] text-white border-b border-slate-700/80 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: School Crest & Portal Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-white/20 flex items-center justify-center text-white shadow-md flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-black text-white tracking-wide uppercase">
                SMAK SETIA BAKTI RUTENG
              </h1>
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shadow-xs ${badge.bg}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              Portal Akademik Terpadu
            </p>
          </div>
        </div>

        {/* Right: User Profile, Profile Settings & Logout Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-white leading-tight">{session.name}</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              MySQL Hostinger Ready
            </span>
          </div>

          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className="px-2.5 sm:px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-xl border border-indigo-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Pengaturan Profil Pengguna"
            >
              <Settings className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">Pengaturan Profil</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-600 text-red-200 hover:text-white rounded-xl border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Keluar dari Dasbor"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export interface DashboardViewProps {
  session: UserSession;
  students: Student[];
  teachers: TeacherStaff[];
  newsList: NewsItem[];
  eventsList: SchoolEvent[];
  galleryList: GalleryItem[];
  ppdbList: PPDBRegistration[];
  notifications: PushNotification[];
  studyMaterials: StudyMaterial[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  waliNotes: WaliKelasNote[];
  leaveRequests: LeaveRequest[];
  discussions: SubjectDiscussion[];
  extracurriculars: Extracurricular[];
  studentWorks: StudentWork[];
  majors: MajorProgram[];
  schoolProfile: SchoolProfile;
  teacherAdminDocs?: TeacherAdminDocument[];
  subjectAttendanceSessions?: SubjectAttendanceSession[];
  onUploadTeacherAdminDoc?: (doc: TeacherAdminDocument) => void;
  onVerifyTeacherAdminDoc?: (id: string, status: TeacherAdminDocument['status'], score?: number, notes?: string, verifierName?: string) => void;
  onSaveSubjectAttendanceSession?: (session: SubjectAttendanceSession) => void;
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
  onAddStudyMaterial: (mat: StudyMaterial) => void;
  onDeleteStudyMaterial: (id: string) => void;
  onAddAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
  onAddSubmission: (submission: AssignmentSubmission) => void;
  onGradeSubmission: (id: string, grade: number, feedback?: string) => void;
  onAddWaliNote: (note: WaliKelasNote) => void;
  onDeleteWaliNote: (id: string) => void;
  onSubmitLeaveRequest: (req: LeaveRequest) => void;
  onReviewLeaveRequest: (id: string, status: LeaveRequest['status'], notes?: string, reviewer?: string) => void;
  onAddDiscussion: (disc: SubjectDiscussion) => void;
  onAddDiscussionReply: (discussionId: string, reply: DiscussionReply) => void;
  onUpdateSchoolProfile: (profile: SchoolProfile) => void;
  onAddMajor: (major: MajorProgram) => void;
  onUpdateMajor?: (major: MajorProgram) => void;
  onDeleteMajor: (id: string) => void;
  onAddExtracurricular: (eskul: Extracurricular) => void;
  onUpdateExtracurricular?: (eskul: Extracurricular) => void;
  onDeleteExtracurricular: (id: string) => void;
  onAddStudentWork: (work: StudentWork) => void;
  onUpdateStudentWork?: (work: StudentWork) => void;
  onDeleteStudentWork: (id: string) => void;
  homepageConfig?: HomepageConfig;
  onUpdateHomepageConfig?: (updated: HomepageConfig) => void;
  onResetHomepageConfig?: () => void;
  initialAdminMenu?: string;
  onBackToPortal?: () => void;
  onLogout?: () => void;
  onOpenProfile?: () => void;
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
  studyMaterials,
  assignments,
  submissions,
  waliNotes,
  leaveRequests,
  discussions,
  extracurriculars,
  studentWorks,
  majors,
  schoolProfile,
  teacherAdminDocs = [],
  subjectAttendanceSessions = [],
  homepageConfig,
  onUpdateHomepageConfig,
  onResetHomepageConfig,
  initialAdminMenu,
  onUploadTeacherAdminDoc,
  onVerifyTeacherAdminDoc,
  onSaveSubjectAttendanceSession,
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
  onAddStudyMaterial,
  onDeleteStudyMaterial,
  onAddAssignment,
  onDeleteAssignment,
  onAddSubmission,
  onGradeSubmission,
  onAddWaliNote,
  onDeleteWaliNote,
  onSubmitLeaveRequest,
  onReviewLeaveRequest,
  onAddDiscussion,
  onAddDiscussionReply,
  onUpdateSchoolProfile,
  onAddMajor,
  onUpdateMajor,
  onDeleteMajor,
  onAddExtracurricular,
  onUpdateExtracurricular,
  onDeleteExtracurricular,
  onAddStudentWork,
  onUpdateStudentWork,
  onDeleteStudentWork,
  onBackToPortal,
  onLogout,
  onOpenProfile,
  onNavigateToWebsiteTab,
}) => {
  // 1. ADMIN UTAMA DASHBOARD
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
        schoolProfile={schoolProfile}
        majors={majors}
        extracurriculars={extracurriculars}
        studentWorks={studentWorks}
        onAddStudent={onAddStudent}
        onUpdateStudent={onUpdateStudent}
        onDeleteStudent={onDeleteStudent}
        onAddTeacher={onAddTeacher}
        onUpdateTeacher={onUpdateTeacher}
        onDeleteTeacher={onDeleteTeacher}
        onAddNews={onAddNews}
        onUpdateNews={onUpdateNews}
        onDeleteNews={onDeleteNews}
        onAddEvent={onAddEvent}
        onUpdateEvent={onUpdateEvent}
        onDeleteEvent={onDeleteEvent}
        onAddGallery={onAddGallery}
        onUpdateGallery={onUpdateGallery}
        onDeleteGallery={onDeleteGallery}
        onAddPPDB={onAddPPDB}
        onUpdatePPDB={onUpdatePPDB}
        onUpdatePPDBStatus={onUpdatePPDBStatus}
        onSendPushNotification={onSendPushNotification}
        onUpdateSchoolProfile={onUpdateSchoolProfile}
        onAddMajor={onAddMajor}
        onUpdateMajor={onUpdateMajor}
        onDeleteMajor={onDeleteMajor}
        onAddExtracurricular={onAddExtracurricular}
        onUpdateExtracurricular={onUpdateExtracurricular}
        onDeleteExtracurricular={onDeleteExtracurricular}
        onAddStudentWork={onAddStudentWork}
        onUpdateStudentWork={onUpdateStudentWork}
        onDeleteStudentWork={onDeleteStudentWork}
        teacherAdminDocs={teacherAdminDocs}
        subjectAttendanceSessions={subjectAttendanceSessions}
        onVerifyTeacherAdminDoc={onVerifyTeacherAdminDoc}
        homepageConfig={homepageConfig}
        onUpdateHomepageConfig={onUpdateHomepageConfig}
        onResetHomepageConfig={onResetHomepageConfig}
        initialActiveMenu={initialAdminMenu}
        onBackToPortal={onBackToPortal}
        onLogout={onLogout || onBackToPortal}
        onOpenProfile={onOpenProfile}
        onNavigateToWebsiteTab={onNavigateToWebsiteTab}
      />
    );
  }

  // 2A. WALI KELAS DASHBOARD (EKSKLUSIF)
  if (
    session.role === 'wali_kelas' ||
    (session.role === 'guru' && session.teacherType === 'wali_kelas')
  ) {
    return (
      <div className="w-full bg-slate-100 min-h-screen">
        <DashboardPortalHeader session={session} onLogout={onLogout || onBackToPortal} onOpenProfile={onOpenProfile} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <WaliKelasDashboard
            session={session}
            students={students}
            waliNotes={waliNotes}
            leaveRequests={leaveRequests}
            discussions={discussions}
            onAddWaliNote={onAddWaliNote}
            onReviewLeaveRequest={(reqId, status, notes) =>
              onReviewLeaveRequest(reqId, status, notes, session.name)
            }
            onAddDiscussionMessage={(discId, replyText) =>
              onAddDiscussionReply(discId, {
                id: `reply-${Date.now()}`,
                authorRole: 'guru',
                authorName: session.name,
                createdAt: 'Baru Saja',
                content: replyText,
              })
            }
            onNewDiscussionTopic={onAddDiscussion}
          />
        </div>
      </div>
    );
  }

  // 2B. GURU MATA PELAJARAN DASHBOARD (EKSKLUSIF)
  if (
    session.role === 'guru_mapel' ||
    (session.role === 'guru' && session.teacherType === 'guru_mapel')
  ) {
    return (
      <div className="w-full bg-slate-100 min-h-screen">
        <DashboardPortalHeader session={session} onLogout={onLogout || onBackToPortal} onOpenProfile={onOpenProfile} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <GuruMapelDashboard
            session={session}
            students={students}
            studyMaterials={studyMaterials}
            assignments={assignments}
            submissions={submissions}
            discussions={discussions}
            teacherAdminDocs={teacherAdminDocs}
            subjectAttendanceSessions={subjectAttendanceSessions}
            onAddStudyMaterial={onAddStudyMaterial}
            onAddAssignment={onAddAssignment}
            onGradeSubmission={(subId, grade, feedback) => onGradeSubmission(subId, grade, feedback)}
            onAddDiscussionMessage={(discId, replyText) =>
              onAddDiscussionReply(discId, {
                id: `reply-${Date.now()}`,
                authorRole: 'guru',
                authorName: session.name,
                createdAt: 'Baru Saja',
                content: replyText,
              })
            }
            onNewDiscussionTopic={onAddDiscussion}
            onUploadTeacherAdminDoc={onUploadTeacherAdminDoc}
            onSaveSubjectAttendanceSession={onSaveSubjectAttendanceSession}
          />
        </div>
      </div>
    );
  }

  // 2C. GURU DASHBOARD (FALLBACK JIKA ROLE GURU UMUM)
  if (session.role === 'guru') {
    return (
      <div className="w-full bg-slate-100 min-h-screen">
        <DashboardPortalHeader session={session} onLogout={onLogout || onBackToPortal} onOpenProfile={onOpenProfile} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <TeacherDashboard
            session={session}
            students={students}
            studyMaterials={studyMaterials}
            assignments={assignments}
            submissions={submissions}
            waliNotes={waliNotes}
            leaveRequests={leaveRequests}
            discussions={discussions}
            teacherAdminDocs={teacherAdminDocs}
            subjectAttendanceSessions={subjectAttendanceSessions}
            onUploadTeacherAdminDoc={onUploadTeacherAdminDoc}
            onSaveSubjectAttendanceSession={onSaveSubjectAttendanceSession}
            onAddStudyMaterial={onAddStudyMaterial}
            onAddAssignment={onAddAssignment}
            onGradeSubmission={(subId, grade, feedback) => onGradeSubmission(subId, grade, feedback)}
            onAddWaliNote={onAddWaliNote}
            onReviewLeaveRequest={(reqId, status, notes) =>
              onReviewLeaveRequest(reqId, status, notes, session.name)
            }
            onAddDiscussionMessage={(discId, replyText) =>
              onAddDiscussionReply(discId, {
                id: `reply-${Date.now()}`,
                authorRole: 'guru',
                authorName: session.name,
                createdAt: 'Baru Saja',
                content: replyText,
              })
            }
            onNewDiscussionTopic={onAddDiscussion}
          />
        </div>
      </div>
    );
  }

  // 3. SISWA DASHBOARD (DOWNLOAD BAHAN AJAR, TUGAS, CATATAN WALI KELAS, DISKUSI)
  if (session.role === 'siswa') {
    const currentStudent =
      students.find((s) => s.nisn === session.identifier || s.name.toLowerCase().includes('yohanes')) ||
      students[0];

    return (
      <div className="w-full bg-slate-100 min-h-screen">
        <DashboardPortalHeader session={session} onLogout={onLogout || onBackToPortal} onOpenProfile={onOpenProfile} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <StudentDashboard
            session={session}
            student={currentStudent}
            studyMaterials={studyMaterials}
            assignments={assignments}
            submissions={submissions}
            waliNotes={waliNotes}
            discussions={discussions}
            onSubmitAssignment={onAddSubmission}
            onAddDiscussionMessage={(discId, replyText) =>
              onAddDiscussionReply(discId, {
                id: `reply-${Date.now()}`,
                authorRole: 'siswa',
                authorName: session.name,
                createdAt: 'Baru Saja',
                content: replyText,
              })
            }
            onNewDiscussionTopic={onAddDiscussion}
          />
        </div>
      </div>
    );
  }

  // 4. ORANG TUA DASHBOARD (PENGUMUMAN, KEHADIRAN ANAK, AJUKAN IZIN WALI KELAS)
  if (session.role === 'orangtua') {
    const childStudent =
      students.find((s) => s.nisn === session.childNisn || s.nisn === '0078129011') ||
      students[0];

    return (
      <div className="w-full bg-slate-100 min-h-screen">
        <DashboardPortalHeader session={session} onLogout={onLogout || onBackToPortal} onOpenProfile={onOpenProfile} />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <ParentDashboard
            session={session}
            child={childStudent}
            leaveRequests={leaveRequests}
            waliNotes={waliNotes}
            onSubmitLeaveRequest={onSubmitLeaveRequest}
          />
        </div>
      </div>
    );
  }

  return null;
};
