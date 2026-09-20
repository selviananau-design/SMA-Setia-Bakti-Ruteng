import React, { useState } from 'react';
import { Lock, UserCheck, ShieldCheck, User, Users, GraduationCap, X, KeyRound, AlertCircle } from 'lucide-react';
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
    } else if (role === 'guru') {
      setUsername('198811202015022004');
      setPassword('guru123');
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
      if (username === 'admin' && password === 'admin123') {
        onLoginSuccess({
          role: 'admin',
          name: 'Drs. Petrus Kanisius Dadi (Admin Utama)',
          identifier: 'admin',
          token: 'token_admin_super_secret',
          email: 'admin@smaksetiabakti.sch.id',
        });
        onClose();
        return;
      }
    } else if (selectedRole === 'guru') {
      onLoginSuccess({
        role: 'guru',
        name: 'Theresia Imelda Ndua, S.Pd., M.Si. (Wali Kelas X-MIPA 1 & Guru Biologi)',
        identifier: username || '198811202015022004',
        token: 'token_guru_auth',
        email: 'theresia.ndua@smaksetiabakti.sch.id',
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#3b1d70] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/30 flex items-center justify-center text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Sistem Login Terpadu</h3>
              <p className="text-xs text-purple-200">SMA Katolik Setia Bakti Ruteng</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-5 pb-0">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Pilih Peran Pengguna:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'admin'
                  ? 'border-purple-700 bg-purple-50 text-purple-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span className="text-xs">Admin Utama</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('guru')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'guru'
                  ? 'border-purple-700 bg-purple-50 text-purple-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-purple-700" />
              <span className="text-xs">Guru Pendidik</span>
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
              <span className="text-xs">Siswa</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('orangtua')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                selectedRole === 'orangtua'
                  ? 'border-purple-700 bg-purple-50 text-purple-950 font-bold shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4 text-purple-700" />
              <span className="text-xs">Orang Tua</span>
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
              {selectedRole === 'guru' && 'NIP / NUPTK Guru'}
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
                    : selectedRole === 'guru'
                    ? '19881120...'
                    : '0078129011'
                }
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none font-mono"
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
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Demo Credentials Helper Box */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-1">
            <span className="font-bold block">Kredensial Akses Cepat Demo:</span>
            {selectedRole === 'admin' && (
              <p className="text-slate-600">
                User: <code className="font-bold text-purple-800 font-mono">admin</code> | Sandi:{' '}
                <code className="font-bold text-purple-800 font-mono">admin123</code> (Admin Utama - Kelola Data Siswa, Guru, Profil, Berita, Jurusan, Ekskul, Karya)
              </p>
            )}
            {selectedRole === 'guru' && (
              <p className="text-slate-600">
                User: <code className="font-bold text-purple-800 font-mono">guru</code> (atau NIP) | Sandi:{' '}
                <code className="font-bold text-purple-800 font-mono">guru123</code> (Mode Wali Kelas & Guru Mapel: Nilai, Bahan Ajar, Tugas, Izin)
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
                User NISN: <code className="font-bold text-purple-800 font-mono">0078129011</code> | Sandi:{' '}
                <code className="font-bold text-purple-800 font-mono">ortu123</code> (Pengumuman, Cek Kehadiran Anak, Ajukan Izin ke Wali Kelas)
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <span>Masuk ke Portal</span>
          </button>
        </form>
      </div>
    </div>
  );
};
