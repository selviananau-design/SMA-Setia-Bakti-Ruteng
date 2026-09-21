import React, { useState } from 'react';
import { Lock, UserCheck, ShieldCheck, User, Users, GraduationCap, X, KeyRound, AlertCircle, BookOpen } from 'lucide-react';
import { UserRole, UserSession } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else if (role === 'wali_kelas') {
      setUsername('walikelas');
      setPassword('wali123');
    } else if (role === 'guru_mapel') {
      setUsername('gurumapel');
      setPassword('mapel123');
    } else if (role === 'siswa') {
      setUsername('0078129011');
      setPassword('siswa123');
    } else if (role === 'orangtua') {
      setUsername('0078129011');
      setPassword('ortu123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedRole === 'admin') {
      if ((username === 'admin' && password === 'admin123') || password) {
        onLoginSuccess({
          role: 'admin',
          name: 'Drs. Petrus Kanisius Dadi (Admin Utama)',
          identifier: username || 'admin',
          token: 'token_admin_super_secret',
          email: 'admin@smaksetiabakti.sch.id',
        });
        onClose();
        return;
      }
    } else if (selectedRole === 'wali_kelas') {
      onLoginSuccess({
        role: 'wali_kelas',
        teacherType: 'wali_kelas',
        name: 'Theresia Imelda Ndua, S.Pd., M.Si. (Wali Kelas X-MIPA 1)',
        identifier: username || '198811202015022004',
        nip: username || '198811202015022004',
        token: 'token_wali_auth',
        email: 'theresia.ndua@smaksetiabakti.sch.id',
        className: 'X-MIPA 1',
      });
      onClose();
      return;
    } else if (selectedRole === 'guru_mapel') {
      onLoginSuccess({
        role: 'guru_mapel',
        teacherType: 'guru_mapel',
        name: 'Drs. Fransiskus Xaverius, M.Pd. (Guru Biologi & Bioteknologi)',
        identifier: username || '198504122010011012',
        nip: username || '198504122010011012',
        token: 'token_mapel_auth',
        email: 'fransiskus.xaverius@smaksetiabakti.sch.id',
        subject: 'Biologi & Bioteknologi',
        className: 'X-MIPA 1',
      });
      onClose();
      return;
    } else if (selectedRole === 'siswa') {
      onLoginSuccess({
        role: 'siswa',
        name: 'Yohanes Maria Vianney Ndau',
        identifier: username || '0078129011',
        token: 'token_siswa_auth',
        className: 'X-MIPA 1',
      });
      onClose();
      return;
    } else if (selectedRole === 'orangtua') {
      onLoginSuccess({
        role: 'orangtua',
        name: 'Bpk. Antonius Ngganggu (Orang Tua Yohanes Ndau)',
        identifier: username || '0078129011',
        token: 'token_ortu_auth',
        childNisn: '0078129011',
        className: 'X-MIPA 1',
      });
      onClose();
      return;
    }

    setErrorMsg('Kredensial login tidak valid. Silakan gunakan kredensial demo di bawah.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#17325c] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-400/40 flex items-center justify-center text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sistem Login Terpadu</h3>
              <p className="text-xs text-sky-200">SMA Katolik Setia Bakti Ruteng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-5 pb-0">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Pilih Peran Pengguna:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'admin'
                  ? 'border-sky-700 bg-sky-50 text-sky-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span className="text-[11px] font-bold">Admin Utama</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('wali_kelas')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'wali_kelas'
                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-[11px] font-bold">Wali Kelas</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('guru_mapel')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'guru_mapel'
                  ? 'border-blue-700 bg-blue-50 text-blue-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span className="text-[11px] font-bold">Guru Mapel</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('siswa')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'siswa'
                  ? 'border-purple-700 bg-purple-50 text-purple-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-purple-700" />
              <span className="text-[11px] font-bold">Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('orangtua')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'orangtua'
                  ? 'border-amber-700 bg-amber-50 text-amber-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-amber-700" />
              <span className="text-[11px] font-bold">Orang Tua</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {selectedRole === 'admin' && 'Username Admin'}
              {selectedRole === 'wali_kelas' && 'NIP / NUPTK / Username Wali Kelas'}
              {selectedRole === 'guru_mapel' && 'NIP / NUPTK / Username Guru Mapel'}
              {selectedRole === 'siswa' && 'NISN Siswa (10 Digit)'}
              {selectedRole === 'orangtua' && 'NISN Siswa (Anak Anda)'}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  selectedRole === 'admin'
                    ? 'admin'
                    : selectedRole === 'wali_kelas'
                    ? 'walikelas (atau 198811202015022004)'
                    : selectedRole === 'guru_mapel'
                    ? 'gurumapel (atau 198504122010011012)'
                    : '0078129011'
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-600 focus:outline-none font-mono"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi / PIN</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-sky-600 focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Demo Credentials Helper Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 space-y-1">
            <span className="font-bold block text-slate-700">Kredensial Akses Cepat Demo:</span>
            {selectedRole === 'admin' && (
              <p className="text-slate-600">
                User: <code className="font-bold text-sky-800 font-mono">admin</code> | Sandi:{' '}
                <code className="font-bold text-sky-800 font-mono">admin123</code> (Admin Utama - Kelola Master Data, Guru, Siswa, Supervisi Dokumen)
              </p>
            )}
            {selectedRole === 'wali_kelas' && (
              <p className="text-slate-600">
                User: <code className="font-bold text-emerald-800 font-mono">walikelas</code> | Sandi:{' '}
                <code className="font-bold text-emerald-800 font-mono">wali123</code> (Dasbor Eksklusif Wali Kelas: Presensi harian rombel, pembinaan, verifikasi izin orang tua)
              </p>
            )}
            {selectedRole === 'guru_mapel' && (
              <p className="text-slate-600">
                User: <code className="font-bold text-blue-800 font-mono">gurumapel</code> | Sandi:{' '}
                <code className="font-bold text-blue-800 font-mono">mapel123</code> (Dasbor Eksklusif Guru Mapel: Bahan ajar modul merdeka, tugas & penilaian, presensi tatap muka KBM, upload administrasi guru)
              </p>
            )}
            {selectedRole === 'siswa' && (
              <p className="text-slate-600">
                User NISN: <code className="font-bold text-purple-800 font-mono">0078129011</code> | Sandi:{' '}
                <code className="font-bold text-purple-800 font-mono">siswa123</code> (Unduh Bahan Ajar, Kumpul Tugas, Diskusi Guru & Catatan Wali)
              </p>
            )}
            {selectedRole === 'orangtua' && (
              <p className="text-slate-600">
                User NISN: <code className="font-bold text-amber-800 font-mono">0078129011</code> | Sandi:{' '}
                <code className="font-bold text-amber-800 font-mono">ortu123</code> (Pengumuman, Cek Kehadiran Anak, Ajukan Izin ke Wali Kelas)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#17325c] hover:bg-[#0e2a47] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Masuk ke Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
