import React, { useState } from 'react';
import {
  FolderCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  Award,
  BookOpen,
  Calendar,
  Users,
  FileText,
  FileCheck,
  Check,
  X,
  Printer,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { TeacherAdministrationDoc, SubjectAttendanceSession, UserSession } from '../../types';

interface AdminTeacherAdminTabProps {
  session?: UserSession;
  teacherAdminDocs: TeacherAdministrationDoc[];
  subjectAttendanceSessions: SubjectAttendanceSession[];
  onUpdateTeacherAdminDoc: (
    id: string,
    status: TeacherAdministrationDoc['status'],
    feedbackNotes?: string,
    supervisionScore?: number,
    verifiedBy?: string
  ) => void;
  onDeleteTeacherAdminDoc: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminTeacherAdminTab: React.FC<AdminTeacherAdminTabProps> = ({
  session,
  teacherAdminDocs,
  subjectAttendanceSessions,
  onUpdateTeacherAdminDoc,
  onDeleteTeacherAdminDoc,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dokumen' | 'presensi'>('dokumen');

  // Filter States for Documents
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | TeacherAdministrationDoc['status']>('Semua');
  const [categoryFilter, setCategoryFilter] = useState<string>('Semua');
  const [subjectFilter, setSubjectFilter] = useState<string>('Semua');

  // Filter States for Attendance Sessions
  const [attendanceSearch, setAttendanceSearch] = useState('');
  const [attendanceClassFilter, setAttendanceClassFilter] = useState('Semua');

  // Verification Modal State
  const [selectedDocForVerify, setSelectedDocForVerify] = useState<TeacherAdministrationDoc | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<TeacherAdministrationDoc['status']>('Disetujui');
  const [verifyScore, setVerifyScore] = useState<number>(95);
  const [verifyFeedback, setVerifyFeedback] = useState<string>('');
  const [verifySuccessToast, setVerifySuccessToast] = useState<string | null>(null);

  // Detail Modal State
  const [viewingDoc, setViewingDoc] = useState<TeacherAdministrationDoc | null>(null);
  const [viewingAttendance, setViewingAttendance] = useState<SubjectAttendanceSession | null>(null);

  // Statistics calculation
  const totalDocs = teacherAdminDocs.length;
  const pendingDocs = teacherAdminDocs.filter((d) => d.status === 'Menunggu Verifikasi').length;
  const approvedDocs = teacherAdminDocs.filter((d) => d.status === 'Disetujui').length;
  const revisionDocs = teacherAdminDocs.filter((d) => d.status === 'Perlu Perbaikan').length;

  const scoredDocs = teacherAdminDocs.filter((d) => d.supervisionScore !== undefined);
  const avgSupervisionScore =
    scoredDocs.length > 0
      ? (scoredDocs.reduce((acc, d) => acc + (d.supervisionScore || 0), 0) / scoredDocs.length).toFixed(1)
      : '92.5';

  // Distinct subjects and categories
  const allSubjects = Array.from(new Set(teacherAdminDocs.map((d) => d.subject))).sort();
  const allCategories = Array.from(new Set(teacherAdminDocs.map((d) => d.category))).sort();

  // Filtered documents
  const filteredDocs = teacherAdminDocs.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.targetClass.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'Semua' || doc.status === statusFilter;
    const matchesCategory = categoryFilter === 'Semua' || doc.category === categoryFilter;
    const matchesSubject = subjectFilter === 'Semua' || doc.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesSubject;
  });

  // Filtered Attendance Sessions
  const filteredAttendance = subjectAttendanceSessions.filter((ses) => {
    const matchesSearch =
      ses.subject.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      ses.teacherName.toLowerCase().includes(attendanceSearch.toLowerCase()) ||
      ses.topic.toLowerCase().includes(attendanceSearch.toLowerCase());
    const matchesClass = attendanceClassFilter === 'Semua' || ses.className === attendanceClassFilter;
    return matchesSearch && matchesClass;
  });

  const handleOpenVerifyModal = (doc: TeacherAdministrationDoc) => {
    setSelectedDocForVerify(doc);
    setVerifyStatus(doc.status === 'Menunggu Verifikasi' ? 'Disetujui' : doc.status);
    setVerifyScore(doc.supervisionScore || 92);
    setVerifyFeedback(doc.feedbackNotes || '');
  };

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocForVerify) return;

    const reviewer = session?.name || 'Drs. Petrus Kanisius Dadi (Kepala Sekolah)';
    onUpdateTeacherAdminDoc(
      selectedDocForVerify.id,
      verifyStatus,
      verifyFeedback,
      verifyScore,
      reviewer
    );

    setVerifySuccessToast(`Dokumen "${selectedDocForVerify.title}" berhasil diverifikasi sebagai: ${verifyStatus}`);
    setSelectedDocForVerify(null);
    setTimeout(() => setVerifySuccessToast(null), 4000);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {verifySuccessToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-3 animate-slideDown">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{verifySuccessToast}</span>
          </div>
          <button
            onClick={() => setVerifySuccessToast(null)}
            className="text-white hover:text-emerald-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
              Supervisi Akademik & Administrasi Pendidik
            </span>
            <span className="text-xs text-slate-400">• TP 2026/2027</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <FolderCheck className="w-6 h-6 text-indigo-600" />
            <span>Administrasi Guru & Rekap Presensi Mapel</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pusat verifikasi berkas perangkat ajar (Modul Ajar, Prota, Promes, ATP, KKTP, Jurnal) dan monitoring kehadiran siswa per mapel dari seluruh dewan guru.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handlePrintSummary}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap Supervisi</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Berkas</span>
            <span className="text-2xl font-black text-slate-900">{totalDocs}</span>
            <span className="text-[10px] text-slate-500 block">Perangkat Masuk</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3 bg-amber-50/30">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Menunggu Review</span>
            <span className="text-2xl font-black text-amber-900">{pendingDocs}</span>
            <span className="text-[10px] text-amber-600 block">Perlu Diverifikasi</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-3 bg-emerald-50/30">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Telah Disetujui</span>
            <span className="text-2xl font-black text-emerald-900">{approvedDocs}</span>
            <span className="text-[10px] text-emerald-600 block">Lengkap & Sah</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm flex items-center gap-3 bg-rose-50/30">
          <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Perlu Revisi</span>
            <span className="text-2xl font-black text-rose-900">{revisionDocs}</span>
            <span className="text-[10px] text-rose-600 block">Dikembalikan ke Guru</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-sm flex items-center gap-3 bg-purple-50/30 col-span-2 lg:col-span-1">
          <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">Rata-rata Skor</span>
            <span className="text-2xl font-black text-purple-900">{avgSupervisionScore}</span>
            <span className="text-[10px] text-purple-600 block">Kategori Sangat Baik</span>
          </div>
        </div>
      </div>

      {/* SUB-TABS SELECTOR */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('dokumen')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'dokumen'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <FolderCheck className="w-4 h-4" />
          <span>Verifikasi Berkas Perangkat Ajar Guru</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeSubTab === 'dokumen' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {filteredDocs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('presensi')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'presensi'
              ? 'bg-indigo-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Monitoring Presensi Mapel Siswa</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeSubTab === 'presensi' ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {filteredAttendance.length} Sesi
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: BERKAS ADMINISTRASI GURU                          */}
      {/* ========================================================= */}
      {activeSubTab === 'dokumen' && (
        <div className="space-y-4">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama guru, NIP, judul berkas, atau mata pelajaran..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-bold">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-2 rounded-xl focus:outline-none"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Disetujui">Disetujui</option>
                  <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-bold">Kategori:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-2 rounded-xl focus:outline-none max-w-[160px]"
                >
                  <option value="Semua">Semua Kategori</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-slate-400 font-bold">Mapel:</span>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-2.5 py-2 rounded-xl focus:outline-none max-w-[160px]"
                >
                  <option value="Semua">Semua Mapel</option>
                  {allSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* TABLE OF TEACHER ADMINISTRATION DOCUMENTS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Guru Pengampu & Mapel</th>
                    <th className="px-4 py-3.5">Kategori & Judul Dokumen</th>
                    <th className="px-4 py-3.5">Kelas & TP</th>
                    <th className="px-4 py-3.5">Berkas & Tgl Unggah</th>
                    <th className="px-4 py-3.5">Status Verifikasi</th>
                    <th className="px-4 py-3.5">Skor & Catatan Supervisi</th>
                    <th className="px-4 py-3.5 text-center">Aksi Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-indigo-50/30 transition-colors">
                      {/* Teacher & Subject */}
                      <td className="px-4 py-3.5 align-top">
                        <div className="font-bold text-slate-900">{doc.teacherName}</div>
                        <div className="text-[10px] font-mono text-slate-500">NIP: {doc.teacherNip}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-[10px]">
                          {doc.subject}
                        </span>
                      </td>

                      {/* Category & Title */}
                      <td className="px-4 py-3.5 align-top max-w-xs">
                        <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md mb-1">
                          {doc.category}
                        </span>
                        <div className="font-bold text-slate-900 leading-snug">{doc.title}</div>
                        {doc.bundleComponents && doc.bundleComponents.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 mt-1.5">
                            <span className="text-[9px] font-extrabold text-sky-800 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded">
                              1 File PDF Lengkap
                            </span>
                            {doc.bundleComponents.slice(0, 4).map((comp, idx) => (
                              <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                {comp}
                              </span>
                            ))}
                            {doc.bundleComponents.length > 4 && (
                              <span className="text-[9px] text-slate-400 font-semibold">
                                +{doc.bundleComponents.length - 4} lagi
                              </span>
                            )}
                          </div>
                        )}
                        {doc.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{doc.description}</p>
                        )}
                      </td>

                      {/* Target Class & Semester */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <div className="font-bold text-slate-800">{doc.targetClass}</div>
                        <div className="text-[11px] text-slate-500">
                          TP {doc.academicYear} ({doc.semester})
                        </div>
                      </td>

                      {/* File Details */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-800">
                          <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[10px] rounded font-mono">
                            {doc.fileType}
                          </span>
                          <span className="text-[11px]">{doc.fileSize}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{doc.uploadedAt}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            doc.status === 'Disetujui'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : doc.status === 'Perlu Perbaikan'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {doc.status === 'Disetujui' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {doc.status === 'Perlu Perbaikan' && <AlertCircle className="w-3.5 h-3.5" />}
                          {doc.status === 'Menunggu Verifikasi' && <Clock className="w-3.5 h-3.5" />}
                          <span>{doc.status}</span>
                        </span>

                        {doc.verifiedBy && (
                          <div className="text-[10px] text-slate-500 mt-1">
                            Oleh: <span className="font-medium text-slate-700">{doc.verifiedBy}</span>
                          </div>
                        )}
                      </td>

                      {/* Score & Feedback */}
                      <td className="px-4 py-3.5 align-top max-w-[200px]">
                        {doc.supervisionScore !== undefined ? (
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                              Skor: {doc.supervisionScore}/100
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Belum dinilai</span>
                        )}

                        {doc.feedbackNotes ? (
                          <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 line-clamp-2 italic">
                            "{doc.feedbackNotes}"
                          </p>
                        ) : (
                          <span className="text-[10px] text-slate-400 block mt-1">-</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 align-top text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenVerifyModal(doc)}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 cursor-pointer shadow-sm"
                            title="Verifikasi & Beri Nilai Supervisi"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            <span>Telaah / Verifikasi</span>
                          </button>

                          <button
                            onClick={() => setViewingDoc(doc)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Lihat Detail Dokumen"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Hapus berkas administrasi "${doc.title}"?`)) {
                                onDeleteTeacherAdminDoc(doc.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Berkas"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredDocs.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        <FolderCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-slate-600">Tidak ada dokumen administrasi guru yang sesuai.</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Coba sesuaikan kata kunci pencarian atau filter status dokumen.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: MONITORING PRESENSI MAPEL SISWA                  */}
      {/* ========================================================= */}
      {activeSubTab === 'presensi' && (
        <div className="space-y-4">
          {/* SEARCH & FILTER CONTROLS FOR ATTENDANCE */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={attendanceSearch}
                onChange={(e) => setAttendanceSearch(e.target.value)}
                placeholder="Cari mapel, nama guru pengampu, atau topik pertemuan..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-bold">Filter Kelas:</span>
              <select
                value={attendanceClassFilter}
                onChange={(e) => setAttendanceClassFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="Semua">Semua Kelas</option>
                <option value="X-MIPA 1">Kelas X-MIPA 1</option>
                <option value="X-MIPA 2">Kelas X-MIPA 2</option>
                <option value="X-IPS 1">Kelas X-IPS 1</option>
                <option value="XI-MIPA 1">Kelas XI-MIPA 1</option>
                <option value="XI-IPS 2">Kelas XI-IPS 2</option>
                <option value="XII-MIPA 1">Kelas XII-MIPA 1</option>
              </select>
            </div>
          </div>

          {/* ATTENDANCE SESSIONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAttendance.map((sessionItem) => (
              <div
                key={sessionItem.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      Pertemuan Ke-{sessionItem.meetingNumber}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{sessionItem.subject}</h3>
                    <p className="text-xs text-slate-500">
                      Kelas: <strong className="text-slate-800">{sessionItem.className}</strong> • {sessionItem.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-600 block leading-none">
                      {sessionItem.summary.percentage}%
                    </span>
                    <span className="text-[10px] text-slate-400">Kehadiran</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-500 text-[11px]">
                    Guru Pengampu: <strong className="text-slate-800">{sessionItem.teacherName}</strong>
                  </div>
                  <div className="text-slate-700 font-medium">
                    Pokok Bahasan: <span className="font-normal text-slate-600">"{sessionItem.topic}"</span>
                  </div>
                </div>

                {/* Summary badges */}
                <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-bold pt-1">
                  <div className="bg-emerald-50 text-emerald-800 py-1 rounded-lg border border-emerald-200">
                    <span className="block text-[10px] text-emerald-600">Hadir</span>
                    <span>{sessionItem.summary.hadir}</span>
                  </div>
                  <div className="bg-amber-50 text-amber-800 py-1 rounded-lg border border-amber-200">
                    <span className="block text-[10px] text-amber-600">Sakit</span>
                    <span>{sessionItem.summary.sakit}</span>
                  </div>
                  <div className="bg-blue-50 text-blue-800 py-1 rounded-lg border border-blue-200">
                    <span className="block text-[10px] text-blue-600">Izin</span>
                    <span>{sessionItem.summary.izin}</span>
                  </div>
                  <div className="bg-rose-50 text-rose-800 py-1 rounded-lg border border-rose-200">
                    <span className="block text-[10px] text-rose-600">Alpa</span>
                    <span>{sessionItem.summary.alpa}</span>
                  </div>
                </div>

                <button
                  onClick={() => setViewingAttendance(sessionItem)}
                  className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Rincian Presensi Siswa</span>
                </button>
              </div>
            ))}

            {filteredAttendance.length === 0 && (
              <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
                <ClipboardList className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold text-slate-600">Belum ada rekaman sesi presensi mapel yang tercatat.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Guru mapel dapat melakukan pengisian absen harian melalui menu Absen di Dasbor Guru Mapel.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: VERIFIKASI & SUPERVISI ADMINISTRASI GURU         */}
      {/* ========================================================= */}
      {selectedDocForVerify && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-indigo-900 to-[#1e1b4b] text-white p-6 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                  Form Supervisi Kepala Sekolah
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Telaah & Verifikasi Dokumen Guru
                </h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Pengesahan resmi berkas administrasi dan pemberian catatan supervisi akademik.
                </p>
              </div>
              <button
                onClick={() => setSelectedDocForVerify(null)}
                className="text-indigo-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVerification} className="p-6 space-y-4">
              {/* Document Overview */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Guru Pengampu:</span>
                  <span className="font-bold text-slate-900">{selectedDocForVerify.teacherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mata Pelajaran:</span>
                  <span className="font-bold text-indigo-700">{selectedDocForVerify.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori Dokumen:</span>
                  <span className="font-bold text-slate-800">{selectedDocForVerify.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Judul Berkas:</span>
                  <span className="font-bold text-slate-900 text-right max-w-[280px] truncate">
                    {selectedDocForVerify.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Rombel:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedDocForVerify.targetClass} (TP {selectedDocForVerify.academicYear} - {selectedDocForVerify.semester})
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Berkas PDF:</span>
                  <span className="font-mono text-indigo-700 font-bold flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{selectedDocForVerify.fileName}</span>
                    <span className="text-[10px] text-slate-400">({selectedDocForVerify.fileSize})</span>
                  </span>
                </div>
              </div>

              {/* Checklist Komponen Bundel 1 File PDF */}
              {selectedDocForVerify.bundleComponents && selectedDocForVerify.bundleComponents.length > 0 && (
                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-sky-950 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Kelengkapan Berkas (1 File PDF Bundel: CP hingga RPM):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedDocForVerify.bundleComponents.map((comp, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-sky-900 bg-white/80 px-2 py-1 rounded-lg border border-sky-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span className="font-medium truncate">{comp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Keputusan Verifikasi Status Berkas:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Disetujui', label: 'Setujui & Sahkan', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                    { id: 'Perlu Perbaikan', label: 'Perlu Revisi', color: 'border-rose-500 bg-rose-50 text-rose-800' },
                    { id: 'Menunggu Verifikasi', label: 'Tunda (Pending)', color: 'border-amber-500 bg-amber-50 text-amber-800' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setVerifyStatus(st.id as any)}
                      className={`p-2.5 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer text-center ${
                        verifyStatus === st.id ? st.color + ' ring-2 ring-indigo-500/20 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Supervision Score */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Nilai Supervisi Perangkat (0 - 100):
                  </label>
                  <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Skor: {verifyScore} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={verifyScore}
                  onChange={(e) => setVerifyScore(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                  <span>50 (Cukup)</span>
                  <span>75 (Baik)</span>
                  <span>90 (Amat Baik)</span>
                  <span>100 (Sempurna)</span>
                </div>
              </div>

              {/* Feedback Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Telaah / Masukan Supervisi Kepala Sekolah:
                </label>
                <textarea
                  rows={3}
                  value={verifyFeedback}
                  onChange={(e) => setVerifyFeedback(e.target.value)}
                  placeholder="Berikan apresiasi, koreksi alur modul ajar, rubrik penilaian, atau arahan penyempurnaan perangkat pembelajaran..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedDocForVerify(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Keputusan Verifikasi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RINCIAN SESI PRESENSI SISWA                      */}
      {/* ========================================================= */}
      {viewingAttendance && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                  Rincian Presensi Tatap Muka
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  {viewingAttendance.subject} - Pertemuan Ke-{viewingAttendance.meetingNumber}
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Kelas {viewingAttendance.className} • Tanggal: {viewingAttendance.date} ({viewingAttendance.timeSlot || 'Jam Efektif'})
                </p>
              </div>
              <button
                onClick={() => setViewingAttendance(null)}
                className="text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="text-slate-500">
                  Guru Pengampu: <strong className="text-slate-900">{viewingAttendance.teacherName}</strong> (NIP: {viewingAttendance.teacherNip})
                </div>
                <div className="text-slate-700">
                  Materi / Topik: <strong className="text-indigo-700">"{viewingAttendance.topic}"</strong>
                </div>
                <div className="text-slate-400 text-[11px] pt-1">
                  Tercatat pada: {viewingAttendance.createdAt}
                </div>
              </div>

              {/* Attendance Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase">
                    <tr>
                      <th className="px-3 py-2.5">NISN</th>
                      <th className="px-3 py-2.5">Nama Siswa</th>
                      <th className="px-3 py-2.5">Status Kehadiran</th>
                      <th className="px-3 py-2.5">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingAttendance.attendanceList.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono text-slate-600">{item.studentNisn}</td>
                        <td className="px-3 py-2 font-bold text-slate-900">{item.studentName}</td>
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
                        <td className="px-3 py-2 text-slate-500 italic text-[11px]">
                          {item.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingAttendance(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup Rincian
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DETAIL DOKUMEN ADMINISTRASI GURU                 */}
      {/* ========================================================= */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full">
                  {viewingDoc.category}
                </span>
                <h3 className="text-base font-black text-white mt-1">{viewingDoc.title}</h3>
                <p className="text-xs text-slate-300">{viewingDoc.subject}</p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Guru Pengampu:</span>
                  <span className="font-bold text-slate-900">{viewingDoc.teacherName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">NIP Pendidik:</span>
                  <span className="font-mono text-slate-700">{viewingDoc.teacherNip}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Tingkat Kelas:</span>
                  <span className="font-bold text-slate-800">{viewingDoc.targetClass}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Tahun Pelajaran:</span>
                  <span className="font-medium text-slate-800">
                    {viewingDoc.academicYear} ({viewingDoc.semester})
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Nama Berkas:</span>
                  <span className="font-mono text-blue-700">{viewingDoc.fileName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Ukuran & Format:</span>
                  <span className="font-bold text-slate-800">
                    {viewingDoc.fileType} • {viewingDoc.fileSize}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Tanggal Upload:</span>
                  <span className="text-slate-700">{viewingDoc.uploadedAt}</span>
                </div>
              </div>

              {viewingDoc.description && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Deskripsi Berkas:</span>
                  <p className="text-slate-700 leading-relaxed">{viewingDoc.description}</p>
                </div>
              )}

              {viewingDoc.feedbackNotes && (
                <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                  <span className="text-[11px] font-bold text-indigo-900 block mb-1">
                    Ulasan & Supervisi Kepala Sekolah:
                  </span>
                  <p className="text-indigo-800 italic">"{viewingDoc.feedbackNotes}"</p>
                  <div className="mt-1 text-[10px] text-indigo-600 font-bold">
                    Oleh: {viewingDoc.verifiedBy || 'Kepala Sekolah'} • Skor:{' '}
                    {viewingDoc.supervisionScore || '-'}/100
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => {
                    setViewingDoc(null);
                    handleOpenVerifyModal(viewingDoc);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Verifikasi Berkas Ini</span>
                </button>
                <button
                  onClick={() => setViewingDoc(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
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
