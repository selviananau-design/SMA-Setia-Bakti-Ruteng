import React, { useState } from 'react';
import {
  BookOpen,
  Users,
  FileText,
  Upload,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Send,
  Plus,
  Award,
  AlertTriangle,
  Download,
  Filter,
  FolderCheck,
  Eye,
  Calendar,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Student,
  StudyMaterial,
  StudentAssignment,
  AssignmentSubmission,
  ClassDiscussion,
  UserSession,
  TeacherAdministrationDoc,
  TeacherAdminCategory,
  SubjectAttendanceSession,
  SubjectAttendanceItem,
} from '../../types';
import {
  INITIAL_TEACHER_ADMIN_DOCS,
  INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
} from '../../data/mockData';

interface GuruMapelDashboardProps {
  session: UserSession;
  students: Student[];
  studyMaterials: StudyMaterial[];
  assignments: StudentAssignment[];
  submissions: AssignmentSubmission[];
  discussions: ClassDiscussion[];
  teacherAdminDocs?: TeacherAdministrationDoc[];
  subjectAttendanceSessions?: SubjectAttendanceSession[];
  onAddStudyMaterial: (material: StudyMaterial) => void;
  onAddAssignment: (assignment: StudentAssignment) => void;
  onGradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  onAddDiscussionMessage: (discussionId: string, replyContent: string) => void;
  onNewDiscussionTopic: (discussion: ClassDiscussion) => void;
  onUploadTeacherAdminDoc?: (doc: TeacherAdministrationDoc) => void;
  onSaveSubjectAttendanceSession?: (session: SubjectAttendanceSession) => void;
}

export const GuruMapelDashboard: React.FC<GuruMapelDashboardProps> = ({
  session,
  students,
  studyMaterials,
  assignments,
  submissions,
  discussions,
  teacherAdminDocs = INITIAL_TEACHER_ADMIN_DOCS,
  subjectAttendanceSessions = INITIAL_SUBJECT_ATTENDANCE_SESSIONS,
  onAddStudyMaterial,
  onAddAssignment,
  onGradeSubmission,
  onAddDiscussionMessage,
  onNewDiscussionTopic,
  onUploadTeacherAdminDoc,
  onSaveSubjectAttendanceSession,
}) => {
  const [mapelSubject, setMapelSubject] = useState<string>(
    session.subject || 'Biologi & Bioteknologi'
  );
  const [mapelClass, setMapelClass] = useState<string>(session.className || 'X-MIPA 1');
  const [mapelSubTab, setMapelSubTab] = useState<
    'materi' | 'tugas' | 'penilaian' | 'presensi_mapel' | 'administrasi' | 'diskusi' | 'siswa'
  >('materi');

  // Modals
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeInput, setGradeInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  // Material Form
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialType, setNewMaterialType] = useState<'PDF' | 'PPTX' | 'DOCX' | 'VIDEO' | 'ZIP'>('PDF');
  const [newMaterialDesc, setNewMaterialDesc] = useState('');

  // Assignment Form
  const [newAsgTitle, setNewAsgTitle] = useState('');
  const [newAsgDue, setNewAsgDue] = useState('2026-10-05');
  const [newAsgDesc, setNewAsgDesc] = useState('');

  // Discussion Form
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');

  // Subject Attendance Form State
  const [mapelMeetingNumber, setMapelMeetingNumber] = useState<number>(() => {
    const existingForSubjectAndClass = subjectAttendanceSessions.filter(
      (s) => s.subject === mapelSubject && s.className === mapelClass
    );
    return existingForSubjectAndClass.length > 0
      ? Math.max(...existingForSubjectAndClass.map((s) => s.meetingNumber)) + 1
      : 1;
  });
  const [mapelAttendanceDate, setMapelAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [mapelTimeSlot, setMapelTimeSlot] = useState<string>('07:30 - 09:00 WITA');
  const [mapelTopic, setMapelTopic] = useState<string>('');
  const [mapelStudentAttendance, setMapelStudentAttendance] = useState<
    Record<string, { status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'; notes: string }>
  >({});
  const [attendanceSuccessToast, setAttendanceSuccessToast] = useState<string | null>(null);
  const [selectedHistoricalSession, setSelectedHistoricalSession] = useState<SubjectAttendanceSession | null>(null);

  // Teacher Administration Document States
  const [showUploadAdminDocModal, setShowUploadAdminDocModal] = useState(false);
  const [selectedAdminDocDetail, setSelectedAdminDocDetail] = useState<TeacherAdministrationDoc | null>(null);
  const [adminDocFilterCategory, setAdminDocFilterCategory] = useState<string>('Semua');
  const [adminDocFilterStatus, setAdminDocFilterStatus] = useState<string>('Semua');
  const [adminDocSuccessToast, setAdminDocSuccessToast] = useState<string | null>(null);

  // Form State for Uploading Admin Doc
  const [adminDocCategory, setAdminDocCategory] = useState<TeacherAdminCategory>('Modul Ajar / RPP Merdeka');
  const [adminDocTitle, setAdminDocTitle] = useState('');
  const [adminDocTargetClass, setAdminDocTargetClass] = useState(mapelClass);
  const [adminDocAcademicYear, setAdminDocAcademicYear] = useState('2026/2027');
  const [adminDocSemester, setAdminDocSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [adminDocFileType, setAdminDocFileType] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');
  const [adminDocFileName, setAdminDocFileName] = useState('');
  const [adminDocDescription, setAdminDocDescription] = useState('');

  // Class & subject lists
  const allClasses = Array.from(new Set(students.map((s) => s.className))).sort();
  const allSubjects = [
    'Biologi & Bioteknologi',
    'Fisika Terapan',
    'Kimia Organik',
    'Matematika Tingkat Lanjut',
    'Pendidikan Agama Katolik & Budi Pekerti',
    'Bahasa Indonesia & Sastra NTT',
    'Bahasa Inggris & TOEFL Prep',
    'Sejarah Kebudayaan Manggarai',
    'Informatika & Literasi Digital',
    'Seni Budaya Musik Liturgi',
  ];

  // Filtered lists
  const mapelStudents = students.filter((s) => s.className === mapelClass);
  const filteredMaterials = studyMaterials.filter(
    (m) => m.className === mapelClass && m.subject.toLowerCase().includes(mapelSubject.toLowerCase())
  );
  const filteredAssignments = assignments.filter(
    (a) => a.className === mapelClass && a.subject.toLowerCase().includes(mapelSubject.toLowerCase())
  );
  const filteredSubmissions = submissions.filter((s) => s.className === mapelClass);
  const mapelDiscussions = discussions.filter(
    (d) =>
      d.type === 'mapel' &&
      d.className === mapelClass &&
      (!d.subject || d.subject.toLowerCase().includes(mapelSubject.toLowerCase()))
  );

  // Attendance sessions filtered
  const filteredAttendanceSessions = subjectAttendanceSessions.filter(
    (s) => s.subject === mapelSubject && s.className === mapelClass
  );

  // Teacher admin docs filtered
  const filteredAdminDocs = teacherAdminDocs.filter((doc) => {
    const matchSubject = doc.subject.toLowerCase().includes(mapelSubject.toLowerCase()) || doc.subject === 'Semua';
    const matchCat = adminDocFilterCategory === 'Semua' || doc.category === adminDocFilterCategory;
    const matchStat = adminDocFilterStatus === 'Semua' || doc.status === adminDocFilterStatus;
    return matchSubject && matchCat && matchStat;
  });

  const handleSetAllPresent = () => {
    const updated: Record<string, { status: 'Hadir'; notes: string }> = {};
    mapelStudents.forEach((s) => {
      updated[s.id] = { status: 'Hadir', notes: '' };
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
      teacherNip: session.nip || session.identifier || '198504122010011012',
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
    }

    setAttendanceSuccessToast(
      `Presensi Pertemuan Ke-${mapelMeetingNumber} kelas ${mapelClass} (${mapelSubject}) berhasil disimpan dan tersinkronisasi ke Admin Utama!`
    );
    setTimeout(() => setAttendanceSuccessToast(null), 6000);
    setMapelMeetingNumber((prev) => prev + 1);
  };

  const handleUploadAdminDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminDocTitle.trim()) {
      alert('Mohon isi judul dokumen administrasi!');
      return;
    }

    const cleanCategorySlug = adminDocCategory.replace(/[\/\s]+/g, '_');
    const generatedFileName =
      adminDocFileName.trim() ||
      `${cleanCategorySlug}_${mapelClass}_${adminDocSemester}_2026.pdf`;

    const newDoc: TeacherAdministrationDoc = {
      id: `doc-${Date.now()}`,
      teacherId: session.identifier || 'guru-session',
      teacherName: session.name || 'Guru Mata Pelajaran',
      teacherNip: session.nip || session.identifier || '198504122010011012',
      subject: mapelSubject,
      targetClass: adminDocTargetClass,
      category: adminDocCategory,
      title: adminDocTitle.trim(),
      academicYear: adminDocAcademicYear,
      semester: adminDocSemester,
      fileUrl: '#unduh-administrasi',
      fileName: generatedFileName,
      fileSize: '2.4 MB',
      fileType: adminDocFileType,
      uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'Menunggu Verifikasi',
      description:
        adminDocDescription.trim() ||
        'Dokumen perangkat ajar Kurikulum Merdeka diajukan untuk supervisi akademik dan verifikasi Admin Utama.',
    };

    if (onUploadTeacherAdminDoc) {
      onUploadTeacherAdminDoc(newDoc);
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
      {/* Guru Mapel Exclusive Header Banner */}
      <div className="bg-gradient-to-r from-[#0e2a47] via-[#17325c] to-[#254f8a] text-white p-6 rounded-2xl shadow-lg border border-sky-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-950/80 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 font-black text-2xl shadow-inner">
            <BookOpen className="w-8 h-8 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-sm">
                Dasbor Eksklusif Guru Mata Pelajaran
              </span>
              <span className="bg-sky-900/90 text-sky-200 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-sky-700/50">
                NIP: {session.identifier || session.nip || '198504122010011012'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              Guru Pengampu: {session.name}
            </h2>
            <p className="text-xs text-sky-200 mt-0.5">
              Kelola bahan ajar modul kurikulum merdeka, tugas & evaluasi, presensi tatap muka KBM, serta perangkat ajar administrasi guru.
            </p>
          </div>
        </div>

        {/* Subject and Target Class Selectors */}
        <div className="bg-sky-950/60 p-3 rounded-xl border border-sky-400/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 backdrop-blur-sm self-stretch md:self-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-200 block mb-1">Mata Pelajaran:</span>
            <select
              value={mapelSubject}
              onChange={(e) => setMapelSubject(e.target.value)}
              className="w-full sm:w-auto bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-300 shadow-sm focus:outline-none cursor-pointer"
            >
              {allSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-sky-200 block mb-1">Rombel Kelas:</span>
            <select
              value={mapelClass}
              onChange={(e) => {
                setMapelClass(e.target.value);
                setAdminDocTargetClass(e.target.value);
              }}
              className="w-full sm:w-auto bg-white text-slate-900 text-xs font-bold px-3 py-1.5 rounded-lg border border-sky-300 shadow-sm focus:outline-none cursor-pointer"
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

      {/* 5 Summary Metric Cards for Guru Mapel */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Modul Bahan Ajar</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{filteredMaterials.length} Modul</div>
          <span className="text-[11px] text-sky-700 font-semibold mt-1 block">Kelas {mapelClass}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tugas Terjadwal</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{filteredAssignments.length} Tugas</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Aktif Dikumpulkan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Jawaban Tugas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{filteredSubmissions.length} Berkas</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            {filteredSubmissions.filter((s) => s.status === 'Sudah Dinilai').length} Dinilai
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Presensi Mapel</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-900 mt-2">{filteredAttendanceSessions.length} Sesi</div>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">Tatap Muka KBM</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-all col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Administrasi Guru</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
              <FolderCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-900 mt-2">{filteredAdminDocs.length} Dokumen</div>
          <span className="text-[11px] text-indigo-700 font-semibold mt-1 block">Supervisi Akademik</span>
        </div>
      </div>

      {/* Sub Navigation for Guru Mapel */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'materi', label: 'Bahan Ajar & Modul', icon: BookOpen, count: filteredMaterials.length },
          { id: 'tugas', label: 'Tugas & Evaluasi', icon: FileText, count: filteredAssignments.length },
          { id: 'penilaian', label: 'Penilaian Siswa', icon: Award, count: filteredSubmissions.length },
          { id: 'presensi_mapel', label: 'Presensi Absen Mapel', icon: CalendarCheck, count: filteredAttendanceSessions.length },
          { id: 'administrasi', label: 'Upload Administrasi Guru', icon: FolderCheck, count: filteredAdminDocs.length },
          { id: 'diskusi', label: 'Tanya Jawab Mapel', icon: MessageSquare, count: mapelDiscussions.length },
          { id: 'siswa', label: 'Siswa Peserta Mapel', icon: Users, count: mapelStudents.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mapelSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMapelSubTab(tab.id as any)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#17325c] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-sky-50 hover:text-sky-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: BAHAN AJAR & MODUL PELAJARAN */}
      {mapelSubTab === 'materi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-700" />
                <span>Bahan Ajar & Modul Kurikulum Merdeka - {mapelSubject}</span>
              </h4>
              <p className="text-xs text-slate-500">
                Materi ajar yang diunggah otomatis dapat diakses dan diunduh oleh siswa kelas {mapelClass}.
              </p>
            </div>
            <button
              onClick={() => setShowAddMaterialModal(true)}
              className="px-3.5 py-2 bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>+ Unggah Bahan Ajar Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-xl border border-slate-200 bg-sky-50/20 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono">
                      {mat.fileType} • {mat.fileSize}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{mat.uploadDate}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 mt-2">{mat.title}</h5>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mat.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Sasaran: Kelas {mat.className}</span>
                  <button
                    onClick={() => alert(`Mengunduh berkas: ${mat.title} (${mat.fileType})`)}
                    className="text-sky-700 hover:text-sky-900 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Berkas</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="col-span-2 text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Belum ada bahan ajar untuk {mapelSubject} di kelas {mapelClass}. Klik tombol "+ Unggah Bahan Ajar Baru" di atas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PENUGASAN & EVALUASI BELAJAR */}
      {mapelSubTab === 'tugas' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Daftar Tugas Terstruktur & Evaluasi - {mapelSubject}</span>
              </h4>
              <p className="text-xs text-slate-500">
                Tugas yang diterbitkan akan muncul di dasbor Siswa kelas {mapelClass} beserta batas waktu pengumpulannya.
              </p>
            </div>
            <button
              onClick={() => setShowAddAssignmentModal(true)}
              className="px-3.5 py-2 bg-sky-800 hover:bg-sky-900 text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Penugasan Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredAssignments.map((asg) => (
              <div key={asg.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-slate-900">{asg.title}</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Deadline: {asg.dueDate}</span>
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-900">
                      Maks: {asg.maxScore} Poin
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">{asg.description}</p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Diterbitkan: {asg.assignedDate} • Guru: {asg.teacherName}</span>
                  <button
                    onClick={() => setMapelSubTab('penilaian')}
                    className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
                  >
                    Lihat Hasil Pengumpulan Siswa
                  </button>
                </div>
              </div>
            ))}

            {filteredAssignments.length === 0 && (
              <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Belum ada penugasan untuk kelas {mapelClass}. Klik tombol "+ Buat Penugasan Baru" di atas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: PENGUMPULAN & PENILAIAN TUGAS */}
      {mapelSubTab === 'penilaian' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-sky-700" />
                <span>Hasil Pengumpulan Tugas Siswa & Penilaian</span>
              </h4>
              <p className="text-xs text-slate-500">
                Periksa jawaban tugas yang dikirim siswa, berikan nilai numerik (0-100), serta umpan balik koreksi.
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

      {/* SUBTAB 4: PRESENSI & ABSEN MAPEL PER PERTEMUAN */}
      {mapelSubTab === 'presensi_mapel' && (
        <div className="space-y-6">
          {attendanceSuccessToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="font-bold block">Presensi Berhasil Dicatat & Tersinkronisasi!</strong>
                <span>{attendanceSuccessToast}</span>
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 tracking-wider">
                    Presensi Tatap Muka KBM
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {mapelSubject} • Kelas {mapelClass}
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-sky-700" />
                  <span>Input Presensi Pertemuan Ke-{mapelMeetingNumber}</span>
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Catat kehadiran siswa secara detail per jam tatap muka. Data tersinkronisasi otomatis dengan monitoring Admin Utama.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSetAllPresent}
                  className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Set Semua Hadir
                </button>
                <button
                  type="button"
                  onClick={handleSaveSubjectAttendanceSession}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Presensi Pertemuan Ini</span>
                </button>
              </div>
            </div>

            {/* Session Metadata Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 p-4 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Pertemuan Ke-</label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={mapelMeetingNumber}
                  onChange={(e) => setMapelMeetingNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  value={mapelAttendanceDate}
                  onChange={(e) => setMapelAttendanceDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jam Pembelajaran (WITA)</label>
                <select
                  value={mapelTimeSlot}
                  onChange={(e) => setMapelTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                >
                  <option value="07:30 - 09:00 WITA">Jam 1-2 (07:30 - 09:00 WITA)</option>
                  <option value="09:15 - 10:45 WITA">Jam 3-4 (09:15 - 10:45 WITA)</option>
                  <option value="11:00 - 12:30 WITA">Jam 5-6 (11:00 - 12:30 WITA)</option>
                  <option value="13:00 - 14:30 WITA">Jam 7-8 (13:00 - 14:30 WITA)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Topik / Materi Pembelajaran</label>
                <input
                  type="text"
                  placeholder="Contoh: Praktikum Isolasi DNA Tumbuhan..."
                  value={mapelTopic}
                  onChange={(e) => setMapelTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Student Attendance List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#17325c] text-white uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">NISN</th>
                    <th className="px-4 py-3">Nama Lengkap Siswa</th>
                    <th className="px-4 py-3">Status Kehadiran</th>
                    <th className="px-4 py-3">Catatan / Keterangan Pembelajaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {mapelStudents.map((s, idx) => {
                    const currentRecord = mapelStudentAttendance[s.id] || { status: 'Hadir', notes: '' };
                    return (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">{s.nisn}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{s.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {(['Hadir', 'Sakit', 'Izin', 'Alpa'] as const).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => handleUpdateStudentAttendance(s.id, st)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                                  currentRecord.status === st
                                    ? st === 'Hadir'
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : st === 'Sakit'
                                      ? 'bg-amber-600 text-white shadow-sm'
                                      : st === 'Izin'
                                      ? 'bg-blue-600 text-white shadow-sm'
                                      : 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {st}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            placeholder="Catatan keaktifan / tugas..."
                            value={currentRecord.notes}
                            onChange={(e) => handleUpdateStudentAttendance(s.id, currentRecord.status, e.target.value)}
                            className="w-full max-w-xs px-2.5 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-sky-500"
                          />
                        </td>
                      </tr>
                    );
                  })}
                  {mapelStudents.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400">
                        Belum ada siswa di kelas {mapelClass}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historical Sessions Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-700" />
              <span>Riwayat Sesi Presensi {mapelSubject} - Kelas {mapelClass} ({filteredAttendanceSessions.length} Pertemuan)</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAttendanceSessions.map((sess) => (
                <div
                  key={sess.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-sky-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-sky-900 bg-sky-100 px-2 py-0.5 rounded">
                      Pertemuan Ke-{sess.meetingNumber}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{sess.date}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{sess.topic}</h5>
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200">
                    <span className="text-emerald-700 font-bold">
                      Hadir: {sess.presentCount || sess.summary?.hadir || 0} Siswa ({sess.attendanceRate || sess.summary?.percentage || 0}%)
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedHistoricalSession(sess)}
                      className="text-sky-700 hover:text-sky-900 font-bold underline cursor-pointer"
                    >
                      Rincian
                    </button>
                  </div>
                </div>
              ))}

              {filteredAttendanceSessions.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  Belum ada riwayat sesi presensi untuk mata pelajaran ini di kelas {mapelClass}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: UPLOAD ADMINISTRASI GURU & PERANGKAT AJAR */}
      {mapelSubTab === 'administrasi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          {adminDocSuccessToast && (
            <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <strong className="font-bold block">Dokumen Berhasil Diunggah!</strong>
                <span>{adminDocSuccessToast}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 tracking-wider">
                  Supervisi Akademik Pendidik
                </span>
                <span className="text-xs text-slate-500 font-mono">Tahun Ajaran 2026/2027</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                <FolderCheck className="w-5 h-5 text-indigo-700" />
                <span>Unggah & Kelola Administrasi Perangkat Mengajar Guru</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Unggah dokumen Kurikulum Merdeka (Modul Ajar/RPP, Prota, Promes, ATP, KKTP, Jurnal Mengajar) untuk diverifikasi dan dinilai oleh Kepala Sekolah & Tim Kurikulum.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowUploadAdminDocModal(true)}
              className="px-4 py-2.5 bg-indigo-800 hover:bg-indigo-900 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              <span>+ Unggah Dokumen Administrasi</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-slate-700">Filter Kategori:</span>
              <select
                value={adminDocFilterCategory}
                onChange={(e) => setAdminDocFilterCategory(e.target.value)}
                className="bg-white px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="Semua">Semua Kategori Perangkat</option>
                <option value="Modul Ajar / RPP Merdeka">Modul Ajar / RPP</option>
                <option value="Program Tahunan (Prota)">Program Tahunan (Prota)</option>
                <option value="Program Semester (Promes)">Program Semester (Promes)</option>
                <option value="Alur Tujuan Pembelajaran (ATP)">Alur Tujuan Pembelajaran (ATP)</option>
                <option value="Jurnal Mengajar Harian">Jurnal Mengajar Harian</option>
                <option value="Kriteria Ketercapaian (KKTP)">Kriteria Ketercapaian (KKTP)</option>
                <option value="Kisi-kisi & Rubrik Asesmen">Kisi-kisi & Rubrik Asesmen</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Status Supervisi:</span>
              <select
                value={adminDocFilterStatus}
                onChange={(e) => setAdminDocFilterStatus(e.target.value)}
                className="bg-white px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Disetujui">Disetujui</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
              </select>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAdminDocs.map((doc) => (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  doc.status === 'Disetujui'
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : doc.status === 'Perlu Perbaikan'
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-amber-200 bg-amber-50/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white border border-slate-200 font-mono text-slate-800">
                      {doc.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        doc.status === 'Disetujui'
                          ? 'bg-emerald-100 text-emerald-800'
                          : doc.status === 'Perlu Perbaikan'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2">{doc.title}</h5>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{doc.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Target: {doc.targetClass}</span>
                    <span>{doc.uploadedAt}</span>
                  </div>

                  {doc.score !== undefined && (
                    <div className="flex items-center justify-between text-[11px] bg-white/70 p-1.5 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-700">Skor Supervisi:</span>
                      <span className="font-black text-emerald-700 text-xs">{doc.score} / 100</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedAdminDocDetail(doc)}
                      className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Rincian</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Mengunduh berkas administrasi: ${doc.fileName}`)}
                      className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Berkas</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredAdminDocs.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Belum ada dokumen administrasi yang sesuai dengan filter. Klik "+ Unggah Dokumen Administrasi" untuk menambahkan dokumen baru.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 6: TANYA JAWAB & DISKUSI MAPEL */}
      {mapelSubTab === 'diskusi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-700" />
                <span>Ruang Konsultasi & Diskusi Mapel: {mapelSubject}</span>
              </h4>
              <p className="text-xs text-slate-500">
                Pertanyaan dari siswa mengenai materi pelajaran atau penugasan di kelas {mapelClass}.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {mapelDiscussions.map((disc) => (
              <div key={disc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      Mata Pelajaran: {disc.subject || mapelSubject}
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

      {/* SUBTAB 7: DAFTAR SISWA KELAS MAPEL */}
      {mapelSubTab === 'siswa' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-700" />
                <span>Daftar Siswa Peserta Kelas: {mapelClass} ({mapelSubject})</span>
              </h4>
              <p className="text-xs text-slate-500">
                Siswa terdaftar di kelas ini (Total: {mapelStudents.length} Siswa).
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
                  </tr>
                ))}
                {mapelStudents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400">
                      Belum ada siswa di kelas {mapelClass}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: UNGGAH BAHAN AJAR BARU */}
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
                className="text-white/80 hover:text-white p-1 cursor-pointer"
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
                  className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  Simpan & Publikasikan ke Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BUAT TUGAS BARU */}
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
                className="text-white/80 hover:text-white p-1 cursor-pointer"
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
                  placeholder="Contoh: Tugas Mandiri: Analisis Sintesis Protein & Enzim..."
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
                  className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  Tugaskan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BERI NILAI & FEEDBACK */}
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
                className="text-white/80 hover:text-white p-1 cursor-pointer"
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
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  Simpan Nilai & Kirim ke Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UNGGAH ADMINISTRASI GURU BARU */}
      {showUploadAdminDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0e2a47] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-sky-300" />
                <span>Unggah Berkas Administrasi Mengajar Guru</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadAdminDocModal(false)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUploadAdminDoc} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    readOnly
                    value={mapelSubject}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rombel Target</label>
                  <select
                    value={adminDocTargetClass}
                    onChange={(e) => setAdminDocTargetClass(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none"
                  >
                    {allClasses.map((c) => (
                      <option key={c} value={c}>
                        Kelas {c}
                      </option>
                    ))}
                    <option value="Semua Kelas">Semua Kelas Binaan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Perangkat Administrasi</label>
                <select
                  value={adminDocCategory}
                  onChange={(e) => setAdminDocCategory(e.target.value as TeacherAdminCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-semibold text-slate-900"
                >
                  <option value="Modul Ajar / RPP Merdeka">Modul Ajar / RPP Kurikulum Merdeka</option>
                  <option value="Program Tahunan (Prota)">Program Tahunan (Prota)</option>
                  <option value="Program Semester (Promes)">Program Semester (Promes)</option>
                  <option value="Alur Tujuan Pembelajaran (ATP)">Alur Tujuan Pembelajaran (ATP)</option>
                  <option value="Kriteria Ketercapaian (KKTP)">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)</option>
                  <option value="Jurnal Mengajar Harian">Jurnal Mengajar Harian</option>
                  <option value="Kisi-kisi & Rubrik Asesmen">Kisi-kisi & Rubrik Asesmen Sumatif/Formatif</option>
                  <option value="Silabus Pembelajaran">Silabus Pembelajaran</option>
                  <option value="Buku Kerja Guru">Buku Kerja Guru & Refleksi KBM</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Lengkap Dokumen</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Modul Ajar Biologi Fase E Bab Ekosistem Kelas X..."
                  value={adminDocTitle}
                  onChange={(e) => setAdminDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={adminDocAcademicYear}
                    onChange={(e) => setAdminDocAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={adminDocSemester}
                    onChange={(e) => setAdminDocSemester(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Format Berkas</label>
                  <select
                    value={adminDocFileType}
                    onChange={(e) => setAdminDocFileType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="PDF">PDF (.pdf)</option>
                    <option value="DOCX">Word (.docx)</option>
                    <option value="XLSX">Excel (.xlsx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pilih Berkas Dokumen (Simulasi)</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAdminDocFileName(file.name);
                  }}
                  className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-indigo-50 file:text-indigo-800 file:font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan / Catatan untuk Verifikator</label>
                <textarea
                  rows={3}
                  placeholder="Uraikan ringkasan materi, capaian pembelajaran, atau pengantar untuk Kepala Sekolah..."
                  value={adminDocDescription}
                  onChange={(e) => setAdminDocDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowUploadAdminDocModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-800 hover:bg-indigo-900 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  Unggah & Ajukan Supervisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RINCIAN DOKUMEN ADMINISTRASI */}
      {selectedAdminDocDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#0e2a47] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-sky-300" />
                <span>Rincian Supervisi Dokumen Administrasi</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAdminDocDetail(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono">
                  {selectedAdminDocDetail.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2">{selectedAdminDocDetail.title}</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Diunggah: {selectedAdminDocDetail.uploadedAt} • Pengampu: {selectedAdminDocDetail.teacherName}
                </p>
              </div>

              {selectedAdminDocDetail.status === 'Disetujui' && (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Status: Disetujui (Terverifikasi)
                    </span>
                    {selectedAdminDocDetail.score && (
                      <span className="font-black text-emerald-800 text-sm">
                        Nilai: {selectedAdminDocDetail.score} / 100
                      </span>
                    )}
                  </div>
                  {selectedAdminDocDetail.feedbackNotes && (
                    <p className="text-slate-700 italic">"{selectedAdminDocDetail.feedbackNotes}"</p>
                  )}
                </div>
              )}

              {selectedAdminDocDetail.status === 'Menunggu Verifikasi' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    Status: Menunggu Verifikasi Admin Utama
                  </span>
                  <p className="text-slate-600 mt-1">
                    Dokumen ini sedang menunggu penelaahan Kepala Sekolah dan Tim Kurikulum SMAK Setia Bakti.
                  </p>
                </div>
              )}

              {selectedAdminDocDetail.status === 'Perlu Perbaikan' && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 space-y-1.5">
                  <span className="font-bold text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Status: Perlu Perbaikan / Revisi
                  </span>
                  {selectedAdminDocDetail.feedbackNotes && (
                    <p className="text-rose-900 italic">Catatan: {selectedAdminDocDetail.feedbackNotes}</p>
                  )}
                </div>
              )}

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 font-bold block">Sasaran:</span>
                  <span className="font-semibold text-slate-800">{selectedAdminDocDetail.targetClass}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Tahun / Semester:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedAdminDocDetail.academicYear} ({selectedAdminDocDetail.semester})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Format / Ukuran:</span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedAdminDocDetail.fileType} ({selectedAdminDocDetail.fileSize})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Nama Berkas:</span>
                  <span className="font-semibold text-slate-800 font-mono truncate block">
                    {selectedAdminDocDetail.fileName}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => alert(`Mengunduh berkas: ${selectedAdminDocDetail.fileName}`)}
                  className="px-4 py-2 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen</span>
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

      {/* MODAL: RINCIAN SESI PRESENSI SEBELUMNYA */}
      {selectedHistoricalSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="bg-[#17325c] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-amber-300" />
                <span>Rincian Presensi: Pertemuan Ke-{selectedHistoricalSession.meetingNumber}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedHistoricalSession(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500 font-bold block">Mata Pelajaran:</span>
                  <span className="font-bold text-slate-900">{selectedHistoricalSession.subject}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Kelas / Rombel:</span>
                  <span className="font-bold text-slate-900">Kelas {selectedHistoricalSession.className}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Tanggal & Jam:</span>
                  <span className="font-mono text-slate-800">{selectedHistoricalSession.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold block">Tingkat Kehadiran:</span>
                  <span className="font-black text-emerald-700 text-xs">
                    {selectedHistoricalSession.attendanceRate || selectedHistoricalSession.summary?.percentage}%
                  </span>
                </div>
              </div>

              <div>
                <strong className="text-slate-800 block mb-1">Materi / Topik Pembelajaran:</strong>
                <p className="p-2.5 bg-sky-50/50 rounded-lg border border-sky-100 text-slate-700">
                  {selectedHistoricalSession.topic}
                </p>
              </div>

              <div className="overflow-x-auto max-h-60 border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] sticky top-0">
                    <tr>
                      <th className="px-3 py-2">No</th>
                      <th className="px-3 py-2">Nama Siswa</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(selectedHistoricalSession.items || selectedHistoricalSession.attendanceList || []).map(
                      (item, idx) => (
                        <tr key={item.studentId || idx}>
                          <td className="px-3 py-2 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="px-3 py-2 font-semibold text-slate-900">{item.studentName}</td>
                          <td className="px-3 py-2">
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
                          <td className="px-3 py-2 text-slate-500 italic text-[11px]">{item.notes || '-'}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

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
