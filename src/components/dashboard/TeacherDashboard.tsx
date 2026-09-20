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
} from '../../types';

interface TeacherDashboardProps {
  session: UserSession;
  students: Student[];
  studyMaterials: StudyMaterial[];
  assignments: StudentAssignment[];
  submissions: AssignmentSubmission[];
  waliNotes: WaliKelasNote[];
  leaveRequests: LeaveRequest[];
  discussions: ClassDiscussion[];
  onAddStudyMaterial: (material: StudyMaterial) => void;
  onAddAssignment: (assignment: StudentAssignment) => void;
  onGradeSubmission: (submissionId: string, grade: number, feedback: string) => void;
  onAddWaliNote: (note: WaliKelasNote) => void;
  onReviewLeaveRequest: (requestId: string, status: 'Disetujui' | 'Ditolak', reviewNotes?: string) => void;
  onAddDiscussionMessage: (discussionId: string, replyContent: string) => void;
  onNewDiscussionTopic: (discussion: ClassDiscussion) => void;
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
  onAddStudyMaterial,
  onAddAssignment,
  onGradeSubmission,
  onAddWaliNote,
  onReviewLeaveRequest,
  onAddDiscussionMessage,
  onNewDiscussionTopic,
}) => {
  // Mode Guru: Guru Wali Kelas vs Guru Mapel
  const [activeMode, setActiveMode] = useState<'walikelas' | 'gurumapel'>('walikelas');

  // Selected Class for Wali Kelas
  const [waliClass, setWaliClass] = useState<string>(session.className || 'X-MIPA 1');
  const [waliSubTab, setWaliSubTab] = useState<'presensi' | 'catatan' | 'izin' | 'diskusi' | 'siswa'>('presensi');

  // Selected Subject & Class for Guru Mapel
  const [mapelSubject, setMapelSubject] = useState<string>('Biologi & Bioteknologi');
  const [mapelClass, setMapelClass] = useState<string>('X-MIPA 1');
  const [mapelSubTab, setMapelSubTab] = useState<'materi' | 'tugas' | 'penilaian' | 'diskusi' | 'siswa'>('materi');

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

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 4000);
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

          {/* MAPEL SUBTAB 4: FORUM DISKUSI MAPEL */}
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
    </div>
  );
};
