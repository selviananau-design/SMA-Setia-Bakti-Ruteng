import React from 'react';
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
} from '../types';
import { AdminResultDashboard } from './AdminResultDashboard';
import { TeacherDashboard } from './dashboard/TeacherDashboard';
import { StudentDashboard } from './dashboard/StudentDashboard';
import { ParentDashboard } from './dashboard/ParentDashboard';

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
  onDeleteMajor: (id: string) => void;
  onAddExtracurricular: (eskul: Extracurricular) => void;
  onDeleteExtracurricular: (id: string) => void;
  onAddStudentWork: (work: StudentWork) => void;
  onDeleteStudentWork: (id: string) => void;
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
  onDeleteMajor,
  onAddExtracurricular,
  onDeleteExtracurricular,
  onAddStudentWork,
  onDeleteStudentWork,
  onBackToPortal,
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
        onUpdateSchoolProfile={onUpdateSchoolProfile}
        onAddMajor={onAddMajor}
        onDeleteMajor={onDeleteMajor}
        onAddExtracurricular={onAddExtracurricular}
        onDeleteExtracurricular={onDeleteExtracurricular}
        onAddStudentWork={onAddStudentWork}
        onDeleteStudentWork={onDeleteStudentWork}
        onBackToPortal={onBackToPortal}
        onNavigateToWebsiteTab={onNavigateToWebsiteTab}
      />
    );
  }

  // 2. GURU DASHBOARD (WALI KELAS & GURU MAPEL)
  if (session.role === 'guru') {
    return (
      <div className="w-full py-8 bg-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <TeacherDashboard
            session={session}
            students={students}
            studyMaterials={studyMaterials}
            assignments={assignments}
            submissions={submissions}
            waliNotes={waliNotes}
            leaveRequests={leaveRequests}
            discussions={discussions}
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
      <div className="w-full py-8 bg-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
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
      <div className="w-full py-8 bg-slate-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
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
