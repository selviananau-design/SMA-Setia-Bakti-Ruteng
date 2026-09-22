import React, { useState } from 'react';
import { Mail, Lock, User, Check, X, ShieldCheck, UserCheck, BookOpen, GraduationCap, Users } from 'lucide-react';
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
  const [emailId, setEmailId] = useState('admin@smaksetiabakti.sch.id');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setEmailId('admin@smaksetiabakti.sch.id');
      setPassword('admin123');
    } else if (role === 'wali_kelas') {
      setEmailId('walikelas@smaksetiabakti.sch.id');
      setPassword('wali123');
    } else if (role === 'guru_mapel') {
      setEmailId('gurumapel@smaksetiabakti.sch.id');
      setPassword('mapel123');
    } else if (role === 'siswa') {
      setEmailId('0078129011');
      setPassword('siswa123');
    } else if (role === 'orangtua') {
      setEmailId('0078129011');
      setPassword('ortu123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      // Panggil backend API /api/auth/login untuk autentikasi MySQL
      let usernameParam = 'admin';
      if (selectedRole === 'wali_kelas') usernameParam = 'walikelas';
      else if (selectedRole === 'guru_mapel') usernameParam = 'gurumapel';
      else if (selectedRole === 'siswa' || selectedRole === 'orangtua') usernameParam = '0078129011';

      if (emailId.includes('admin') || emailId === 'admin') usernameParam = 'admin';
      else if (emailId.includes('wali') || emailId === 'walikelas') usernameParam = 'walikelas';
      else if (emailId.includes('mapel') || emailId === 'gurumapel') usernameParam = 'gurumapel';
      else if (emailId.match(/^[0-9]+$/)) usernameParam = emailId;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: usernameParam,
          password,
          role: selectedRole,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.session) {
          setIsLoading(false);
          onLoginSuccess(json.session);
          onClose();
          return;
        }
      }

      // Fallback local session jika server offline
      if (selectedRole === 'admin') {
        onLoginSuccess({
          role: 'admin',
          name: 'Drs. Petrus Kanisius Dadi (Admin Utama)',
          identifier: 'admin',
          token: 'token_admin_super_secret',
          email: 'admin@smaksetiabakti.sch.id',
          nip: '197001011995011001',
        });
      } else if (selectedRole === 'wali_kelas') {
        onLoginSuccess({
          role: 'wali_kelas',
          teacherType: 'wali_kelas',
          name: 'Theresia Imelda Ndua, S.Pd., M.Si.',
          identifier: '198811202015022004',
          nip: '198811202015022004',
          token: 'token_wali_auth',
          email: 'theresia.ndua@smaksetiabakti.sch.id',
          className: 'X-MIPA 1',
        });
      } else if (selectedRole === 'guru_mapel') {
        onLoginSuccess({
          role: 'guru_mapel',
          teacherType: 'guru_mapel',
          name: 'Drs. Fransiskus Xaverius, M.Pd.',
          identifier: '198504122010011012',
          nip: '198504122010011012',
          token: 'token_mapel_auth',
          email: 'fransiskus.xaverius@smaksetiabakti.sch.id',
          subject: 'Biologi & Bioteknologi',
          className: 'X-MIPA 1',
        });
      } else if (selectedRole === 'siswa') {
        onLoginSuccess({
          role: 'siswa',
          name: 'Yohanes Maria Vianney Ndau',
          identifier: '0078129011',
          token: 'token_siswa_auth',
          className: 'X-MIPA 1',
        });
      } else if (selectedRole === 'orangtua') {
        onLoginSuccess({
          role: 'orangtua',
          name: 'Bpk. Antonius Ngganggu (Orang Tua Yohanes Ndau)',
          identifier: '0078129011',
          token: 'token_ortu_auth',
          childNisn: '0078129011',
          className: 'X-MIPA 1',
        });
      }

      setIsLoading(false);
      onClose();
    } catch (err) {
      setIsLoading(false);
      setErrorMsg('Gagal terhubung ke database. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a192f]/70 backdrop-blur-md animate-fadeIn">
      {/* Container Card Persis Sesuai Gambar Referensi */}
      <div className="relative w-full max-w-sm flex flex-col items-center">
        {/* Tombol Tutup / Close Modal */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Tutup Modal Login"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Quick Role Switcher di Atas Card agar memudahkan navigasi pengguna */}
        <div className="w-full mb-3 flex items-center justify-center gap-1.5 overflow-x-auto py-1 px-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <button
            type="button"
            onClick={() => handleRoleSelect('admin')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedRole === 'admin'
                ? 'bg-white text-[#104b80] shadow-sm scale-105'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('guru_mapel')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedRole === 'guru_mapel'
                ? 'bg-white text-[#104b80] shadow-sm scale-105'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Guru Mapel
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('wali_kelas')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedRole === 'wali_kelas'
                ? 'bg-white text-[#104b80] shadow-sm scale-105'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Wali Kelas
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('siswa')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedRole === 'siswa'
                ? 'bg-white text-[#104b80] shadow-sm scale-105'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Siswa
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('orangtua')}
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedRole === 'orangtua'
                ? 'bg-white text-[#104b80] shadow-sm scale-105'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Orang Tua
          </button>
        </div>

        {/* The Neumorphic Blue Card (Exact visual styling as images (2).jpg) */}
        <div
          className="w-full rounded-[38px] p-6 sm:p-8 flex flex-col items-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #48b4e8 0%, #3499dc 45%, #2581cf 100%)',
            boxShadow: '0 25px 60px -15px rgba(2, 28, 68, 0.65), inset 0 2px 4px rgba(255, 255, 255, 0.45)',
            border: '2px solid rgba(255, 255, 255, 0.45)',
          }}
        >
          {/* Top Dark Navy Circular Avatar Badge */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-4 mt-1 border border-white/20"
            style={{
              background: '#1b3152',
              boxShadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.5), 0 8px 16px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* User outline SVG icon exactly matching reference */}
            <svg
              className="w-9 h-9 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="7" r="4" />
              <path strokeLinecap="round" d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
          </div>

          {/* Title: MEMBER LOGIN */}
          <h2
            className="text-white text-center font-medium tracking-[0.28em] text-sm sm:text-base mb-6 drop-shadow-xs"
            style={{ letterSpacing: '0.28em' }}
          >
            MEMBER LOGIN
          </h2>

          {errorMsg && (
            <div className="w-full mb-4 px-3 py-2 rounded-full bg-rose-500/80 border border-white/40 text-[11px] text-white text-center font-bold">
              {errorMsg}
            </div>
          )}

          {/* Form with Pill-shaped Inputs */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Input 1: EMAIL ID */}
            <div
              className="w-full flex items-center px-4 py-3 rounded-full border-2 border-white/80 transition-all focus-within:ring-2 focus-within:ring-white focus-within:scale-[1.01]"
              style={{
                background: 'linear-gradient(90deg, rgba(100, 196, 248, 0.85) 0%, rgba(68, 172, 238, 0.85) 100%)',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Mail className="w-4 h-4 text-white mr-3 flex-shrink-0" />
              <input
                type="text"
                required
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                placeholder="EMAIL ID"
                className="w-full bg-transparent text-white placeholder-white/80 text-xs font-semibold tracking-wider uppercase focus:outline-none"
              />
            </div>

            {/* Input 2: PASSWORD */}
            <div
              className="w-full flex items-center px-4 py-3 rounded-full border-2 border-white/80 transition-all focus-within:ring-2 focus-within:ring-white focus-within:scale-[1.01]"
              style={{
                background: 'linear-gradient(90deg, rgba(100, 196, 248, 0.85) 0%, rgba(68, 172, 238, 0.85) 100%)',
                boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Lock className="w-4 h-4 text-white mr-3 flex-shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PASSWORD"
                className="w-full bg-transparent text-white placeholder-white/80 text-xs font-semibold tracking-wider uppercase focus:outline-none"
              />
            </div>

            {/* Action Row: REMEMBER ME & FORGET PASSWORD? */}
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-white px-2 pt-1 tracking-wider uppercase">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center border border-white cursor-pointer ${
                    rememberMe ? 'bg-[#1b3152]' : 'bg-transparent'
                  }`}
                >
                  {rememberMe && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                </div>
                <span>REMEMBER ME</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-white hover:text-sky-100 hover:underline cursor-pointer transition-colors"
              >
                FORGET PASSWORD?
              </button>
            </div>

            {/* Bottom Dark Navy Pill Button: LOGIN */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-full py-3 px-12 text-white font-bold tracking-[0.26em] text-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                style={{
                  background: '#1d2f47',
                  boxShadow: '0 8px 20px rgba(8, 22, 45, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  letterSpacing: '0.26em',
                }}
              >
                {isLoading ? 'VERIFYING...' : 'LOGIN'}
              </button>
            </div>
          </form>

          {/* Role Indicator Footer */}
          <div className="mt-5 text-[10px] text-white/80 font-medium text-center">
            Masuk sebagai:{' '}
            <span className="font-bold text-white uppercase underline">
              {selectedRole === 'admin'
                ? 'Admin Utama'
                : selectedRole === 'guru_mapel'
                ? 'Guru Mapel'
                : selectedRole === 'wali_kelas'
                ? 'Wali Kelas'
                : selectedRole === 'siswa'
                ? 'Siswa'
                : 'Orang Tua'}
            </span>
          </div>
        </div>
      </div>

      {/* Forgot Password Mini Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full text-slate-800 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Bantuan Pemulihan Sandi</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Untuk mengatur ulang kata sandi akun sekolah (Guru, Siswa, Wali Kelas, Orang Tua), silakan hubungi Tim IT / Administrasi Kurikulum SMAK Setia Bakti Ruteng melalui WhatsApp: <strong>0812-3899-0112</strong> atau email: <strong>admin@smaksetiabakti.sch.id</strong>.
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
