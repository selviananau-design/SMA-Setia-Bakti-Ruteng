import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Upload,
  Download,
  Award,
  CalendarCheck,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  UserCheck,
  Search,
} from 'lucide-react';
import {
  Student,
  StudyMaterial,
  StudentAssignment,
  AssignmentSubmission,
  WaliKelasNote,
  ClassDiscussion,
  UserSession,
} from '../../types';

interface StudentDashboardProps {
  session: UserSession;
  student: Student;
  studyMaterials: StudyMaterial[];
  assignments: StudentAssignment[];
  submissions: AssignmentSubmission[];
  waliNotes: WaliKelasNote[];
  discussions: ClassDiscussion[];
  onSubmitAssignment: (submission: AssignmentSubmission) => void;
  onAddDiscussionMessage: (discussionId: string, replyContent: string) => void;
  onNewDiscussionTopic: (discussion: ClassDiscussion) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  session,
  student,
  studyMaterials,
  assignments,
  submissions,
  waliNotes,
  discussions,
  onSubmitAssignment,
  onAddDiscussionMessage,
  onNewDiscussionTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'materi' | 'tugas' | 'catatan' | 'diskusi' | 'nilai'>('materi');

  // Filter study materials for student's class
  const studentMaterials = studyMaterials.filter((m) => m.className === student.className);

  // Filter assignments for student's class
  const studentAssignments = assignments.filter((a) => a.className === student.className);

  // Filter notes for this student specifically or whole class
  const studentNotes = waliNotes.filter(
    (n) => n.studentId === student.id || n.studentNisn === student.nisn || n.className === student.className
  );

  // Filter discussions for student's class
  const studentDiscussions = discussions.filter((d) => d.className === student.className);

  // Assignment submission modal
  const [submittingAssignment, setSubmittingAssignment] = useState<StudentAssignment | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('Jawaban_Tugas_Yohanes.pdf');
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState('');

  // Discussion reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);
  const [newTopicTarget, setNewTopicTarget] = useState<'mapel' | 'walikelas'>('mapel');
  const [newTopicSubject, setNewTopicSubject] = useState('Biologi & Bioteknologi');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');

  // Search in materials
  const [materialSearch, setMaterialSearch] = useState('');

  const filteredMaterials = studentMaterials.filter(
    (m) =>
      m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
      m.subject.toLowerCase().includes(materialSearch.toLowerCase())
  );

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !answerText.trim()) return;

    const newSub: AssignmentSubmission = {
      id: `sub-${Date.now()}`,
      assignmentId: submittingAssignment.id,
      assignmentTitle: submittingAssignment.title,
      studentId: student.id,
      studentName: student.name,
      studentNisn: student.nisn,
      className: student.className,
      submittedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Menunggu Dinilai',
      answerText: answerText.trim(),
      fileName: selectedFileName,
      fileSize: '1.8 MB',
    };

    onSubmitAssignment(newSub);
    setSubmittingAssignment(null);
    setAnswerText('');
    setSubmissionSuccessMsg(`Tugas "${submittingAssignment.title}" berhasil dikumpulkan kepada guru mata pelajaran!`);
    setTimeout(() => setSubmissionSuccessMsg(''), 5000);
  };

  const handleSendReply = (discId: string) => {
    const text = replyTextMap[discId];
    if (!text || !text.trim()) return;
    onAddDiscussionMessage(discId, text.trim());
    setReplyTextMap({ ...replyTextMap, [discId]: '' });
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle || !newTopicContent) return;

    const newDisc: ClassDiscussion = {
      id: `disc-${Date.now()}`,
      type: newTopicTarget,
      subject: newTopicTarget === 'mapel' ? newTopicSubject : undefined,
      topic: newTopicTitle,
      className: student.className,
      authorRole: 'siswa',
      authorName: student.name,
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      content: newTopicContent,
      replies: [],
    };

    onNewDiscussionTopic(newDisc);
    setNewTopicTitle('');
    setNewTopicContent('');
    setShowNewTopicModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Header Banner */}
      <div className="bg-gradient-to-r from-[#2c1654] via-[#43237e] to-[#253f7c] text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-purple-950 font-black text-2xl flex items-center justify-center shadow-md border-2 border-white/20">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Portal Siswa Aktif
              </span>
              <span className="bg-amber-400 text-purple-950 text-xs font-black px-2 py-0.5 rounded">
                Kelas {student.className}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">{student.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-purple-200 mt-1">
              <span>NISN: <strong className="text-white font-mono">{student.nisn}</strong></span>
              <span>•</span>
              <span>Peminatan: <strong className="text-white">{student.major}</strong></span>
              <span>•</span>
              <span>Tahun Ajaran: 2026/2027 (Ganjil)</span>
            </div>
          </div>
        </div>

        {/* Quick Academic Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-purple-200 uppercase block font-bold">Kehadiran</span>
            <span className="text-lg font-black text-emerald-300">{student.attendanceRate}%</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-purple-200 uppercase block font-bold">Rata-rata Nilai</span>
            <span className="text-lg font-black text-amber-300">{student.gpa}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-purple-200 uppercase block font-bold">SPP Sekolah</span>
            <span className="text-xs font-black text-emerald-200 bg-emerald-900/60 px-2 py-1 rounded inline-block mt-1">
              {student.tuitionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {submissionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{submissionSuccessMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'materi', label: 'Unduh Bahan Ajar', icon: BookOpen, count: studentMaterials.length },
          { id: 'tugas', label: 'Tugas & Pengumpulan', icon: FileText, count: studentAssignments.length },
          { id: 'catatan', label: 'Catatan Penting Wali Kelas', icon: Award, count: studentNotes.length },
          { id: 'diskusi', label: 'Diskusi Guru & Kelas', icon: MessageSquare, count: studentDiscussions.length },
          { id: 'nilai', label: 'Presensi & Rapor Saya', icon: CalendarCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#3b1d70] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50 hover:text-purple-950'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
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

      {/* ========================================================= */}
      {/* TAB 1: UNDUH BAHAN AJAR DARI GURU */}
      {/* ========================================================= */}
      {activeTab === 'materi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>Bahan Ajar & Modul Pembelajaran Kelas {student.className}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Unduh materi resmi yang diunggah oleh guru pengampu mata pelajaran untuk menunjang belajar Anda.
              </p>
            </div>

            {/* Material Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Cari materi atau mapel..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-purple-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                        {mat.fileType}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{mat.title}</h4>
                        <span className="text-[11px] font-semibold text-purple-700 block mt-0.5">
                          {mat.subject}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mt-2 bg-white p-2.5 rounded-lg border border-slate-100">
                    {mat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <div className="text-slate-500">
                    <span>Guru: <strong>{mat.teacherName}</strong></span>
                    <span className="block text-[10px] text-slate-400 font-mono">Diunggah: {mat.uploadDate} • {mat.fileSize}</span>
                  </div>

                  <button
                    onClick={() => {
                      alert(`Berhasil mengunduh materi: ${mat.title} (${mat.fileType} - ${mat.fileSize})`);
                    }}
                    className="px-3 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Modul</span>
                  </button>
                </div>
              </div>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="col-span-2 text-center py-10 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                Tidak ada bahan ajar yang ditemukan untuk pencarian tersebut.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: TUGAS & PENGUMPULAN TUGAS */}
      {/* ========================================================= */}
      {activeTab === 'tugas' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-700" />
              <span>Daftar Tugas & Pengumpulan Jawaban</span>
            </h3>
            <p className="text-xs text-slate-500">
              Perhatikan tenggat waktu penugasan dari guru mapel. Kumpulkan tugas langsung melalui form di bawah.
            </p>
          </div>

          <div className="space-y-4">
            {studentAssignments.map((asg) => {
              const mySubmission = submissions.find(
                (s) => s.assignmentId === asg.id && (s.studentId === student.id || s.studentNisn === student.nisn)
              );

              return (
                <div
                  key={asg.id}
                  className={`p-5 rounded-xl border transition-all ${
                    mySubmission?.status === 'Sudah Dinilai'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : mySubmission
                      ? 'border-blue-200 bg-blue-50/20'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                          {asg.subject}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{asg.title}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Guru Pengampu: <strong>{asg.teacherName}</strong> • Ditugaskan: {asg.assignedDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                        Batas: {asg.dueDate}
                      </span>

                      {/* Submission status badge */}
                      {mySubmission ? (
                        mySubmission.status === 'Sudah Dinilai' ? (
                          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
                            Nilai: {mySubmission.grade} / 100
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-lg">
                            Sudah Dikumpulkan
                          </span>
                        )
                      ) : (
                        <button
                          onClick={() => setSubmittingAssignment(asg)}
                          className="px-3.5 py-1.5 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Kumpulkan Tugas</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Task Instructions */}
                  <div className="pt-3 text-xs space-y-2">
                    <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      <strong className="text-slate-900 block mb-1">Petunjuk Pengerjaan:</strong>
                      {asg.description}
                    </p>

                    {/* Show submission detail if student submitted */}
                    {mySubmission && (
                      <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-blue-900 font-bold">
                            Jawaban Anda (Dikirim: {mySubmission.submittedAt})
                          </span>
                          {mySubmission.fileName && (
                            <span className="text-slate-500 font-mono">Berkas: {mySubmission.fileName}</span>
                          )}
                        </div>
                        <p className="text-slate-700">{mySubmission.answerText}</p>

                        {/* If graded, show feedback */}
                        {mySubmission.feedback && (
                          <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-emerald-900 text-xs mt-2">
                            <strong>Umpan Balik Guru ({mySubmission.gradedBy}):</strong> {mySubmission.feedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {studentAssignments.length === 0 && (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada tugas yang diberikan untuk kelas {student.className}.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CATATAN PENTING WALI KELAS */}
      {/* ========================================================= */}
      {activeTab === 'catatan' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-700" />
              <span>Catatan Penting Wali Kelas untuk {student.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Bimbingan karakter, motivasi, pengingat, dan evaluasi berkala dari wali kelas Anda.
            </p>
          </div>

          <div className="space-y-4">
            {studentNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl border border-purple-200 bg-purple-50/30 space-y-2 hover:border-purple-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                      {note.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{note.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{note.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {note.content}
                </p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Wali Kelas: <strong className="text-purple-950">{note.teacherName}</strong>
                  </span>
                  {note.actionRequired && (
                    <span className="text-amber-800 font-bold bg-amber-100/70 px-2 py-0.5 rounded">
                      Arahan: {note.actionRequired}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {studentNotes.length === 0 && (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada catatan wali kelas untuk Anda saat ini. Terus jaga kedisiplinan dan semangat belajar!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DISKUSI DENGAN GURU MAPEL ATAU WALI KELAS */}
      {/* ========================================================= */}
      {activeTab === 'diskusi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-700" />
                <span>Ruang Konsultasi & Diskusi Pembelajaran</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ajukan pertanyaan tentang materi kepada Guru Mapel atau sampaikan pertanyaan kelas kepada Wali Kelas Anda.
              </p>
            </div>
            <button
              onClick={() => setShowNewTopicModal(true)}
              className="px-3.5 py-2 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Tanya Guru / Buat Topik</span>
            </button>
          </div>

          <div className="space-y-4">
            {studentDiscussions.map((disc) => (
              <div key={disc.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        disc.type === 'walikelas'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {disc.type === 'walikelas' ? 'Forum Wali Kelas' : `Forum Mapel: ${disc.subject}`}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{disc.topic}</h4>
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

                {/* Reply box */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Tulis balasan tanggapan..."
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

            {studentDiscussions.length === 0 && (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada topik diskusi di kelas Anda. Klik "Tanya Guru / Buat Topik" untuk memulai.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: PRESENSI & RAPOR AKADEMIK SISWA */}
      {/* ========================================================= */}
      {activeTab === 'nilai' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-purple-700" />
              <span>Transkrip Kehadiran & Nilai Hasil Belajar Siswa</span>
            </h3>
            <p className="text-xs text-slate-500">
              Data resmi rekapitulasi presensi dan nilai akademik semester berjalan SMA Katolik Setia Bakti Ruteng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 block font-semibold">Tingkat Kehadiran</span>
              <span className="text-2xl font-black text-emerald-700">{student.attendanceRate}%</span>
              <span className="text-[10px] text-emerald-600 block mt-1">Sangat Disiplin</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-xs text-blue-800 block font-semibold">Indeks Prestasi</span>
              <span className="text-2xl font-black text-blue-800">{student.gpa}</span>
              <span className="text-[10px] text-blue-600 block mt-1">Predikat: Sangat Baik (A)</span>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <span className="text-xs text-purple-800 block font-semibold">Ranking Sementara</span>
              <span className="text-2xl font-black text-purple-900">#2</span>
              <span className="text-[10px] text-purple-700 block mt-1">dari 32 Siswa Kelas {student.className}</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 block font-semibold">Keterangan Sikap</span>
              <span className="text-2xl font-black text-amber-900">Amat Baik</span>
              <span className="text-[10px] text-amber-700 block mt-1">Evaluasi Spiritual & Karakter</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Nilai Capaian Kompetensi Mata Pelajaran:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#3b1d70] text-white uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Mata Pelajaran</th>
                    <th className="px-4 py-3">KKTP / KKM</th>
                    <th className="px-4 py-3">Nilai Tugas & Kuis</th>
                    <th className="px-4 py-3">Nilai Akhir</th>
                    <th className="px-4 py-3">Predikat</th>
                    <th className="px-4 py-3">Capaian Kompetensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { mapel: 'Biologi & Bioteknologi', kkm: 75, tugas: 92, akhir: 92, pred: 'A', ket: 'Sangat menguasai struktur sel & metabolisme mikroba' },
                    { mapel: 'Fisika Peminatan', kkm: 75, tugas: 88, akhir: 89, pred: 'A-', ket: 'Menguasai dinamika gerak lurus dan fluida dinamis' },
                    { mapel: 'Kimia Larutan', kkm: 75, tugas: 90, akhir: 90, pred: 'A', ket: 'Terampil melakukan stoikiometri dan titrasi asam-basa' },
                    { mapel: 'Matematika Peminatan', kkm: 75, tugas: 94, akhir: 93, pred: 'A', ket: 'Sangat mahir trigonometri analitik dan vektor' },
                    { mapel: 'Bahasa Indonesia', kkm: 78, tugas: 91, akhir: 90, pred: 'A', ket: 'Kreatif dalam penyusunan artikel opini dan cerpen' },
                    { mapel: 'Pendidikan Agama Katolik', kkm: 80, tugas: 95, akhir: 95, pred: 'A', ket: 'Aktif mengamalkan nilai belas kasih dan karya pelayan' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{row.mapel}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{row.kkm}</td>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-700">{row.tugas}</td>
                      <td className="px-4 py-3 font-mono font-black text-purple-900 text-sm">{row.akhir}</td>
                      <td className="px-4 py-3">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                          {row.pred}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: PENGUMPULAN TUGAS OLEH SISWA */}
      {/* ========================================================= */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#3b1d70] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-300" />
                <span>Pengumpulan Tugas Siswa</span>
              </h3>
              <button
                onClick={() => setSubmittingAssignment(null)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitTask} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-[10px] font-bold text-purple-700 uppercase">
                  {submittingAssignment.subject} • Kelas {submittingAssignment.className}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5">{submittingAssignment.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Batas Pengumpulan: <strong>{submittingAssignment.dueDate}</strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Uraian Jawaban / Catatan Pengantar Siswa
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan jawaban tugas Anda atau penjelasan laporan praktikum di sini..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lampirkan Berkas Dokumen (PDF / DOCX)</label>
                <div className="p-3 border-2 border-dashed border-purple-200 rounded-lg bg-slate-50 flex flex-col items-center justify-center text-center">
                  <FileText className="w-8 h-8 text-purple-600 mb-1" />
                  <span className="text-xs font-semibold text-slate-700">Berkas Terpilih: {selectedFileName}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Maksimal ukuran file: 15MB</span>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFileName(e.target.files[0].name);
                      }
                    }}
                    className="mt-2 text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:bg-purple-100 file:text-purple-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#432874] hover:bg-[#341b5e] text-white rounded-lg font-bold shadow"
                >
                  Kirim Tugas ke Guru Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TOPIK DISKUSI SISWA DENGAN GURU */}
      {/* ========================================================= */}
      {showNewTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#3b1d70] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-300" />
                <span>Konsultasi & Tanya Guru</span>
              </h3>
              <button
                onClick={() => setShowNewTopicModal(false)}
                className="text-white/80 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTopic} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tujuan Konsultasi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewTopicTarget('mapel')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-colors ${
                      newTopicTarget === 'mapel'
                        ? 'border-sky-600 bg-sky-50 text-sky-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Guru Mata Pelajaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTopicTarget('walikelas')}
                    className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-colors ${
                      newTopicTarget === 'walikelas'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Guru Wali Kelas
                  </button>
                </div>
              </div>

              {newTopicTarget === 'mapel' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Mata Pelajaran</label>
                  <select
                    value={newTopicSubject}
                    onChange={(e) => setNewTopicSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Biologi & Bioteknologi">Biologi & Bioteknologi</option>
                    <option value="Fisika Peminatan">Fisika Peminatan</option>
                    <option value="Matematika Peminatan">Matematika Peminatan</option>
                    <option value="Bahasa & Sastra Inggris">Bahasa & Sastra Inggris</option>
                    <option value="Pendidikan Agama Katolik">Pendidikan Agama Katolik</option>
                    <option value="Informatika & Multimedia">Informatika & Multimedia</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Pertanyaan / Konsultasi</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pertanyaan tentang metode perhitungan titrasi bab 3..."
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Pertanyaan Anda</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pertanyaan atau kesulitan belajar yang ingin Anda diskusikan dengan bapak/ibu guru..."
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
                  className="px-4 py-2 bg-[#432874] hover:bg-[#341b5e] text-white rounded-lg font-bold shadow"
                >
                  Kirim Pertanyaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
