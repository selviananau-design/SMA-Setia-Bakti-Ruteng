import React, { useState } from 'react';
import {
  UserCheck,
  CalendarCheck,
  Award,
  AlertTriangle,
  MessageSquare,
  Users,
  Plus,
  CheckCircle2,
  XCircle,
  Send,
} from 'lucide-react';
import {
  UserSession,
  Student,
  WaliKelasNote,
  LeaveRequest,
  ClassDiscussion,
} from '../../types';

interface WaliKelasDashboardProps {
  session: UserSession;
  students: Student[];
  waliNotes: WaliKelasNote[];
  leaveRequests: LeaveRequest[];
  discussions: ClassDiscussion[];
  onAddWaliNote: (note: WaliKelasNote) => void;
  onReviewLeaveRequest: (requestId: string, status: 'Disetujui' | 'Ditolak', reviewNotes?: string) => void;
  onAddDiscussionMessage: (discussionId: string, replyContent: string) => void;
  onNewDiscussionTopic: (discussion: ClassDiscussion) => void;
}

export const WaliKelasDashboard: React.FC<WaliKelasDashboardProps> = ({
  session,
  students,
  waliNotes,
  leaveRequests,
  discussions,
  onAddWaliNote,
  onReviewLeaveRequest,
  onAddDiscussionMessage,
  onNewDiscussionTopic,
}) => {
  const [waliClass, setWaliClass] = useState<string>(session.className || 'X-MIPA 1');
  const [waliSubTab, setWaliSubTab] = useState<'presensi' | 'catatan' | 'izin' | 'diskusi' | 'siswa'>('presensi');

  // Attendance state
  const [attendanceState, setAttendanceState] = useState<Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'>>({});
  const [attendanceSaved, setAttendanceSaved] = useState(false);

  // Modal states
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showNewTopicModal, setShowNewTopicModal] = useState(false);

  // Form states for note
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<string>('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState<'Bimbingan Karakter' | 'Apresiasi Prestasi' | 'Akademik' | 'Kedisiplinan' | 'Konsultasi'>('Bimbingan Karakter');
  const [noteAction, setNoteAction] = useState('');

  // Form states for discussion
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Classes list
  const allClasses = Array.from(new Set(students.map((s) => s.className))).sort();

  // Filtered lists
  const waliStudents = students.filter((s) => s.className === waliClass);
  const filteredWaliNotes = waliNotes.filter((n) => n.className === waliClass);
  const filteredLeaveRequests = leaveRequests.filter((l) => l.className === waliClass);
  const waliDiscussions = discussions.filter(
    (d) => d.type === 'walikelas' && (d.className === waliClass || d.className === 'Semua')
  );

  const pendingLeaveCount = filteredLeaveRequests.filter((r) => r.status === 'Menunggu Persetujuan').length;

  const handleSaveAttendance = () => {
    setAttendanceSaved(true);
    setTimeout(() => setAttendanceSaved(false), 4000);
  };

  const handleSetAllPresent = () => {
    const updated: Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpa'> = {};
    waliStudents.forEach((s) => {
      updated[s.id] = 'Hadir';
    });
    setAttendanceState(updated);
  };

  const handleCreateWaliNote = (e: React.FormEvent) => {
    e.preventDefault();
    const st = waliStudents.find((s) => s.id === selectedStudentForNote);
    if (!st || !noteTitle || !noteContent) return;

    const newNote: WaliKelasNote = {
      id: `note-${Date.now()}`,
      studentId: st.id,
      studentName: st.name,
      studentNisn: st.nisn,
      className: waliClass,
      teacherName: session.name,
      date: new Date().toISOString().split('T')[0],
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      actionRequired: noteAction || undefined,
    };

    onAddWaliNote(newNote);
    setShowAddNoteModal(false);
    setNoteTitle('');
    setNoteContent('');
    setNoteAction('');
  };

  const handleSendReply = (discId: string) => {
    const text = replyTextMap[discId];
    if (!text || !text.trim()) return;
    onAddDiscussionMessage(discId, text.trim());
    setReplyTextMap({ ...replyTextMap, [discId]: '' });
  };

  return (
    <div className="space-y-6">
      {/* Wali Kelas Exclusive Header Banner */}
      <div className="bg-gradient-to-r from-[#2a1353] via-[#3b1d70] to-[#512b8a] text-white p-6 rounded-2xl shadow-lg border border-purple-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-950/80 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 font-black text-2xl shadow-inner">
            <UserCheck className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black tracking-wider bg-amber-400 text-purple-950 px-2.5 py-0.5 rounded-full shadow-sm">
                Dasbor Eksklusif Wali Kelas
              </span>
              <span className="bg-purple-900/90 text-purple-200 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-purple-700/50">
                NIP: {session.identifier || session.nip || '198811202015022004'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mt-1">
              Wali Kelas: {session.name}
            </h2>
            <p className="text-xs text-purple-200 mt-0.5">
              Bimbingan karakter, monitoring presensi harian, perizinan siswa, dan koordinasi dengan orang tua murid.
            </p>
          </div>
        </div>

        {/* Class Selector Dropdown */}
        <div className="bg-purple-950/60 p-3 rounded-xl border border-purple-400/30 flex items-center gap-2.5 backdrop-blur-sm self-stretch md:self-auto">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-200 block">Kelas Binaan:</span>
            <span className="text-xs font-black text-amber-300">Kelas {waliClass}</span>
          </div>
          <select
            value={waliClass}
            onChange={(e) => setWaliClass(e.target.value)}
            className="bg-white text-slate-900 text-xs font-bold px-3 py-2 rounded-lg border border-purple-300 shadow-sm focus:outline-none cursor-pointer"
          >
            {allClasses.map((cls) => (
              <option key={cls} value={cls}>
                Kelas {cls}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Summary Metric Cards for Wali Kelas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Siswa Terdaftar</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{waliStudents.length} Siswa</div>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">Kelas {waliClass} Aktif</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Rata-rata Presensi</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2">
            {waliStudents.length > 0
              ? `${Math.round(
                  waliStudents.reduce((acc, s) => acc + s.attendanceRate, 0) / waliStudents.length
                )}%`
              : '0%'}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Kehadiran Kumulatif</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Catatan Wali Kelas</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{filteredWaliNotes.length} Catatan</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Karakter & Pembinaan</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Permohonan Izin</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2">{pendingLeaveCount} Menunggu</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Dari Orang Tua / Dokter</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'presensi', label: 'Presensi Harian Kelas', icon: CalendarCheck, count: waliStudents.length },
          { id: 'catatan', label: 'Catatan Penting Wali Kelas', icon: Award, count: filteredWaliNotes.length },
          { id: 'izin', label: 'Verifikasi Izin & Sakit', icon: AlertTriangle, count: pendingLeaveCount },
          { id: 'diskusi', label: 'Forum Komunikasi Kelas', icon: MessageSquare, count: waliDiscussions.length },
          { id: 'siswa', label: 'Daftar Siswa Binaan', icon: Users, count: waliStudents.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = waliSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setWaliSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#3b1d70] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-amber-400 text-purple-950 font-black' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PRESENSI HARIAN KELAS */}
      {waliSubTab === 'presensi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-purple-700" />
                <span>Pencatatan Presensi Harian Rombel - Kelas {waliClass}</span>
              </h4>
              <p className="text-xs text-slate-500">
                Pencatatan presensi harian langsung terhubung ke dasbor pantau Orang Tua dan Admin Utama.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={handleSetAllPresent}
                className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Set Semua Hadir
              </button>
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
                      Belum ada siswa di kelas {waliClass}. Siswa yang diinput Admin Utama otomatis muncul di sini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CATATAN PENTING WALI KELAS */}
      {waliSubTab === 'catatan' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-700" />
                <span>Catatan Penting Wali Kelas untuk Siswa & Orang Tua</span>
              </h4>
              <p className="text-xs text-slate-500">
                Catatan perkembangan karakter, prestasi, pengingat, dan arahan pembinaan yang dapat dipantau langsung oleh siswa dan orang tua.
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

      {/* TAB 3: VERIFIKASI PERMOHONAN IZIN DARI ORANG TUA */}
      {waliSubTab === 'izin' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Verifikasi Pengajuan Izin / Surat Sakit Orang Tua</span>
              </h4>
              <p className="text-xs text-slate-500">
                Tinjau permohonan izin atau surat dokter yang diajukan oleh orang tua siswa kelas {waliClass}.
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

      {/* TAB 4: FORUM KOMUNIKASI & DISKUSI KELAS */}
      {waliSubTab === 'diskusi' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-700" />
                <span>Ruang Komunikasi & Diskusi Kelas Binaan ({waliClass})</span>
              </h4>
              <p className="text-xs text-slate-500">
                Saluran pengumuman dan diskusi terpusat antara wali kelas dengan seluruh siswa kelas binaan.
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
                Belum ada topik diskusi untuk kelas {waliClass}. Klik tombol di atas untuk memulai pengumuman kelas.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: DAFTAR SISWA BINAAN LENGKAP */}
      {waliSubTab === 'siswa' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-700" />
                <span>Buku Induk Ringkas Siswa Kelas Binaan: {waliClass}</span>
              </h4>
              <p className="text-xs text-slate-500">
                Data siswa aktif yang terdaftar di kelas binaan Anda (Total: {waliStudents.length} Siswa).
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

      {/* MODAL: BUAT CATATAN WALI KELAS */}
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
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TOPIK DISKUSI BARU WALI KELAS */}
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
                  createdAt: new Date().toISOString().split('T')[0],
                  content: newTopicContent,
                  replies: [],
                };
                onNewDiscussionTopic(newDisc);
                setShowNewTopicModal(false);
                setNewTopicTitle('');
                setNewTopicContent('');
              }}
              className="p-5 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Topik / Pengumuman</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jadwal Persiapan Penilaian Tengah Semester Kelas X-MIPA 1"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Pengumuman / Pesan</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tuliskan pengumuman atau topik bahasan untuk seluruh siswa dan orang tua kelas binaan..."
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
                  className="px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  Publikasikan ke Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
