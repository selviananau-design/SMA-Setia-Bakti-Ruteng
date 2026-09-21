import React, { useState } from 'react';
import {
  BookOpen,
  UserCheck,
  Users,
  FileText,
  Upload,
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  Send,
  Plus,
  Award,
  AlertTriangle,
  Download,
  Search,
  Filter,
  FolderCheck,
  Check,
  FileCheck,
  ExternalLink,
  Eye,
  RefreshCw,
  FileSpreadsheet,
  Sparkles,
  Calendar,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import {
  Student,
  StudyMaterial,
  StudentAssignment,
  AssignmentSubmission,
  WaliKelasNote,
  LeaveRequest,
  ClassDiscussion,
  UserSession,
  TeacherAdministrationDoc,
  TeacherAdminCategory,
  SubjectAttendanceSession,
  SubjectAttendanceItem,
} from '../../types';
import { TeacherAdminPdfUpload } from '../common/TeacherAdminPdfUpload';
import {
  INITIAL_TEACHER_ADMIN_DOCS,
  INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
} from '../../data/mockData';

interface TeacherDashboardProps {
  session: UserSession;
  students: Student[];
  studyMaterials: StudyMaterial[];
  assignments: StudentAssignment[];
  submissions: AssignmentSubmission[];
  waliNotes: WaliKelasNote[];
  leaveRequests: LeaveRequest[];
  discussions: ClassDiscussion[];
  teacherAdminDocs?: TeacherAdministrationDoc[];
  subjectAttendanceSessions?: SubjectAttendanceSession[];
  onAddStudyMaterial: (material: StudyMaterial) => void;
  onAddAssignment: (assignment: StudentAssignment) => void;
  onGradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  onAddWaliNote: (note: WaliKelasNote) => void;
  onReviewLeaveRequest: (requestId: string, status: 'Disetujui' | 'Ditolak', reviewNotes?: string) => void;
  onAddDiscussionMessage: (discussionId: string, replyContent: string) => void;
  onNewDiscussionTopic: (discussion: ClassDiscussion) => void;
  onAddTeacherAdminDoc?: (doc: TeacherAdministrationDoc) => void;
  onUploadTeacherAdminDoc?: (doc: TeacherAdministrationDoc) => void;
  onAddSubjectAttendanceSession?: (session: SubjectAttendanceSession) => void;
  onSaveSubjectAttendanceSession?: (session: SubjectAttendanceSession) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  session,
  students,
  studyMaterials,
  assignments,
  submissions,
  waliNotes,
  leaveRequests,
  discussions,
  teacherAdminDocs = INITIAL_TEACHER_ADMIN_DOCS,
  subjectAttendanceSessions = INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
  onAddStudyMaterial,
  onAddAssignment,
  onGradeSubmission,
  onAddWaliNote,
  onReviewLeaveRequest,
  onAddDiscussionMessage,
  onNewDiscussionTopic,
  onAddTeacherAdminDoc,
  onUploadTeacherAdminDoc,
  onAddSubjectAttendanceSession,
  onSaveSubjectAttendanceSession,
}) => {
  // Mode Guru: Guru Wali Kelas vs Guru Mapel
  const [activeMode, setActiveMode] = useState<'walikelas' | 'gurumapel'>('walikelas');

  // Selected Class for Wali Kelas
  const [waliClass, setWaliClass] = useState<string>(session.className || 'X-MIPA 1');
  const [waliSubTab, setWaliSubTab] = useState<'presensi' | 'catatan' | 'izin' | 'diskusi' | 'siswa'>('presensi');

  // Selected Subject & Class for Guru Mapel
  const [mapelSubject, setMapelSubject] = useState<string>('Biologi & Bioteknologi');
  const [mapelClass, setMapelClass] = useState<string>('X-MIPA 1');
  const [mapelSubTab, setMapelSubTab] = useState<
    'materi' | 'tugas' | 'penilaian' | 'absen' | 'administrasi' | 'diskusi' | 'siswa'
  >('materi');

  // Local Attendance State for today
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Modals / Forms
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Form states for new material
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialType, setNewMaterialType] = useState<'PDF' | 'PPTX' | 'DOCX' | 'VIDEO' | 'ZIP'>('PDF');
  const [newMaterialDesc, setNewMaterialDesc] = useState('');

  // Form states for new assignment
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDue, setNewAsgDue] = useState('2026-08-05');
  const [newAsgDesc, setNewAsgDesc] = useState('');

  // Form states for new wali note
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<WaliKelasNote['category']>('Bimbingan Karakter');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteAction, setNoteAction] = useState('');

  // Reply message text
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  // Administrasi Guru State
  const [showUploadAdminDocModal, setShowUploadAdminDocModal] = useState(false);
  const [selectedAdminDocDetail, setSelectedAdminDocDetail] = useState<TeacherAdministrationDoc | null>(null);
  const [adminFilterCategory, setAdminFilterCategory] = useState<string>('Semua');
  const [adminFilterStatus, setAdminFilterStatus] = useState<string>('Semua');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Upload Form states (1 Berkas PDF Bundel Terpadu: CP s/d RPM)
  const [adminDocCategory, setAdminDocCategory] = useState<TeacherAdminCategory>(
    'Bundel Administrasi Lengkap (CP, ATP hingga RPM)'
  );
  const [adminDocTitle, setAdminDocTitle] = useState('');
  const [adminDocTargetClass, setAdminDocTargetClass] = useState('Fase E (Kelas X)');
  const [adminDocAcademicYear, setAdminDocAcademicYear] = useState('2026/2027');
  const [adminDocSemester, setAdminDocSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [adminDocFileType, setAdminDocFileType] = useState<'PDF' | 'DOCX' | 'XLSX' | 'ZIP'>('PDF');
  const [adminDocDescription, setAdminDocDescription] = useState('');
  const [adminDocFileName, setAdminDocFileName] = useState('');
  const [adminDocFileSize, setAdminDocFileSize] = useState('5.8 MB');
  const [adminDocBundleComponents, setAdminDocBundleComponents] = useState<string[]>([
    'Capaian Pembelajaran (CP)',
    'Alur Tujuan Pembelajaran (ATP)',
    'Prota & Promes',
    'Kriteria Ketercapaian (KKTP)',
    'Rencana Pembelajaran Modul (RPM)',
    'Instrumen Asesmen & Evaluasi',
  ]);
  const [adminDocSuccessToast, setAdminDocSuccessToast] = useState<string | null>(null);

  // Presensi Mapel State
  const [mapelAttendanceDate, setMapelAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0] || '2026-08-04'
  );
  const [mapelTimeSlot, setMapelTimeSlot] = useState<string>('07.30 - 09.00 WITA');
  const [mapelTopic, setMapelTopic] = useState<string>('Praktikum Pengamatan Struktur Sel Hewan dan Sel Tumbuhan');
  const [mapelMeetingNumber, setMapelMeetingNumber] = useState<number>(3);
  const [mapelStudentAttendance, setMapelStudentAttendance] = useState<
    Record<string, { status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'; notes: string }>
  >({});
  const [attendanceSuccessToast, setAttendanceSuccessToast] = useState<string | null>(null);
  const [selectedHistoricalSession, setSelectedHistoricalSession] = useState<SubjectAttendanceSession | null>(null);

  // Available classes list from all active students or defaults
  const allClasses = Array.from(new Set(students.map((s) => s.className).filter(Boolean))).sort();
  if (allClasses.length === 0) {
    allClasses.push('X-MIPA 1', 'X-MIPA 2', 'X-IPS 1', 'XI-MIPA 1', 'XI-IPS 2', 'XII-MIPA 1');
  }

  // Filter students for Wali Kelas
  const waliStudents = students.filter((s) => s.className === waliClass);

  // Filter students for Guru Mapel
  const mapelStudents = students.filter((s) => s.className === mapelClass);

  // Filter study materials for selected class & mapel
  const filteredMaterials = studyMaterials.filter(
    (m) => m.className === mapelClass && (mapelSubject ? m.subject.includes(mapelSubject) : true)
  );

  // Filter assignments for selected class & mapel
  const filteredAssignments = assignments.filter(
    (a) => a.className === mapelClass && (mapelSubject ? a.subject.includes(mapelSubject) : true)
  );

  // Filter submissions for selected class
  const filteredSubmissions = submissions.filter((s) => s.className === mapelClass);

  // Filter leave requests for Wali Kelas
  const filteredLeaveRequests = leaveRequests.filter((l) => l.className === waliClass);

  // Filter wali notes for Wali Kelas
  const filteredWaliNotes = waliNotes.filter((n) => n.className === waliClass);

  // Filter discussions
  const waliDiscussions = discussions.filter(
    (d) => d.className === waliClass && d.type === 'walikelas'
  );
  const mapelDiscussions = discussions.filter(
    (d) => d.className === mapelClass && d.type === 'mapel'
  );

  // Filter teacher's admin docs (all docs or matching teacher)
  const myAdminDocs = teacherAdminDocs;

  const filteredMyAdminDocs = myAdminDocs.filter((doc) => {
    const matchesCategory = adminFilterCategory === 'Semua' || doc.category === adminFilterCategory;
    const matchesStatus = adminFilterStatus === 'Semua' || doc.status === adminFilterStatus;
    const matchesQuery =
      adminSearchQuery === '' ||
      doc.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
      doc.teacherName.toLowerCase().includes(adminSearchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesQuery;
  });

  // Filter subject attendance sessions for current class & subject
  const currentSubjectSessions = subjectAttendanceSessions.filter(
    (sess) =>
      sess.className === mapelClass &&
      (sess.subject.toLowerCase().includes(mapelSubject.toLowerCase()) ||
        mapelSubject.toLowerCase().includes(sess.subject.toLowerCase()))
  );

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 4000);
  };

  // Handler for saving Mapel Attendance Session
  const handleSetAllPresent = () => {
    const updated: Record<string, { status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'; notes: string }> = {};
    mapelStudents.forEach((student) => {
      updated[student.id] = { status: 'Hadir', notes: '' };
    });
    setMapelStudentAttendance(updated);
  };

  const handleUpdateStudentAttendance = (
    studentId: string,
    status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa',
    notes?: string
  ) => {
    setMapelStudentAttendance((prev) => ({
      ...prev,
      [studentId]: {
        status,
        notes: notes !== undefined ? notes : prev[studentId]?.notes || '',
      },
    }));
  };

  const handleSaveSubjectAttendanceSession = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (mapelStudents.length === 0) {
      alert(`Tidak ada siswa di kelas ${mapelClass} untuk dicatat presensinya.`);
      return;
    }

    const items: SubjectAttendanceItem[] = mapelStudents.map((s) => {
      const record = mapelStudentAttendance[s.id] || { status: 'Hadir', notes: '' };
      return {
        studentId: s.id,
        studentName: s.name,
        studentNisn: s.nisn,
        nisn: s.nisn,
        status: record.status,
        notes: record.notes,
      };
    });

    const presentCount = items.filter((i) => i.status === 'Hadir').length;
    const sickCount = items.filter((i) => i.status === 'Sakit').length;
    const permitCount = items.filter((i) => i.status === 'Izin').length;
    const absentCount = items.filter((i) => i.status === 'Alpa').length;
    const total = items.length;
    const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

    const newSession: SubjectAttendanceSession = {
      id: `sess-${Date.now()}`,
      subject: mapelSubject,
      className: mapelClass,
      teacherId: session.identifier || 'guru-session',
      teacherName: session.name || 'Guru Mata Pelajaran',
      teacherNip: session.nip || session.identifier || '19780512 200312 2 004',
      meetingNumber: mapelMeetingNumber,
      date: mapelAttendanceDate,
      timeSlot: mapelTimeSlot,
      topic: mapelTopic.trim() || `Pembelajaran Tatap Muka ${mapelSubject} Pertemuan ${mapelMeetingNumber}`,
      attendanceList: items,
      items,
      summary: {
        total,
        hadir: presentCount,
        sakit: sickCount,
        izin: permitCount,
        alpa: absentCount,
        percentage: attendanceRate,
      },
      presentCount,
      sickCount,
      permitCount,
      absentCount,
      attendanceRate,
      createdAt: `${mapelAttendanceDate} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WITA`,
    };

    if (onSaveSubjectAttendanceSession) {
      onSaveSubjectAttendanceSession(newSession);
    } else if (onAddSubjectAttendanceSession) {
      onAddSubjectAttendanceSession(newSession);
    }

    setAttendanceSuccessToast(
      `Presensi Pertemuan Ke-${mapelMeetingNumber} untuk kelas ${mapelClass} (${mapelSubject}) berhasil disimpan dan otomatis masuk ke monitoring Admin Utama!`
    );
    setTimeout(() => setAttendanceSuccessToast(null), 6000);
    setMapelMeetingNumber((prev) => prev + 1);
  };

  // Handler for uploading Teacher Administration Doc
  const handleUploadAdminDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminDocTitle.trim()) {
      alert('Mohon isi judul dokumen administrasi!');
      return;
    }

    const generatedFileName =
      adminDocFileName.trim() ||
      `Bundel_Administrasi_${mapelSubject.replace(/[\/\s]+/g, '_')}_${adminDocTargetClass.replace(/[\/\s]+/g, '_')}_CP_s.d_RPM_2026.pdf`;

    const newDoc: TeacherAdministrationDoc = {
      id: `doc-${Date.now()}`,
      teacherId: session.identifier || 'guru-session',
      teacherName: session.name || 'Guru Mata Pelajaran',
      teacherNip: session.nip || session.identifier || '19780512 200312 2 004',
      subject: mapelSubject,
      targetClass: adminDocTargetClass,
      category: adminDocCategory,
      title: adminDocTitle.trim() || `Bundel Administrasi Lengkap (CP, ATP s/d RPM) - ${mapelSubject}`,
      academicYear: adminDocAcademicYear,
      semester: adminDocSemester,
      fileUrl: '#unduh-bundel-administrasi-pdf',
      fileName: generatedFileName,
      fileSize: adminDocFileSize || '5.8 MB',
      fileType: 'PDF',
      uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Menunggu Verifikasi',
      bundleComponents: adminDocBundleComponents,
      description:
        adminDocDescription.trim() ||
        'Bundel 1 File PDF lengkap: mencakup Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), Prota, Promes, KKTP, sampai RPM Modul Ajar kurikulum merdeka.',
    };

    if (onUploadTeacherAdminDoc) {
      onUploadTeacherAdminDoc(newDoc);
    } else if (onAddTeacherAdminDoc) {
      onAddTeacherAdminDoc(newDoc);
    }
    setShowUploadAdminDocModal(false);
    setAdminDocTitle('');
    setAdminDocDescription('');
    setAdminDocFileName('');
    setAdminDocSuccessToast(
      `Berkas "${newDoc.title}" berhasil diunggah! Berkas telah masuk ke antrean verifikasi Admin Utama (Kepala Sekolah & Tim Kurikulum).`
    );
    setTimeout(() => setAdminDocSuccessToast(null), 6000);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialTitle) return;
    const newMat: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title: newMaterialTitle,
      subject: mapelSubject,
      className: mapelClass,
      teacherName: session.name,
      teacherNip: session.identifier,
      uploadDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      fileType: newMaterialType,
      fileSize: '3.5 MB',
      downloadUrl: '#unduh-materi',
      description: newMaterialDesc || 'Bahan ajar modul kurikulum merdeka SMAK Setia Bakti.',
    };
    onAddStudyMaterial(newMat);
    setNewMaterialTitle('');
    setNewMaterialDesc('');
    setShowAddMaterialModal(false);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsgTitle) return;
    const newAsg: StudentAssignment = {
      id: `asg-${Date.now()}`,
      title: newAsgTitle,
      subject: mapelSubject,
      className: mapelClass,
      teacherName: session.name,
      teacherNip: session.identifier,
      assignedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      dueDate: newAsgDue,
      description: newAsgDesc || 'Kerjakan tugas sesuai panduan dan unggah sebelum batas akhir.',
      maxScore: 100,
    };
    onAddAssignment(newAsg);
    setNewAsgTitle('');
    setNewAsgDesc('');
    setShowAddAssignmentModal(false);
  };

  const handleCreateWaliNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForNote || !noteTitle) return;
    const studentObj = students.find((s) => s.id === selectedStudentForNote);
    const newNote: WaliKelasNote = {
      id: `wn-${Date.now()}`,
      studentId: selectedStudentForNote,
      studentName: studentObj ? studentObj.name : 'Siswa',
      studentNisn: studentObj ? studentObj.nisn : '',
      className: waliClass,
      teacherName: session.name,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: noteCategory,
      title: noteTitle,
      content: noteContent,
      actionRequired: noteAction,
    };
    onAddWaliNote(newNote);
    setNoteTitle('');
    setNoteContent('');
    setNoteAction('');
    setShowAddNoteModal(false);
  };

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;
    onGradeSubmission(gradingSubmission.id, gradeInput, feedbackInput);
    setGradingSubmission(null);
  };

  const handleSendReply = (discId: string) => {
    const text = replyTextMap[discId];
    if (!text || !text.trim()) return;
    onAddDiscussionMessage(discId, text.trim());
    setReplyTextMap({ ...replyTextMap, [discId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Role Subheader Mode Switcher: Wali Kelas vs Guru Mapel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full">
            Dasbor Pendidik Terpadu
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            Pengelolaan Akademik & Bimbingan Kelas
          </h2>
          <p className="text-xs text-slate-500">
            Siswa yang diinput oleh Admin Utama otomatis terdistribusi pada daftar kelas binaan dan mata pelajaran Anda.
          </p>
        </div>

        {/* Dual Mode Switch Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveMode('walikelas')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'walikelas'
                ? 'bg-[#3b1d70] text-white shadow-md'
                : 'text-slate-600 hover:text-purple-900 hover:bg-white/60'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-400" />
            <span>Mode Guru Wali Kelas</span>
          </button>
          <button
            onClick={() => setActiveMode('gurumapel')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeMode === 'gurumapel'
                ? 'bg-[#3b1d70] text-white shadow-md'
                : 'text-slate-600 hover:text-purple-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Mode Guru Mata Pelajaran</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODE 1: GURU WALI KELAS */}
      {/* ========================================================= */}
      {activeMode === 'walikelas' && (
        <div className="space-y-6">
          {/* Class Selector Bar for Wali Kelas */}
          <div className="bg-gradient-to-r from-[#2a1353] to-[#43247d] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-900/80 border border-purple-400/40 flex items-center justify-center text-amber-300 font-black text-lg">
                WK
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">
                    Binaan Kelas Aktif:
                  </span>
                  <span className="bg-amber-400 text-purple-950 text-xs font-black px-2 py-0.5 rounded">
                    {waliClass}
                  </span>
                  <span className="text-xs text-purple-300">• {waliStudents.length} Siswa Terdaftar</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Wali Kelas: {session.name}
                </h3>
              </div>
            </div>

            {/* Class Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-purple-200 whitespace-nowrap">Ganti Kelas:</label>
              <select
                value={waliClass}
                onChange={(e) => setWaliClass(e.target.value)}
                className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg border border-purple-300 shadow-sm focus:outline-none"
              >
                {allClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sub Navigation for Wali Kelas */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            {[
              { id: 'presensi', label: 'Presensi & Kehadiran', icon: CalendarCheck, count: waliStudents.length },
              { id: 'catatan', label: 'Catatan Penting Wali Kelas', icon: Award, count: filteredWaliNotes.length },
              { id: 'izin', label: 'Permohonan Izin Orang Tua', icon: AlertTriangle, count: filteredLeaveRequests.filter((r) => r.status === 'Menunggu Persetujuan').length },
              { id: 'diskusi', label: 'Forum Diskusi Kelas', icon: MessageSquare, count: waliDiscussions.length },
              { id: 'siswa', label: 'Daftar Siswa Binaan', icon: Users, count: waliStudents.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = waliSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setWaliSubTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-900 text-white shadow'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50 hover:text-purple-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-amber-400 text-purple-950 font-bold' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* WALI SUBTAB 1: PRESENSI & KEHADIRAN SISWA */}
          {waliSubTab === 'presensi' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-purple-700" />
                    <span>Rekap Presensi Harian Siswa - Kelas {waliClass}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Pencatatan kehadiran harian tersinkronisasi langsung ke dasbor Orang Tua dan Admin Utama.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Tanggal: <strong className="text-slate-800">{new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</strong>
                  </span>
                  <button
                    onClick={handleSaveAttendance}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan Presensi Hari Ini</span>
                  </button>
                </div>
              </div>

              {attendanceSaved && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Presensi harian siswa kelas {waliClass} berhasil disimpan dan dicatat dalam sistem buku induk kehadiran!</span>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#3b1d70] text-white uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">NISN</th>
                      <th className="px-4 py-3">Nama Lengkap Siswa</th>
                      <th className="px-4 py-3">Rata-rata Presensi</th>
                      <th className="px-4 py-3">Status Hari Ini</th>
                      <th className="px-4 py-3">Keterangan / Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {waliStudents.map((s, idx) => {
                      const currentStatus = attendanceState[s.id] || 'Hadir';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">{s.nisn}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                          <td className="px-4 py-3 font-bold text-emerald-700">{s.attendanceRate}%</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => setAttendanceState({ ...attendanceState, [s.id]: st })}
                                  className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                                    currentStatus === st
                                      ? st === 'Hadir'
                                        ? 'bg-emerald-600 text-white'
                                        : st === 'Sakit'
                                        ? 'bg-amber-600 text-white'
                                        : st === 'Izin'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-rose-600 text-white'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {currentStatus === 'Hadir' ? 'Mengikuti KBM tepat waktu' : `Pemberitahuan ${currentStatus}`}
                          </td>
                        </tr>
                      );
                    })}
                    {waliStudents.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-400">
                          Belum ada siswa di kelas {waliClass}. Siswa yang diinput Admin Utama untuk kelas ini akan otomatis muncul di sini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WALI SUBTAB 2: CATATAN PENTING WALI KELAS */}
          {waliSubTab === 'catatan' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-700" />
                    <span>Catatan Penting Wali Kelas untuk Siswa & Orang Tua</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Catatan perkembangan karakter, prestasi, pengingat, dan arahan belajar yang dapat dilihat langsung oleh siswa dan orang tua masing-masing.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (waliStudents.length > 0) setSelectedStudentForNote(waliStudents[0].id);
                    setShowAddNoteModal(true);
                  }}
                  className="px-3.5 py-2 bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Catatan Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWaliNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-xl border border-slate-200 bg-purple-50/30 space-y-2 hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                          {note.category}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">{note.title}</h5>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{note.date}</span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{note.content}</p>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-600">
                        Siswa: <strong className="text-purple-950">{note.studentName}</strong>
                      </span>
                      {note.actionRequired && (
                        <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Tindak Lanjut: {note.actionRequired}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {filteredWaliNotes.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    Belum ada catatan wali kelas untuk kelas {waliClass}. Klik tombol "Buat Catatan Baru" di atas.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WALI SUBTAB 3: PERMOHONAN IZIN DARI ORANG TUA */}
          {waliSubTab === 'izin' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Verifikasi Pengajuan Izin / Surat Sakit Orang Tua</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tinjau surat izin dan surat dokter yang diajukan orang tua siswa kelas {waliClass}.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {filteredLeaveRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-xl border transition-all ${
                      req.status === 'Disetujui'
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : req.status === 'Ditolak'
                        ? 'border-rose-200 bg-rose-50/30'
                        : 'border-amber-200 bg-amber-50/30'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              req.type === 'Sakit'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {req.type}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {req.studentName} ({req.className})
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Diajukan oleh: <strong>{req.parentName}</strong> ({req.parentPhone}) • Tanggal Pengajuan: {req.requestDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            req.status === 'Disetujui'
                              ? 'bg-emerald-100 text-emerald-800'
                              : req.status === 'Ditolak'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          Status: {req.status}
                        </span>

                        {req.status === 'Menunggu Persetujuan' && (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onReviewLeaveRequest(req.id, 'Disetujui', 'Izin disetujui oleh wali kelas dan tercatat pada presensi.')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Setujui</span>
                            </button>
                            <button
                              onClick={() => onReviewLeaveRequest(req.id, 'Ditolak', 'Mohon konfirmasi kembali ke pihak sekolah.')}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 text-xs space-y-1.5">
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Jangka Waktu:</strong> {req.startDate} s/d {req.endDate} ({req.totalDays} Hari)
                      </p>
                      <p className="text-slate-700">
                        <strong className="text-slate-900">Alasan:</strong> {req.reason}
                      </p>
                      {req.doctorLetterAttached && (
                        <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                          ✓ Surat Keterangan Dokter Terlampir
                        </span>
                      )}
                      {req.reviewNotes && (
                        <p className="text-[11px] text-slate-500 italic mt-1 pt-1 border-t border-slate-200">
                          Catatan Wali Kelas: {req.reviewNotes} ({req.reviewedBy})
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {filteredLeaveRequests.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Tidak ada pengajuan izin orang tua untuk kelas {waliClass}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WALI SUBTAB 4: FORUM DISKUSI KELAS */}
          {waliSubTab === 'diskusi' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-purple-700" />
                    <span>Ruang Komunikasi & Diskusi Kelas Binaan ({waliClass})</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Saluran koordinasi terpusat antara wali kelas dengan seluruh siswa kelas {waliClass}.
                  </p>
                </div>
                <button
                  onClick={() => setShowNewTopicModal(true)}
                  className="px-3.5 py-2 bg-purple-900 hover:bg-purple-950 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Mulai Topik Pengumuman / Diskusi</span>
                </button>
              </div>

              <div className="space-y-4">
                {waliDiscussions.map((disc) => (
                  <div key={disc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                          Pengumuman & Diskusi Wali Kelas
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">{disc.topic}</h5>
                        <p className="text-[11px] text-slate-500">
                          Oleh: <strong className="text-slate-800">{disc.authorName}</strong> • {disc.createdAt}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {disc.content}
                    </p>

                    {/* Replies */}
                    {disc.replies && disc.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-purple-300 space-y-2">
                        {disc.replies.map((rep) => (
                          <div key={rep.id} className="p-2.5 bg-white rounded-lg border border-slate-100 text-xs">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span className="font-bold text-purple-900">{rep.authorName}</span>
                              <span>{rep.createdAt}</span>
                            </div>
                            <p className="text-slate-700">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Balas diskusi kelas ini..."
                        value={replyTextMap[disc.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [disc.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(disc.id);
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(disc.id)}
                        className="px-3 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim</span>
                      </button>
                    </div>
                  </div>
                ))}

                {waliDiscussions.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada topik diskusi untuk kelas {waliClass}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WALI SUBTAB 5: DAFTAR SISWA BINAAN LENGKAP */}
          {waliSubTab === 'siswa' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-700" />
                    <span>Daftar Siswa Binaan Kelas {waliClass}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Siswa terdaftar di kelas ini yang diinput oleh Admin Utama (Total: {waliStudents.length} Siswa).
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#3b1d70] text-white uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">NISN</th>
                      <th className="px-4 py-3">Nama Lengkap</th>
                      <th className="px-4 py-3">L/P</th>
                      <th className="px-4 py-3">Peminatan</th>
                      <th className="px-4 py-3">Orang Tua / Wali</th>
                      <th className="px-4 py-3">Kontak Ortu</th>
                      <th className="px-4 py-3">Nilai Rata-rata</th>
                      <th className="px-4 py-3">Status SPP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {waliStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{s.nisn}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                        <td className="px-4 py-3 font-mono">{s.gender}</td>
                        <td className="px-4 py-3">{s.major}</td>
                        <td className="px-4 py-3">{s.parentName}</td>
                        <td className="px-4 py-3 font-mono text-slate-600">{s.parentPhone}</td>
                        <td className="px-4 py-3 font-black text-purple-900">{s.gpa}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.tuitionStatus === 'Lunas'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.tuitionStatus === 'Beasiswa'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.tuitionStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {waliStudents.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-400">
                          Belum ada siswa di kelas {waliClass}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: GURU MATA PELAJARAN (GURU MAPEL) */}
      {/* ========================================================= */}
      {activeMode === 'gurumapel' && (
        <div className="space-y-6">
          {/* Subject and Class Selector Bar */}
          <div className="bg-gradient-to-r from-[#17325c] to-[#254f8a] text-white p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-sky-900/80 border border-sky-400/40 flex items-center justify-center text-amber-300 font-black text-lg">
                GM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-sky-200">
                    Mata Pelajaran & Kelas:
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded">
                    {mapelSubject}
                  </span>
                  <span className="bg-sky-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded">
                    Kelas {mapelClass}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  Guru Pengampu: {session.name}
                </h3>
              </div>
            </div>

            {/* Selectors for Subject and Class */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label className="text-xs text-sky-200">Mapel:</label>
                <select
                  value={mapelSubject}
                  onChange={(e) => setMapelSubject(e.target.value)}
                  className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg border border-sky-300 shadow-sm focus:outline-none"
                >
                  <option value="Biologi & Bioteknologi">Biologi & Bioteknologi</option>
                  <option value="Fisika Peminatan">Fisika Peminatan</option>
                  <option value="Matematika Peminatan">Matematika Peminatan</option>
                  <option value="Sosiologi & Antropologi Budaya">Sosiologi & Antropologi Budaya</option>
                  <option value="Bahasa & Sastra Inggris">Bahasa & Sastra Inggris</option>
                  <option value="Pendidikan Agama Katolik">Pendidikan Agama Katolik</option>
                  <option value="Informatika & Multimedia">Informatika & Multimedia</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <label className="text-xs text-sky-200">Kelas:</label>
                <select
                  value={mapelClass}
                  onChange={(e) => setMapelClass(e.target.value)}
                  className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg border border-sky-300 shadow-sm focus:outline-none"
                >
                  {allClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      Kelas {cls}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sub Navigation for Guru Mapel */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
            {[
              { id: 'materi', label: 'Bahan Ajar & Modul', icon: BookOpen, count: filteredMaterials.length },
              { id: 'tugas', label: 'Tugas & Evaluasi', icon: FileText, count: filteredAssignments.length },
              { id: 'penilaian', label: 'Pengumpulan & Penilaian Tugas', icon: Award, count: filteredSubmissions.length },
              { id: 'absen', label: 'Presensi & Absen Mapel', icon: CalendarCheck, count: currentSubjectSessions.length },
              { id: 'administrasi', label: 'Upload Administrasi Guru', icon: FolderCheck, count: filteredMyAdminDocs.length },
              { id: 'diskusi', label: 'Forum Tanya Jawab Mapel', icon: MessageSquare, count: mapelDiscussions.length },
              { id: 'siswa', label: 'Daftar Siswa Kelas Mapel', icon: Users, count: mapelStudents.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = mapelSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMapelSubTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-900 text-white shadow'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* MAPEL SUBTAB 1: BAHAN AJAR & MODUL */}
          {mapelSubTab === 'materi' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-700" />
                    <span>Bahan Ajar & Modul Pembelajaran ({mapelSubject} - {mapelClass})</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Materi yang Anda unggah di sini akan langsung dapat diunduh oleh siswa di dasbor mereka masing-masing.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddMaterialModal(true)}
                  className="px-3.5 py-2 bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Unggah Bahan Ajar Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMaterials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-4 rounded-xl border border-slate-200 bg-sky-50/20 space-y-3 hover:border-sky-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {mat.fileType}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 leading-snug">{mat.title}</h5>
                          <span className="text-[11px] text-slate-400">
                            {mat.subject} • {mat.className} • {mat.fileSize}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">{mat.uploadDate}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{mat.description}</p>

                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">
                        Pengunggah: <strong>{mat.teacherName}</strong>
                      </span>
                      <button
                        onClick={() => alert(`Mengunduh file materi: ${mat.title}`)}
                        className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh Dokumen</span>
                      </button>
                    </div>
                  </div>
                ))}

                {filteredMaterials.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    Belum ada bahan ajar untuk {mapelSubject} di kelas {mapelClass}. Klik tombol "Unggah Bahan Ajar Baru".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MAPEL SUBTAB 2: TUGAS & EVALUASI */}
          {mapelSubTab === 'tugas' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-700" />
                    <span>Daftar Tugas & Evaluasi Siswa ({mapelSubject} - {mapelClass})</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Buat instruksi penugasan yang otomatis tampil di dasbor siswa kelas {mapelClass}.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAssignmentModal(true)}
                  className="px-3.5 py-2 bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Tugas Baru</span>
                </button>
              </div>

              <div className="space-y-3">
                {filteredAssignments.map((asg) => (
                  <div key={asg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h5 className="text-sm font-bold text-slate-900">{asg.title}</h5>
                        <p className="text-xs text-slate-500">
                          Mapel: {asg.subject} • Kelas: {asg.className} • Dibuat: {asg.assignedDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                          Batas Waktu: {asg.dueDate}
                        </span>
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                          Skor Maks: {asg.maxScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {asg.description}
                    </p>
                  </div>
                ))}

                {filteredAssignments.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada penugasan untuk {mapelSubject} di kelas {mapelClass}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MAPEL SUBTAB 3: PENGUMPULAN & PENILAIAN TUGAS */}
          {mapelSubTab === 'penilaian' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-sky-700" />
                    <span>Hasil Pengumpulan Tugas Siswa & Penilaian</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Periksa jawaban tugas yang dikirim siswa, berikan nilai, serta umpan balik koreksi.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className={`p-4 rounded-xl border transition-all ${
                      sub.status === 'Sudah Dinilai'
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-200/60">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{sub.studentName}</span>
                          <span className="text-xs font-mono text-slate-500">({sub.studentNisn})</span>
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">
                            {sub.className}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Tugas: <strong>{sub.assignmentTitle}</strong> • Dikumpulkan: {sub.submittedAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {sub.status === 'Sudah Dinilai' ? (
                          <div className="text-right">
                            <span className="text-xs text-slate-500 block">Nilai Diberikan:</span>
                            <span className="text-xl font-black text-emerald-700">{sub.grade} / 100</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setGradingSubmission(sub);
                              setGradeInput(sub.grade || 90);
                              setFeedbackInput(sub.feedback || '');
                            }}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
                          >
                            Beri Nilai & Feedback
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 text-xs space-y-2">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <strong className="text-slate-800 block mb-1">Catatan / Jawaban Siswa:</strong>
                        <p className="text-slate-700 leading-relaxed">{sub.answerText}</p>
                        {sub.fileName && (
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="text-sky-700 font-semibold flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5" />
                              {sub.fileName} ({sub.fileSize || 'Dokumen'})
                            </span>
                            <button
                              onClick={() => alert(`Mengunduh berkas tugas: ${sub.fileName}`)}
                              className="text-purple-700 hover:underline font-bold cursor-pointer"
                            >
                              Unduh Berkas Jawaban
                            </button>
                          </div>
                        )}
                      </div>

                      {sub.feedback && (
                        <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-900 text-xs">
                          <strong>Umpan Balik Guru ({sub.gradedBy}):</strong> {sub.feedback}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada pengumpulan tugas dari siswa kelas {mapelClass}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MAPEL SUBTAB: PRESENSI & ABSEN MAPEL */}
          {/* ========================================================= */}
          {mapelSubTab === 'absen' && (
            <div className="space-y-6">
              {/* Success Notification Banner */}
              {attendanceSuccessToast && (
                <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-start justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-200" />
                    <div>
                      <p className="text-xs font-bold">{attendanceSuccessToast}</p>
                      <p className="text-[11px] text-emerald-100">
                        Admin Utama dan Wali Kelas dapat langsung melihat rekapitulasi data presensi ini di dasbor mereka.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAttendanceSuccessToast(null)}
                    className="text-white/80 hover:text-white text-xs font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Main Attendance Input Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                {/* Header with Title & Quick Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <CalendarCheck className="w-5 h-5 text-sky-700" />
                      <span>Input Presensi Tatap Muka: {mapelSubject}</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Kelas: <strong className="text-slate-800 font-mono">{mapelClass}</strong> • Pengajar:{' '}
                      <strong className="text-slate-800">{session.name}</strong> • Data tersimpan otomatis masuk ke Admin Utama.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSetAllPresent}
                      className="px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Set Semua Hadir</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapelStudentAttendance({})}
                      className="px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reset Pilihan
                    </button>
                  </div>
                </div>

                {/* Session Meta Form: Pertemuan, Tanggal, Jam, Pokok Bahasan */}
                <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pertemuan Ke-</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={mapelMeetingNumber}
                      onChange={(e) => setMapelMeetingNumber(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tanggal KBM</label>
                    <input
                      type="date"
                      value={mapelAttendanceDate}
                      onChange={(e) => setMapelAttendanceDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Waktu / Jam Pelajaran</label>
                    <select
                      value={mapelTimeSlot}
                      onChange={(e) => setMapelTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                    >
                      <option value="07.30 - 09.00 WITA">07.30 - 09.00 WITA (Jam 1-2)</option>
                      <option value="09.15 - 10.45 WITA">09.15 - 10.45 WITA (Jam 3-4)</option>
                      <option value="11.00 - 12.30 WITA">11.00 - 12.30 WITA (Jam 5-6)</option>
                      <option value="13.00 - 14.30 WITA">13.00 - 14.30 WITA (Jam 7-8)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pokok Bahasan / Materi KBM</label>
                    <input
                      type="text"
                      placeholder="Contoh: Praktikum Mikroskopik Sel Tumbuhan"
                      value={mapelTopic}
                      onChange={(e) => setMapelTopic(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                    />
                  </div>
                </div>

                {/* Realtime Attendance Stats Summary */}
                {(() => {
                  const items = mapelStudents.map((s) => mapelStudentAttendance[s.id]?.status || 'Hadir');
                  const pCount = items.filter((st) => st === 'Hadir').length;
                  const sCount = items.filter((st) => st === 'Sakit').length;
                  const iCount = items.filter((st) => st === 'Izin').length;
                  const aCount = items.filter((st) => st === 'Alpa').length;
                  const total = mapelStudents.length;
                  const rate = total > 0 ? Math.round((pCount / total) * 100) : 100;

                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Hadir</p>
                          <p className="text-xl font-black text-emerald-700">{pCount}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-600">{rate}%</span>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Sakit</p>
                        <p className="text-xl font-black text-amber-700">{sCount}</p>
                      </div>

                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-800">Izin</p>
                        <p className="text-xl font-black text-blue-700">{iCount}</p>
                      </div>

                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Alpa</p>
                        <p className="text-xl font-black text-rose-700">{aCount}</p>
                      </div>

                      <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Total Siswa</p>
                        <p className="text-xl font-black text-slate-800">{total}</p>
                      </div>
                    </div>
                  );
                })()}

                {/* Student Attendance List Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#17325c] text-white uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3 w-12 text-center">No</th>
                        <th className="px-4 py-3 w-28">NISN</th>
                        <th className="px-4 py-3">Nama Lengkap Siswa</th>
                        <th className="px-4 py-3 w-16 text-center">L/P</th>
                        <th className="px-4 py-3 w-64 text-center">Status Kehadiran</th>
                        <th className="px-4 py-3">Keterangan / Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {mapelStudents.map((student, idx) => {
                        const currentStatus = mapelStudentAttendance[student.id]?.status || 'Hadir';
                        const currentNotes = mapelStudentAttendance[student.id]?.notes || '';

                        return (
                          <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-center text-slate-400 font-mono font-medium">{idx + 1}</td>
                            <td className="px-4 py-3 font-mono font-bold text-slate-700">{student.nisn}</td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-900">{student.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">Kelas: {student.className}</p>
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-slate-600">{student.gender}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1.5">
                                {[
                                  { label: 'Hadir', key: 'Hadir', bg: 'bg-emerald-600 text-white', hover: 'hover:bg-emerald-50 text-emerald-800 border-emerald-300' },
                                  { label: 'Sakit', key: 'Sakit', bg: 'bg-amber-500 text-white', hover: 'hover:bg-amber-50 text-amber-800 border-amber-300' },
                                  { label: 'Izin', key: 'Izin', bg: 'bg-blue-600 text-white', hover: 'hover:bg-blue-50 text-blue-800 border-blue-300' },
                                  { label: 'Alpa', key: 'Alpa', bg: 'bg-rose-600 text-white', hover: 'hover:bg-rose-50 text-rose-800 border-rose-300' },
                                ].map((opt) => {
                                  const isSelected = currentStatus === opt.key;
                                  return (
                                    <button
                                      key={opt.key}
                                      type="button"
                                      onClick={() =>
                                        handleUpdateStudentAttendance(student.id, opt.key as any)
                                      }
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
                                        isSelected
                                          ? `${opt.bg} shadow-sm border-transparent`
                                          : `bg-white border-slate-200 text-slate-600 ${opt.hover}`
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="text"
                                placeholder="Catatan siswa (opsional)..."
                                value={currentNotes}
                                onChange={(e) =>
                                  handleUpdateStudentAttendance(student.id, currentStatus, e.target.value)
                                }
                                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-600"
                              />
                            </td>
                          </tr>
                        );
                      })}

                      {mapelStudents.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-400">
                            Belum ada data siswa untuk kelas {mapelClass}. Silakan pilih rombel kelas yang lain atau pastikan Admin telah menginput siswa.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Save Attendance Button */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <p className="text-xs text-slate-500">
                    Sesi presensi yang Anda simpan akan langsung tercatat dalam arsip akademik dan dapat dipantau oleh Kepala Sekolah di Dasbor Admin.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSaveSubjectAttendanceSession()}
                    disabled={mapelStudents.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-[#17325c] hover:bg-[#0f2343] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4 text-sky-300" />
                    <span>Simpan Presensi Pertemuan Ini</span>
                  </button>
                </div>
              </div>

              {/* Historical Attendance Sessions for this Subject & Class */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sky-700" />
                      <span>Riwayat Pertemuan & Presensi Sebelumnya ({mapelSubject} - {mapelClass})</span>
                    </h4>
                    <p className="text-xs text-slate-500">
                      Daftar rekaman presensi tatap muka yang sudah tersimpan untuk kelas dan mapel ini.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-mono">
                    {currentSubjectSessions.length} Sesi Terdata
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentSubjectSessions.map((sessionItem) => (
                    <div
                      key={sessionItem.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 hover:border-sky-300 transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-sky-900 text-white font-bold text-[10px] rounded-md">
                              Pertemuan {sessionItem.meetingNumber}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">{sessionItem.date}</span>
                            <span className="text-xs text-slate-400">• {sessionItem.timeSlot}</span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-xs mt-1.5">{sessionItem.topic}</h5>
                        </div>
                        <span
                          className={`text-xs font-black px-2 py-1 rounded-lg ${
                            (sessionItem.attendanceRate ?? sessionItem.summary?.percentage ?? 100) >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {sessionItem.attendanceRate ?? sessionItem.summary?.percentage ?? 100}% Hadir
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-xs">
                        <div className="flex items-center gap-3 text-[11px] font-medium">
                          <span className="text-emerald-700 font-bold">Hadir: {sessionItem.presentCount ?? sessionItem.summary?.hadir ?? 0}</span>
                          <span className="text-amber-700 font-bold">Sakit: {sessionItem.sickCount ?? sessionItem.summary?.sakit ?? 0}</span>
                          <span className="text-blue-700 font-bold">Izin: {sessionItem.permitCount ?? sessionItem.summary?.izin ?? 0}</span>
                          <span className="text-rose-700 font-bold">Alpa: {sessionItem.absentCount ?? sessionItem.summary?.alpa ?? 0}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedHistoricalSession(sessionItem)}
                          className="text-sky-700 hover:text-sky-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Rincian Siswa</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {currentSubjectSessions.length === 0 && (
                    <div className="col-span-2 text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Belum ada sesi presensi tersimpan untuk {mapelSubject} di kelas {mapelClass}. Silakan input presensi pertemuan di atas.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MAPEL SUBTAB: UPLOAD ADMINISTRASI GURU */}
          {/* ========================================================= */}
          {mapelSubTab === 'administrasi' && (
            <div className="space-y-6">
              {/* Success Notification Banner */}
              {adminDocSuccessToast && (
                <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-start justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-200" />
                    <div>
                      <p className="text-xs font-bold">{adminDocSuccessToast}</p>
                      <p className="text-[11px] text-emerald-100">
                        Admin Utama (Kepala Sekolah & Tim Kurikulum) dapat meninjau, menilai skor supervisi, dan menyetujui dokumen ini di tab Administrasi Guru.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAdminDocSuccessToast(null)}
                    className="text-white/80 hover:text-white text-xs font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Header Info Banner */}
              <div className="bg-gradient-to-r from-[#17325c] to-sky-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded uppercase tracking-wider">
                      Kurikulum Merdeka
                    </span>
                    <span className="text-sky-200 text-xs">SMAK Setia Bakti Ruteng</span>
                  </div>
                  <h3 className="text-lg font-bold">Administrasi Pembelajaran & Perangkat Ajar Guru</h3>
                  <p className="text-xs text-sky-100 max-w-2xl leading-relaxed">
                    Unggah dokumen Modul Ajar (RPP Merdeka), Prota, Promes, ATP, KKTP, Jurnal, dan Kisi-kisi. Berkas yang diunggah akan otomatis masuk ke antrean verifikasi Admin Utama untuk ditelaah dan dinilai supervisinya.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowUploadAdminDocModal(true)}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Unggah Administrasi Baru</span>
                </button>
              </div>

              {/* Statistics Cards */}
              {(() => {
                const totalDocs = filteredMyAdminDocs.length;
                const approvedDocs = filteredMyAdminDocs.filter((d) => d.status === 'Disetujui').length;
                const pendingDocs = filteredMyAdminDocs.filter((d) => d.status === 'Menunggu Verifikasi').length;
                const revisionDocs = filteredMyAdminDocs.filter((d) => d.status === 'Perlu Perbaikan').length;

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                        <FolderCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500">Total Berkas</p>
                        <p className="text-lg font-black text-slate-800">{totalDocs}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-emerald-700">Disetujui</p>
                        <p className="text-lg font-black text-emerald-800">{approvedDocs}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-amber-700">Menunggu Verifikasi</p>
                        <p className="text-lg font-black text-amber-800">{pendingDocs}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-rose-200 shadow-sm flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-rose-700">Perlu Perbaikan</p>
                        <p className="text-lg font-black text-rose-800">{revisionDocs}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Filters & Search Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex-1 w-full relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari judul perangkat ajar, kategori, atau mata pelajaran..."
                    value={adminSearchQuery}
                    onChange={(e) => setAdminSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={adminFilterCategory}
                      onChange={(e) => setAdminFilterCategory(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 text-xs focus:outline-none"
                    >
                      <option value="Semua">Semua Kategori Perangkat</option>
                      <option value="Modul Ajar / RPP Merdeka">Modul Ajar / RPP Merdeka</option>
                      <option value="Program Tahunan (Prota)">Program Tahunan (Prota)</option>
                      <option value="Program Semester (Promes)">Program Semester (Promes)</option>
                      <option value="Alur Tujuan Pembelajaran (ATP)">Alur Tujuan Pembelajaran (ATP)</option>
                      <option value="KKTP / Kriteria Ketuntasan">KKTP / Kriteria Ketuntasan</option>
                      <option value="Jurnal Mengajar Harian">Jurnal Mengajar Harian</option>
                      <option value="Kisi-kisi & Asesmen Sumatif">Kisi-kisi & Asesmen Sumatif</option>
                      <option value="Buku Kerja Guru">Buku Kerja Guru</option>
                      <option value="Silabus & Modul Suplemen">Silabus & Modul Suplemen</option>
                    </select>
                  </div>

                  <select
                    value={adminFilterStatus}
                    onChange={(e) => setAdminFilterStatus(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 text-xs focus:outline-none"
                  >
                    <option value="Semua">Semua Status Verifikasi</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Disetujui">Disetujui (Lolos Supervisi)</option>
                    <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                  </select>
                </div>
              </div>

              {/* Documents Table / Grid */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-700" />
                    <span>Daftar Berkas Administrasi & Status Verifikasi Admin</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Menampilkan {filteredMyAdminDocs.length} berkas
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#17325c] text-white uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Dokumen Administrasi</th>
                        <th className="px-4 py-3">Mapel & Kelas</th>
                        <th className="px-4 py-3">Tahun & Semester</th>
                        <th className="px-4 py-3">Diunggah</th>
                        <th className="px-4 py-3">Status Verifikasi Admin</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredMyAdminDocs.map((doc) => {
                        return (
                          <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                            {/* Dokumen & Kategori */}
                            <td className="px-4 py-3">
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center flex-shrink-0 font-bold">
                                  {doc.fileType === 'PDF' && <FileText className="w-4 h-4 text-rose-600" />}
                                  {doc.fileType === 'DOCX' && <FileText className="w-4 h-4 text-blue-600" />}
                                  {doc.fileType === 'XLSX' && <FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
                                  {doc.fileType === 'ZIP' && <FolderCheck className="w-4 h-4 text-amber-600" />}
                                </div>
                                <div>
                                  <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded mb-1">
                                    {doc.category}
                                  </span>
                                  <p className="font-bold text-slate-900">{doc.title}</p>
                                  <p className="text-[11px] text-slate-500 font-mono">
                                    {doc.fileName} • {doc.fileSize}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Mapel & Kelas */}
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-800">{doc.subject}</p>
                              <span className="text-[10px] font-mono text-sky-800 bg-sky-50 px-1.5 py-0.5 rounded">
                                {doc.targetClass}
                              </span>
                            </td>

                            {/* Tahun & Semester */}
                            <td className="px-4 py-3 font-mono text-slate-700">
                              <p className="font-bold">{doc.academicYear}</p>
                              <p className="text-[10px] text-slate-500">{doc.semester}</p>
                            </td>

                            {/* Tanggal Upload */}
                            <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                              {doc.uploadedAt}
                            </td>

                            {/* Status Verifikasi Admin Utama */}
                            <td className="px-4 py-3">
                              {doc.status === 'Disetujui' && (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Disetujui</span>
                                    {doc.supervisionScore && (
                                      <span className="ml-1 bg-emerald-700 text-white px-1.5 py-0.2 rounded text-[10px] font-mono">
                                        Skor: {doc.supervisionScore}
                                      </span>
                                    )}
                                  </span>
                                  {doc.verifiedBy && (
                                    <p className="text-[10px] text-slate-500">
                                      Oleh: <span className="font-medium text-slate-700">{doc.verifiedBy}</span>
                                    </p>
                                  )}
                                </div>
                              )}

                              {doc.status === 'Menunggu Verifikasi' && (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-bold text-[11px] rounded-lg">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Menunggu Verifikasi</span>
                                  </span>
                                  <p className="text-[10px] text-slate-400">Dalam antrean telaah Admin Utama</p>
                                </div>
                              )}

                              {doc.status === 'Perlu Perbaikan' && (
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-100 text-rose-800 font-bold text-[11px] rounded-lg">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Perlu Perbaikan</span>
                                  </span>
                                  {doc.feedbackNotes && (
                                    <p className="text-[10px] text-rose-700 line-clamp-1 italic">
                                      "{doc.feedbackNotes}"
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Aksi */}
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSelectedAdminDocDetail(doc)}
                                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                                  title="Lihat Detail & Catatan Supervisi"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Detail</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => alert(`Mengunduh berkas administrasi guru: ${doc.fileName}`)}
                                  className="p-1.5 text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                                  title="Unduh Berkas"
                                >
                                  <Download className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredMyAdminDocs.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-slate-400">
                            Tidak ada berkas administrasi yang cocok dengan kriteria pencarian. Klik "+ Unggah Administrasi Baru" untuk mengirim perangkat ajar ke Admin Utama.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {mapelSubTab === 'diskusi' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-sky-700" />
                    <span>Forum Tanya Jawab Pelajaran: {mapelSubject} ({mapelClass})</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Ruang diskusi interaktif untuk menjawab pertanyaan siswa terkait materi atau tugas yang diberikan.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {mapelDiscussions.map((disc) => (
                  <div key={disc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                          Tanya Jawab: {disc.subject}
                        </span>
                        <h5 className="text-sm font-bold text-slate-900 mt-1">{disc.topic}</h5>
                        <p className="text-[11px] text-slate-500">
                          Oleh Siswa: <strong className="text-slate-800">{disc.authorName}</strong> • {disc.createdAt}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {disc.content}
                    </p>

                    {/* Replies */}
                    {disc.replies && disc.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-sky-400 space-y-2">
                        {disc.replies.map((rep) => (
                          <div key={rep.id} className="p-2.5 bg-white rounded-lg border border-slate-100 text-xs">
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                              <span className="font-bold text-sky-900">{rep.authorName}</span>
                              <span>{rep.createdAt}</span>
                            </div>
                            <p className="text-slate-700">{rep.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Tulis jawaban atau bimbingan guru di sini..."
                        value={replyTextMap[disc.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [disc.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSendReply(disc.id);
                        }}
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-600 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(disc.id)}
                        className="px-3 py-2 bg-sky-900 hover:bg-sky-950 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Kirim Jawaban</span>
                      </button>
                    </div>
                  </div>
                ))}

                {mapelDiscussions.length === 0 && (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    Belum ada pertanyaan dari siswa untuk mata pelajaran {mapelSubject} di kelas {mapelClass}.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MAPEL SUBTAB 5: DAFTAR SISWA KELAS MAPEL */}
          {mapelSubTab === 'siswa' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-700" />
                    <span>Daftar Siswa Peserta Kelas: {mapelClass}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Seluruh siswa di kelas ini yang diinput oleh Admin Utama (Total: {mapelStudents.length} Siswa).
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#17325c] text-white uppercase text-[10px]">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">NISN</th>
                      <th className="px-4 py-3">Nama Siswa</th>
                      <th className="px-4 py-3">L/P</th>
                      <th className="px-4 py-3">Tingkat Kehadiran</th>
                      <th className="px-4 py-3">Nilai Rata-rata</th>
                      <th className="px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {mapelStudents.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{s.nisn}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                        <td className="px-4 py-3 font-mono">{s.gender}</td>
                        <td className="px-4 py-3 font-bold text-emerald-700">{s.attendanceRate}%</td>
                        <td className="px-4 py-3 font-black text-sky-900">{s.gpa}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => alert(`Buka riwayat portofolio nilai ${s.name} pada mapel ${mapelSubject}`)}
                            className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
                          >
                            Lihat Nilai
                          </button>
                        </td>
                      </tr>
                    ))}
                    {mapelStudents.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">
                          Belum ada siswa di kelas {mapelClass}. Siswa yang diinput Admin Utama otomatis masuk ke kelas ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: UNGGAH BAHAN AJAR BARU */}
      {/* ========================================================= */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#17325c] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-300" />
                <span>Unggah Bahan Ajar & Modul Pelajaran</span>
              </h3>
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateMaterial} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran & Kelas</label>
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 font-semibold">
                  {mapelSubject} • Kelas {mapelClass}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Bahan Ajar / Modul</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Bab 4: Struktur & Reaksi Fotosintesis..."
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Format Berkas</label>
                  <select
                    value={newMaterialType}
                    onChange={(e) => setNewMaterialType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="PDF">PDF (Dokumen Bacaan)</option>
                    <option value="PPTX">PPTX (Slide Presentasi)</option>
                    <option value="DOCX">DOCX (Latihan/Word)</option>
                    <option value="VIDEO">VIDEO (Tautan Pembelajaran)</option>
                    <option value="ZIP">ZIP (Kumpulan Berkas)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Dokumen (Simulasi)</label>
                  <input
                    type="file"
                    className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-sky-50 file:text-sky-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi & Instruksi Belajar</label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan petunjuk pembelajaran atau bab yang harus dipelajari siswa..."
                  value={newMaterialDesc}
                  onChange={(e) => setNewMaterialDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-bold shadow"
                >
                  Simpan & Publikasikan ke Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: BUAT TUGAS BARU */}
      {/* ========================================================= */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#17325c] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-300" />
                <span>Buat Penugasan Baru untuk Siswa</span>
              </h3>
              <button
                onClick={() => setShowAddAssignmentModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran & Kelas</label>
                <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 font-semibold">
                  {mapelSubject} • Kelas {mapelClass}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Tugas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tugas Proyek 2: Analisis Ekosistem Perairan Danau Ranamese..."
                  value={newAsgTitle}
                  onChange={(e) => setNewAsgTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Batas Waktu Pengumpulan (Deadline)</label>
                <input
                  type="date"
                  required
                  value={newAsgDue}
                  onChange={(e) => setNewAsgDue(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Petunjuk & Soal Penugasan</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Uraikan instruksi tugas, format jawaban yang diminta, serta rubrik penilaian..."
                  value={newAsgDesc}
                  onChange={(e) => setNewAsgDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-bold shadow"
                >
                  Tugaskan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: BUAT CATATAN WALI KELAS */}
      {/* ========================================================= */}
      {showAddNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#3b1d70] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span>Buat Catatan Penting Wali Kelas</span>
              </h3>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateWaliNote} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Siswa Kelas {waliClass}</label>
                <select
                  required
                  value={selectedStudentForNote}
                  onChange={(e) => setSelectedStudentForNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-semibold"
                >
                  {waliStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (NISN: {s.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Catatan</label>
                  <select
                    value={noteCategory}
                    onChange={(e) => setNoteCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Bimbingan Karakter">Bimbingan Karakter</option>
                    <option value="Apresiasi Prestasi">Apresiasi Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Kedisiplinan">Kedisiplinan</option>
                    <option value="Konsultasi">Konsultasi</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rekomendasi / Tindak Lanjut</label>
                  <input
                    type="text"
                    placeholder="Contoh: Dicalonkan duta sains / Konseling BK"
                    value={noteAction}
                    onChange={(e) => setNoteAction(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Catatan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Apresiasi Peningkatan Prestasi Belajar Semester Ini"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Catatan Penting</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan catatan evaluasi, motivasi, atau pesan yang ditujukan kepada siswa dan orang tua..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-lg font-bold shadow"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: BERI NILAI & FEEDBACK PENGUMPULAN TUGAS */}
      {/* ========================================================= */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-300" />
                <span>Penilaian Tugas: {gradingSubmission.studentName}</span>
              </h3>
              <button
                onClick={() => setGradingSubmission(null)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitGrade} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-slate-800 font-semibold">{gradingSubmission.assignmentTitle}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Dikumpulkan oleh: {gradingSubmission.studentName} ({gradingSubmission.className})
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nilai Angka (Skala 0 - 100)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeInput}
                  onChange={(e) => setGradeInput(Number(e.target.value))}
                  className="w-32 px-3 py-2 text-base font-black border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Umpan Balik & Catatan Guru untuk Siswa</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan apresiasi, koreksi pemahaman konsep, dan saran perbaikan untuk siswa..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Simpan Nilai & Kirim ke Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TOPIK DISKUSI BARU WALI KELAS */}
      {/* ========================================================= */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#3b1d70] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Buat Pengumuman / Diskusi Kelas {waliClass}</span>
              </h3>
              <button
                onClick={() => setShowNewTopicModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newTopicTitle || !newTopicContent) return;
                const newDisc: ClassDiscussion = {
                  id: `disc-${Date.now()}`,
                  type: 'walikelas',
                  topic: newTopicTitle,
                  className: waliClass,
                  authorRole: 'guru',
                  authorName: `${session.name} (Wali Kelas)`,
                  createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
                  content: newTopicContent,
                  replies: [],
                };
                onNewDiscussionTopic(newDisc);
                setNewTopicTitle('');
                setNewTopicContent('');
                setShowNewTopicModal(false);
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Topik / Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengumuman Jadwal KBM dan Gladi Misa Hari Santo Pelindung"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Pesan Diskusi</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan isi pengumuman atau instruksi bimbingan untuk seluruh siswa kelas..."
                  value={newTopicContent}
                  onChange={(e) => setNewTopicContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewTopicModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-lg font-bold shadow"
                >
                  Kirim ke Forum Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: UNGGAH DOKUMEN ADMINISTRASI GURU BARU */}
      {/* ========================================================= */}
      {showUploadAdminDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-[#17325c] text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Unggah Administrasi & Perangkat Ajar Guru</span>
                </h3>
                <p className="text-[11px] text-sky-200 mt-0.5">
                  Berkas otomatis masuk ke antrean verifikasi Admin Utama (Kepala Sekolah & Tim Kurikulum).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadAdminDocModal(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadAdminDoc} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Mapel & Pengunggah Notice */}
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-sky-700 uppercase font-bold tracking-wider">Mata Pelajaran:</span>
                  <p className="font-bold text-slate-900">{mapelSubject}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-sky-700 uppercase font-bold tracking-wider">Guru Pengunggah:</span>
                  <p className="font-bold text-slate-900">{session.name}</p>
                </div>
              </div>

              {/* Kategori Berkas */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kategori Perangkat Ajar <span className="text-rose-500">*</span>
                </label>
                <select
                  value={adminDocCategory}
                  onChange={(e) => setAdminDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                >
                  <option value="Bundel Administrasi Lengkap (CP, ATP hingga RPM)">
                    Bundel Administrasi Lengkap (CP, ATP, Prota, Promes, KKTP hingga RPM) - Wajib 1 File PDF
                  </option>
                  <option value="Modul Ajar / RPP Merdeka">Modul Ajar / RPP Merdeka</option>
                  <option value="Program Tahunan (Prota)">Program Tahunan (Prota)</option>
                  <option value="Program Semester (Promes)">Program Semester (Promes)</option>
                  <option value="Alur Tujuan Pembelajaran (ATP)">Alur Tujuan Pembelajaran (ATP)</option>
                  <option value="KKTP / Kriteria Ketuntasan">KKTP / Kriteria Ketuntasan</option>
                  <option value="Jurnal Mengajar Harian">Jurnal Mengajar Harian</option>
                  <option value="Kisi-kisi & Asesmen Sumatif">Kisi-kisi & Asesmen Sumatif</option>
                  <option value="Buku Kerja Guru">Buku Kerja Guru</option>
                  <option value="Silabus & Modul Suplemen">Silabus & Modul Suplemen</option>
                </select>
              </div>

              {/* Judul Dokumen */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Dokumen Perangkat <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={`Contoh: Bundel Administrasi ${mapelSubject} (CP, ATP s/d RPM)...`}
                  value={adminDocTitle}
                  onChange={(e) => setAdminDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-600"
                />
              </div>

              {/* Grid Tingkat / Rombel Sasaran & Tahun Ajaran */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rombel / Sasaran</label>
                  <select
                    value={adminDocTargetClass}
                    onChange={(e) => setAdminDocTargetClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="Fase E (Kelas X)">Fase E (Kelas X)</option>
                    <option value="Fase F (Kelas XI)">Fase F (Kelas XI)</option>
                    <option value="Fase F (Kelas XII)">Fase F (Kelas XII)</option>
                    <option value="Kelas X-MIPA 1">Kelas X-MIPA 1</option>
                    <option value="Kelas X-MIPA 2">Kelas X-MIPA 2</option>
                    <option value="Kelas XI-MIPA 1">Kelas XI-MIPA 1</option>
                    <option value="Semua Rombel Mapel">Semua Rombel Mapel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Pelajaran</label>
                  <input
                    type="text"
                    value={adminDocAcademicYear}
                    onChange={(e) => setAdminDocAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={adminDocSemester}
                    onChange={(e) => setAdminDocSemester(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="Ganjil">Semester Ganjil</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>

              {/* Unggah 1 File PDF Terpadu (CP s/d RPM) */}
              <TeacherAdminPdfUpload
                fileName={adminDocFileName}
                fileSize={adminDocFileSize}
                bundleComponents={adminDocBundleComponents}
                subjectName={mapelSubject}
                classNameStr={adminDocTargetClass}
                onFileSelect={(name, size) => {
                  setAdminDocFileName(name);
                  setAdminDocFileSize(size);
                  if (!adminDocTitle) {
                    setAdminDocTitle(`Bundel Administrasi ${mapelSubject} (CP s/d RPM) - ${adminDocTargetClass}`);
                  }
                }}
                onBundleComponentsChange={(comps) => setAdminDocBundleComponents(comps)}
                onUseSampleBundle={() => {
                  setAdminDocFileName(`Bundel_Administrasi_${mapelSubject.replace(/[\/\s]+/g, '_')}_CP_sd_RPM_2026.pdf`);
                  setAdminDocFileSize('5.8 MB');
                  if (!adminDocTitle) {
                    setAdminDocTitle(`Bundel Administrasi ${mapelSubject} (CP s/d RPM) - ${adminDocTargetClass}`);
                  }
                }}
              />

              {/* Deskripsi / Catatan Pengantar */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Pengantar / Uraian Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan catatan pengantar untuk Tim Kurikulum & Kepala Sekolah saat memverifikasi berkas..."
                  value={adminDocDescription}
                  onChange={(e) => setAdminDocDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadAdminDocModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#17325c] hover:bg-[#0f2343] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kirim ke Admin Utama</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: DETAIL & CATATAN SUPERVISI DOKUMEN */}
      {/* ========================================================= */}
      {selectedAdminDocDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#17325c] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400">
                  {selectedAdminDocDetail.category}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                  {selectedAdminDocDetail.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAdminDocDetail(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Status Banner */}
              {selectedAdminDocDetail.status === 'Disetujui' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Status: Disetujui & Terverifikasi
                    </span>
                    {selectedAdminDocDetail.supervisionScore && (
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono font-black text-xs rounded-lg">
                        Nilai: {selectedAdminDocDetail.supervisionScore} / 100
                      </span>
                    )}
                  </div>
                  {selectedAdminDocDetail.verifiedBy && (
                    <p className="text-slate-600">
                      Diverifikasi oleh: <strong className="text-slate-900">{selectedAdminDocDetail.verifiedBy}</strong>
                      {selectedAdminDocDetail.verifiedAt && ` pada ${selectedAdminDocDetail.verifiedAt}`}
                    </p>
                  )}
                  {selectedAdminDocDetail.feedbackNotes && (
                    <div className="p-2.5 bg-white rounded-lg border border-emerald-100 text-slate-700 italic">
                      "{selectedAdminDocDetail.feedbackNotes}"
                    </div>
                  )}
                </div>
              )}

              {selectedAdminDocDetail.status === 'Menunggu Verifikasi' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-800 text-xs">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Status: Menunggu Verifikasi Admin Utama
                  </span>
                  <p className="text-slate-600">
                    Berkas ini sedang berada dalam antrean penelaahan Kepala Sekolah dan Tim Kurikulum SMAK Setia Bakti Ruteng.
                  </p>
                </div>
              )}

              {selectedAdminDocDetail.status === 'Perlu Perbaikan' && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-2">
                  <span className="inline-flex items-center gap-1 font-bold text-rose-800 text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Status: Perlu Perbaikan / Revisi
                  </span>
                  {selectedAdminDocDetail.feedbackNotes && (
                    <div className="p-2.5 bg-white rounded-lg border border-rose-100 text-rose-800">
                      <strong>Catatan Revisi dari Admin:</strong>
                      <p className="mt-1 italic">{selectedAdminDocDetail.feedbackNotes}</p>
                    </div>
                  )}
                  <p className="text-slate-600 text-[11px]">
                    Silakan perbaiki dokumen sesuai catatan di atas dan unggah kembali berkas perbaikan melalui tombol "+ Unggah Administrasi Baru".
                  </p>
                </div>
              )}

              {/* Document Meta Info Grid */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Mata Pelajaran</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedAdminDocDetail.subject}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Rombel / Sasaran</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedAdminDocDetail.targetClass}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Tahun Pelajaran & Sem.</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    {selectedAdminDocDetail.academicYear} • {selectedAdminDocDetail.semester}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Ukuran & Format</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">
                    {selectedAdminDocDetail.fileSize} • {selectedAdminDocDetail.fileType}
                  </p>
                </div>
              </div>

              {/* Komponen Bundel Terpadu 1 File PDF */}
              {selectedAdminDocDetail.bundleComponents && selectedAdminDocDetail.bundleComponents.length > 0 && (
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                  <span className="text-[11px] font-bold text-sky-950 block mb-1.5">
                    Instrumen Terpadu dalam 1 Berkas PDF (CP hingga RPM):
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedAdminDocDetail.bundleComponents.map((comp, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-sky-900 bg-white px-2 py-1 rounded border border-sky-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="truncate font-medium">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
                  Deskripsi / Keterangan Dokumen
                </span>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedAdminDocDetail.description}
                </p>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh berkas: ${selectedAdminDocDetail.fileName}`)}
                  className="px-4 py-2 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh {selectedAdminDocDetail.fileName}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAdminDocDetail(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: RINCIAN SESI PRESENSI SEBELUMNYA */}
      {/* ========================================================= */}
      {selectedHistoricalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="bg-[#17325c] text-white p-5 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-bold text-[10px] rounded uppercase">
                  Pertemuan {selectedHistoricalSession.meetingNumber}
                </span>
                <h3 className="text-sm font-bold text-white mt-1">
                  Rincian Presensi: {selectedHistoricalSession.subject} ({selectedHistoricalSession.className})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHistoricalSession(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* Meta information */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Tanggal & Waktu</span>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedHistoricalSession.date}</p>
                  <p className="text-[11px] text-slate-500">{selectedHistoricalSession.timeSlot}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Pokok Bahasan / Materi</span>
                  <p className="font-semibold text-slate-900 mt-0.5">{selectedHistoricalSession.topic}</p>
                </div>
              </div>

              {/* Attendance Stats */}
              <div className="grid grid-cols-5 gap-2">
                <div className="p-2.5 bg-emerald-50 rounded-lg text-center border border-emerald-200">
                  <span className="text-[10px] text-emerald-800 font-bold uppercase block">Hadir</span>
                  <span className="text-base font-black text-emerald-700">{selectedHistoricalSession.presentCount ?? selectedHistoricalSession.summary?.hadir ?? 0}</span>
                </div>
                <div className="p-2.5 bg-amber-50 rounded-lg text-center border border-amber-200">
                  <span className="text-[10px] text-amber-800 font-bold uppercase block">Sakit</span>
                  <span className="text-base font-black text-amber-700">{selectedHistoricalSession.sickCount ?? selectedHistoricalSession.summary?.sakit ?? 0}</span>
                </div>
                <div className="p-2.5 bg-blue-50 rounded-lg text-center border border-blue-200">
                  <span className="text-[10px] text-blue-800 font-bold uppercase block">Izin</span>
                  <span className="text-base font-black text-blue-700">{selectedHistoricalSession.permitCount ?? selectedHistoricalSession.summary?.izin ?? 0}</span>
                </div>
                <div className="p-2.5 bg-rose-50 rounded-lg text-center border border-rose-200">
                  <span className="text-[10px] text-rose-800 font-bold uppercase block">Alpa</span>
                  <span className="text-base font-black text-rose-700">{selectedHistoricalSession.absentCount ?? selectedHistoricalSession.summary?.alpa ?? 0}</span>
                </div>
                <div className="p-2.5 bg-sky-900 text-white rounded-lg text-center">
                  <span className="text-[10px] text-sky-200 font-bold uppercase block">Kehadiran</span>
                  <span className="text-base font-black">{selectedHistoricalSession.attendanceRate ?? selectedHistoricalSession.summary?.percentage ?? 100}%</span>
                </div>
              </div>

              {/* Student Items List */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px]">
                    <tr>
                      <th className="px-3 py-2 w-10">No</th>
                      <th className="px-3 py-2">Nama Siswa</th>
                      <th className="px-3 py-2 w-24 text-center">Status</th>
                      <th className="px-3 py-2">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(selectedHistoricalSession.items || selectedHistoricalSession.attendanceList || []).map((item, idx) => (
                      <tr key={item.studentId} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="px-3 py-2 font-bold text-slate-900">{item.studentName}</td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'Hadir'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.status === 'Sakit'
                                ? 'bg-amber-100 text-amber-800'
                                : item.status === 'Izin'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-500 italic text-[11px]">
                          {item.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedHistoricalSession(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
