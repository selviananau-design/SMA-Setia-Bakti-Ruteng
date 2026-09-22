import React, { useState } from 'react';
import {
  Bell,
  ShieldCheck,
  Send,
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock,
  Radio,
} from 'lucide-react';
import { PushNotification, UserSession } from '../../types';
import { getAuditLogs, EncryptionAuditLog } from '../../services/encryption';

interface AdminSecurityNotifTabProps {
  session: UserSession;
  notifications: PushNotification[];
  onSendPushNotification: (
    title: string,
    message: string,
    target: 'all' | 'guru' | 'orangtua' | 'siswa',
    priority: 'urgent' | 'info' | 'akademik'
  ) => void;
}

export const AdminSecurityNotifTab: React.FC<AdminSecurityNotifTabProps> = ({
  session,
  notifications,
  onSendPushNotification,
}) => {
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifTarget, setNotifTarget] = useState<'all' | 'guru' | 'orangtua' | 'siswa'>('all');
  const [notifPriority, setNotifPriority] = useState<'urgent' | 'info' | 'akademik'>('urgent');

  const auditLogs = getAuditLogs();

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) {
      alert('Mohon isi judul dan pesan notifikasi!');
      return;
    }

    onSendPushNotification(notifTitle, notifMessage, notifTarget, notifPriority);
    setNotifTitle('');
    setNotifMessage('');
    alert('Notifikasi push berhasil disiarkan secara real-time ke seluruh pengguna website!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase tracking-wider">
              Real-Time Push
            </span>
            <span className="text-xs text-slate-400">• Terenkripsi AES-256</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Pusat Siaran Notifikasi & Audit Keamanan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Siarkan pengumuman kilat yang langsung muncul di banner website dan pantau log audit dekripsi data sensitif.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Broadcast Form */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse text-purple-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Siarkan Notifikasi Push Real-Time</h3>
              <p className="text-xs text-slate-500">Notifikasi akan langsung tampil di layar pengguna.</p>
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Pengumuman *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Pengumuman Libur Hari Raya & Jadwal Rapor"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Sasaran</label>
                <select
                  value={notifTarget}
                  onChange={(e) => setNotifTarget(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                >
                  <option value="all">Semua Pengunjung Website</option>
                  <option value="guru">Dewan Guru & Pendidik</option>
                  <option value="orangtua">Orang Tua Siswa</option>
                  <option value="siswa">Siswa & Calon Peserta Didik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tingkat Prioritas</label>
                <select
                  value={notifPriority}
                  onChange={(e) => setNotifPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                >
                  <option value="urgent">Mendesak / Urgent (Merah)</option>
                  <option value="akademik">Akademik & Ujian (Ungu)</option>
                  <option value="info">Informasi Umum (Biru)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Isi Pesan Notifikasi *</label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan pengumuman penting secara ringkas dan jelas..."
                value={notifMessage}
                onChange={(e) => setNotifMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Siarkan Notifikasi Sekarang</span>
            </button>
          </form>
        </div>

        {/* Right 6 cols: Security Audit Log */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Log Audit Keamanan & Enkripsi AES-256</h3>
              <p className="text-xs text-slate-500">Pencatatan riwayat enkripsi & dekripsi data identitas siswa.</p>
            </div>
          </div>

          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {auditLogs.map((log: EncryptionAuditLog) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        log.action === 'ENCRYPT'
                          ? 'bg-blue-100 text-blue-800'
                          : log.action === 'DECRYPT'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800">{log.actor}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{log.fieldAffected}</p>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {log.timestamp}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    log.status === 'SUCCESS' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                  }`}
                >
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
