import React, { useState } from 'react';
import {
  Bell,
  CalendarCheck,
  FileCheck,
  Award,
  Users,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Send,
} from 'lucide-react';
import {
  Student,
  LeaveRequest,
  WaliKelasNote,
  UserSession,
} from '../../types';

interface ParentDashboardProps {
  session: UserSession;
  child: Student;
  leaveRequests: LeaveRequest[];
  waliNotes: WaliKelasNote[];
  onSubmitLeaveRequest: (req: LeaveRequest) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  session,
  child,
  leaveRequests,
  waliNotes,
  onSubmitLeaveRequest,
}) => {
  const [activeTab, setActiveTab] = useState<'pengumuman' | 'kehadiran' | 'izin' | 'catatan' | 'rapor'>('pengumuman');

  // Filter leave requests for this child
  const childRequests = leaveRequests.filter(
    (r) => r.studentId === child.id || r.studentNisn === child.nisn
  );

  // Filter notes for this child
  const childNotes = waliNotes.filter(
    (n) => n.studentId === child.id || n.studentNisn === child.nisn || n.className === child.className
  );

  // Modal State for new Leave Request
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState<'Sakit' | 'Izin' | 'Lainnya'>('Sakit');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-02');
  const [totalDays, setTotalDays] = useState(2);
  const [reason, setReason] = useState('');
  const [hasDoctorLetter, setHasDoctorLetter] = useState(true);
  const [parentPhoneInput, setParentPhoneInput] = useState(child.parentPhone || '0812-3456-7890');
  const [successAlert, setSuccessAlert] = useState('');

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      studentId: child.id,
      studentName: child.name,
      studentNisn: child.nisn,
      className: child.className,
      parentName: session.name,
      parentPhone: parentPhoneInput,
      requestDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      type: leaveType,
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      reason: reason.trim(),
      doctorLetterAttached: hasDoctorLetter,
      status: 'Menunggu Persetujuan',
    };

    onSubmitLeaveRequest(newReq);
    setShowLeaveModal(false);
    setReason('');
    setSuccessAlert(`Permohonan izin untuk ${child.name} berhasil diajukan dan diteruskan ke Wali Kelas.`);
    setTimeout(() => setSuccessAlert(''), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Parent & Child Header Banner */}
      <div className="bg-gradient-to-r from-[#211142] via-[#3b1d70] to-[#1e345e] text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-purple-950 font-black text-2xl flex items-center justify-center shadow-md border-2 border-white/20">
            <Users className="w-8 h-8 text-purple-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                Portal Orang Tua / Wali Siswa
              </span>
              <span className="bg-amber-400 text-purple-950 text-xs font-black px-2 py-0.5 rounded">
                Kelas {child.className}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">{session.name}</h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-purple-200 mt-1">
              <span>Anak: <strong className="text-white">{child.name}</strong></span>
              <span>•</span>
              <span>NISN: <strong className="text-white font-mono">{child.nisn}</strong></span>
              <span>•</span>
              <span>Wali Kelas: <strong className="text-white">Theresia Imelda Ndua, S.Pd., M.Si.</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Child Status Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-purple-200 uppercase block font-bold">Kehadiran Anak</span>
            <span className="text-lg font-black text-emerald-300">{child.attendanceRate}%</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            <span className="text-[10px] text-purple-200 uppercase block font-bold">Rata-rata Nilai</span>
            <span className="text-lg font-black text-amber-300">{child.gpa}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-purple-200 uppercase block font-bold">Status SPP</span>
            <span className="text-xs font-black text-emerald-200 bg-emerald-900/60 px-2 py-1 rounded inline-block mt-1">
              {child.tuitionStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {successAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">{successAlert}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'pengumuman', label: 'Pengumuman Sekolah', icon: Bell },
          { id: 'kehadiran', label: 'Cek Tingkat Kehadiran Anak', icon: CalendarCheck },
          { id: 'izin', label: 'Ajukan Izin ke Wali Kelas', icon: FileCheck, count: childRequests.length },
          { id: 'catatan', label: 'Catatan Penting Wali Kelas', icon: Award, count: childNotes.length },
          { id: 'rapor', label: 'Rapor Belajar Anak', icon: Users },
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
      {/* TAB 1: PENGUMUMAN SEKOLAH */}
      {/* ========================================================= */}
      {activeTab === 'pengumuman' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-700" />
              <span>Warta Resmi & Pengumuman Sekolah untuk Orang Tua</span>
            </h3>
            <p className="text-xs text-slate-500">
              Surat edaran, jadwal kegiatan sekolah, rapat komite, dan kalender pendidikan resmi SMA Katolik Setia Bakti Ruteng.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                id: 'p-1',
                title: 'Undangan Rapat Pleno Komite Sekolah & Sosialisasi Kurikulum Merdeka Berkarakter Kasih',
                date: '28 Juli 2026',
                category: 'Surat Edaran Resmi',
                sender: 'Kepala Sekolah & Komite Sekolah',
                content:
                  'Kepada Yth. Bapak/Ibu Orang Tua / Wali Siswa Kelas X, XI, dan XII. Mengundang kehadiran Bapak/Ibu dalam Rapat Pleno Tahunan Komite Sekolah pada hari Sabtu, 8 Agustus 2026, Pukul 08.30 WITA di Aula St. Fransiskus Asisi SMAK Setia Bakti Ruteng.',
              },
              {
                id: 'p-2',
                title: 'Jadwal Asesmen Sumatif Tengah Semester (ASTS) & Pembayaran Biaya Pendidikan',
                date: '24 Juli 2026',
                category: 'Akademik',
                sender: 'Wakil Kepala Sekolah Bidang Kurikulum',
                content:
                  'Diberitahukan bahwa pelaksanaan Asesmen Sumatif Tengah Semester (ASTS) Ganjil akan diselenggarakan pada 14 - 19 September 2026. Mohon para orang tua mendampingi pola belajar anak di rumah dan memastikan administrasi SPP lunas tepat waktu.',
              },
              {
                id: 'p-3',
                title: 'Misa Syukur Hari Pelindung Sekolah & Perayaan 71 Tahun Karya Kasih Setia Bakti',
                date: '20 Juli 2026',
                category: 'Kegiatan Rohani',
                sender: 'Seksi Kerohanian & OSIS',
                content:
                  'Seluruh keluarga besar yayasan dan perwakilan orang tua diundang untuk menghadiri Perayaan Ekaristi Syukur bersama Yang Mulia Uskup Ruteng pada Jumat, 14 Agustus 2026.',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white hover:border-purple-300 transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-purple-100 text-purple-800">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{item.date}</span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                  {item.content}
                </p>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Penerbit: <strong>{item.sender}</strong></span>
                  <span className="text-purple-700 font-semibold cursor-pointer hover:underline">
                    Lihat Lampiran PDF Resmi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CEK TINGKAT KEHADIRAN ANAK */}
      {/* ========================================================= */}
      {activeTab === 'kehadiran' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-purple-700" />
              <span>Tingkat Kehadiran & Rekap Presensi Anak: {child.name}</span>
            </h3>
            <p className="text-xs text-slate-500">
              Data absensi harian yang diverifikasi langsung oleh Wali Kelas ({child.className}).
            </p>
          </div>

          {/* Attendance Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-xs text-emerald-800 font-bold block">Tingkat Kehadiran</span>
              <span className="text-3xl font-black text-emerald-700">{child.attendanceRate}%</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Sangat Tertib</span>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-xs text-blue-800 font-bold block">Total Hari Hadir</span>
              <span className="text-3xl font-black text-blue-800">42</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">Hari KBM Efektif</span>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <span className="text-xs text-amber-800 font-bold block">Izin / Sakit Terverifikasi</span>
              <span className="text-3xl font-black text-amber-800">2</span>
              <span className="text-[10px] text-amber-600 block mt-0.5">Disetujui Wali Kelas</span>
            </div>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-xs text-rose-800 font-bold block">Alpa / Tanpa Keterangan</span>
              <span className="text-3xl font-black text-rose-800">0</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Nol Pelanggaran</span>
            </div>
          </div>

          {/* Daily Attendance Log */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Riwayat Presensi Harian Terkini (Bulan Ini):
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#3b1d70] text-white uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Hari & Tanggal</th>
                    <th className="px-4 py-3">Jam Masuk</th>
                    <th className="px-4 py-3">Status Kehadiran</th>
                    <th className="px-4 py-3">Wali Kelas Pencatat</th>
                    <th className="px-4 py-3">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { tgl: 'Senin, 28 Juli 2026', jam: '06:45 WITA', status: 'Hadir', guru: 'Theresia Imelda Ndua, S.Pd.', ket: 'Mengikuti Apel Bendera' },
                    { tgl: 'Jumat, 25 Juli 2026', jam: '06:50 WITA', status: 'Hadir', guru: 'Theresia Imelda Ndua, S.Pd.', ket: 'KBM Lengkap' },
                    { tgl: 'Kamis, 24 Juli 2026', jam: '06:48 WITA', status: 'Hadir', guru: 'Theresia Imelda Ndua, S.Pd.', ket: 'KBM Lengkap' },
                    { tgl: 'Rabu, 23 Juli 2026', jam: '-', status: 'Izin', guru: 'Theresia Imelda Ndua, S.Pd.', ket: 'Surat Izin Orang Tua (Urusan Keluarga)' },
                    { tgl: 'Selasa, 22 Juli 2026', jam: '06:40 WITA', status: 'Hadir', guru: 'Theresia Imelda Ndua, S.Pd.', ket: 'Piket Kelas' },
                    { tgl: 'Senin, 21 Juli 2026', jam: '06:42 WITA', status: 'Hadir', guru: 'Theresia Imelda Ndua, S.Pd.', ket: 'Apel Awal Pekan' },
                  ].map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">{log.tgl}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{log.jam}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                            log.status === 'Hadir'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{log.guru}</td>
                      <td className="px-4 py-3 text-slate-500">{log.ket}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: AJUKAN IZIN KEPADA WALI KELAS */}
      {/* ========================================================= */}
      {activeTab === 'izin' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-700" />
                <span>Pengajuan Surat Izin / Sakit kepada Wali Kelas</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ajukan surat izin ketidakhadiran anak secara online agar langsung diverifikasi oleh Wali Kelas ({child.className}).
              </p>
            </div>
            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2.5 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Pengajuan Izin Baru</span>
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Daftar Riwayat Permohonan Izin:
            </h4>

            {childRequests.map((req) => (
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded ${
                        req.type === 'Sakit'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.type}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Izin untuk {req.studentName} ({req.totalDays} Hari)
                    </span>
                  </div>

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
                </div>

                <div className="pt-2 text-xs space-y-1 text-slate-700">
                  <p>
                    <strong>Periode:</strong> {req.startDate} s/d {req.endDate}
                  </p>
                  <p>
                    <strong>Alasan / Keterangan:</strong> {req.reason}
                  </p>
                  {req.doctorLetterAttached && (
                    <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                      ✓ Disertai Surat Keterangan Dokter
                    </span>
                  )}
                  {req.reviewNotes && (
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 mt-2 text-slate-800 text-xs">
                      <strong>Respon Wali Kelas:</strong> {req.reviewNotes} ({req.reviewedBy})
                    </div>
                  )}
                </div>
              </div>
            ))}

            {childRequests.length === 0 && (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada pengajuan izin yang dibuat. Klik tombol "Buat Pengajuan Izin Baru" untuk mengajukan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: CATATAN PENTING WALI KELAS */}
      {/* ========================================================= */}
      {activeTab === 'catatan' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-700" />
              <span>Catatan Khusus Wali Kelas untuk Orang Tua</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi bimbingan kepribadian, motivasi, dan pengingat dari Wali Kelas ({child.className}).
            </p>
          </div>

          <div className="space-y-4">
            {childNotes.map((note) => (
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
                      Rekomendasi: {note.actionRequired}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {childNotes.length === 0 && (
              <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Belum ada catatan wali kelas untuk ananda saat ini.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: RAPOR & STATUS SPP */}
      {/* ========================================================= */}
      {activeTab === 'rapor' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-700" />
              <span>Rapor Hasil Belajar & Rekapitulasi SPP</span>
            </h3>
            <p className="text-xs text-slate-500">
              Laporan kemajuan capaian belajar dan status administrasi keuangan siswa.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 text-center">
              <span className="text-xs text-purple-900 font-semibold block">Indeks Prestasi Kumulatif</span>
              <span className="text-3xl font-black text-purple-950">{child.gpa}</span>
              <span className="text-[10px] text-purple-700 block mt-1">Predikat: Amat Baik</span>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-xs text-emerald-900 font-semibold block">Status Pembayaran SPP</span>
              <span className="text-2xl font-black text-emerald-800 mt-1 block">{child.tuitionStatus}</span>
              <span className="text-[10px] text-emerald-700 block mt-1">Lunas s/d Semester Ganjil</span>
            </div>
            <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-center">
              <span className="text-xs text-sky-900 font-semibold block">Ranking Kelas</span>
              <span className="text-3xl font-black text-sky-950">#2</span>
              <span className="text-[10px] text-sky-700 block mt-1">Peringkat 2 Kelas {child.className}</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: AJUKAN IZIN KEPADA WALI KELAS */}
      {/* ========================================================= */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#3b1d70] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-amber-300" />
                <span>Formulir Pengajuan Izin ke Wali Kelas</span>
              </h3>
              <button onClick={() => setShowLeaveModal(false)} className="text-white/80 hover:text-white p-1">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitLeave} className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-slate-800 font-semibold">
                  Nama Siswa: <strong>{child.name}</strong> ({child.className})
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Wali Kelas Penerima: Theresia Imelda Ndua, S.Pd., M.Si.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Jenis Izin</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Sakit', 'Izin', 'Lainnya'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLeaveType(t)}
                      className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-colors ${
                        leaveType === t
                          ? 'border-purple-700 bg-purple-100 text-purple-950 shadow-sm'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mulai Tanggal</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jumlah Hari Izin</label>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    required
                    value={totalDays}
                    onChange={(e) => setTotalDays(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor HP Orang Tua</label>
                  <input
                    type="text"
                    required
                    value={parentPhoneInput}
                    onChange={(e) => setParentPhoneInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alasan Izin Secara Detail</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Contoh: Mengalami demam dan batuk pilek, disarankan dokter istirahat di rumah..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                />
              </div>

              {leaveType === 'Sakit' && (
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="docLetter"
                    checked={hasDoctorLetter}
                    onChange={(e) => setHasDoctorLetter(e.target.checked)}
                    className="rounded text-purple-700 focus:ring-purple-600"
                  />
                  <label htmlFor="docLetter" className="text-slate-700 cursor-pointer">
                    Lampirkan Surat Keterangan Dokter / Bukti Pemeriksaan Medis
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#432874] hover:bg-[#341b5e] text-white rounded-lg font-bold shadow"
                >
                  Kirim Pengajuan ke Wali Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
