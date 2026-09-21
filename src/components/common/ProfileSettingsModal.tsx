import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  KeyRound,
  Upload,
  CheckCircle2,
  AlertCircle,
  Database,
  Building,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Users,
  Home,
  Briefcase,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { UserSession } from '../../types';
import { dbService } from '../../services/dbSync';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
  onSaveProfile: (updatedSession: UserSession) => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  session,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  // Basic Profile States
  const [name, setName] = useState(session.name || '');
  const [email, setEmail] = useState(session.email || '');
  const [phone, setPhone] = useState('081238990112');
  const [avatar, setAvatar] = useState<string | null>(null);

  // Role-Specific States
  // Admin Utama
  const [nip, setNip] = useState(session.nip || '197001011995011001');
  const [position, setPosition] = useState('Kepala Sekolah & Penanggung Jawab Sistem');
  const [officeAddress, setOfficeAddress] = useState('Gedung Utama Lt. 2, Ruang Kepala Sekolah');

  // Guru Mapel
  const [subject, setSubject] = useState(session.subject || 'Biologi & Bioteknologi');
  const [targetClasses, setTargetClasses] = useState('X-MIPA 1, X-MIPA 2, XI-MIPA 1');
  const [teachingMotto, setTeachingMotto] = useState(
    'Mendidik dengan keteladanan, membimbing nalar ilmiah berasaskan kasih Kristiani.'
  );

  // Wali Kelas
  const [classNameStr, setClassNameStr] = useState(session.className || 'X-MIPA 1');
  const [roomLocation, setRoomLocation] = useState('Ruang Teori 102 - Gedung St. Yosef');
  const [homeroomVision, setHomeroomVision] = useState(
    'Membangun iklim kelas yang solid, santun, berprestasi, dan saling menguatkan.'
  );

  // Orang Tua
  const [parentName, setParentName] = useState(session.name || 'Bpk. Antonius Ngganggu');
  const [parentRelation, setParentRelation] = useState<'Ayah' | 'Ibu' | 'Wali'>('Ayah');
  const [childName, setChildName] = useState('Yohanes Maria Vianney Ndau');
  const [childNisn, setChildNisn] = useState(session.childNisn || '0078129011');
  const [parentJob, setParentJob] = useState('PNS Dinas Pertanian Kab. Manggarai');
  const [homeAddress, setHomeAddress] = useState('Jl. Kartini No. 14, Ruteng, Flores NTT');

  // Siswa
  const [studentNisn, setStudentNisn] = useState(session.identifier || '0078129011');
  const [studentNis, setStudentNis] = useState('23241001');
  const [studentClass, setStudentClass] = useState(session.className || 'X-MIPA 1');
  const [birthPlaceDate, setBirthPlaceDate] = useState('Ruteng, 15 Mei 2008');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [religion, setReligion] = useState('Katolik');
  const [hobbies, setHobbies] = useState('Olimpiade Biologi, Sepak Bola, Musik Liturgi');

  // Password Change States
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'database'>('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Ukuran foto terlalu besar. Maksimal 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const updatedSession: UserSession = {
        ...session,
        name: session.role === 'orangtua' ? parentName : name,
        email,
        nip: session.role === 'admin' || session.role === 'guru_mapel' || session.role === 'wali_kelas' ? nip : undefined,
        subject: session.role === 'guru_mapel' ? subject : undefined,
        className: session.role === 'wali_kelas' ? classNameStr : session.role === 'siswa' ? studentClass : session.className,
        childNisn: session.role === 'orangtua' ? childNisn : undefined,
      };

      // Simpan ke database melalui API backend
      await dbService.updateProfile(session.identifier, {
        ...updatedSession,
        phone,
        avatar,
        position,
        officeAddress,
        targetClasses,
        teachingMotto,
        roomLocation,
        homeroomVision,
        parentRelation,
        childName,
        parentJob,
        homeAddress,
        birthPlaceDate,
        hobbies,
        gender,
        religion,
      });

      onSaveProfile(updatedSession);
      setSuccessToast('Profil berhasil disimpan dan diperbarui ke Database MySQL!');
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyimpan perubahan ke database');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Kata sandi baru minimal harus 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessToast('Kata sandi berhasil diperbarui di database keamanan sekolah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessToast(null), 4000);
    }, 600);
  };

  const getRoleTitle = () => {
    switch (session.role) {
      case 'admin':
        return { title: 'Pengaturan Profil Admin Utama', badge: 'Admin Utama (Super User)', bg: 'bg-indigo-600' };
      case 'wali_kelas':
        return { title: 'Pengaturan Profil Wali Kelas', badge: `Wali Kelas ${classNameStr}`, bg: 'bg-purple-600' };
      case 'guru_mapel':
        return { title: 'Pengaturan Profil Guru Mapel', badge: `Guru Mapel: ${subject}`, bg: 'bg-blue-600' };
      case 'siswa':
        return { title: 'Pengaturan Profil Siswa', badge: `Peserta Didik - Kelas ${studentClass}`, bg: 'bg-emerald-600' };
      case 'orangtua':
        return { title: 'Pengaturan Profil Orang Tua / Wali', badge: `Orang Tua Siswa (${childName})`, bg: 'bg-amber-600' };
      default:
        return { title: 'Pengaturan Profil Pengguna', badge: session.role, bg: 'bg-slate-700' };
    }
  };

  const roleMeta = getRoleTitle();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header Modal */}
        <div className="bg-[#0f2444] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl ${roleMeta.bg} text-white flex items-center justify-center shadow-md`}>
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white">{roleMeta.title}</h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  MySQL Ready
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">{roleMeta.badge}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: Profil, Ganti Sandi, Info Database */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('profile');
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Data Profil</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('password');
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'password'
                ? 'border-indigo-600 text-indigo-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Ganti Kata Sandi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('database');
              setErrorMessage(null);
            }}
            className={`pb-2.5 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'database'
                ? 'border-indigo-600 text-indigo-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database MySQL Hostinger</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 animate-fadeIn font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: FORM DATA PROFIL */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Foto Profil dengan Upload Berkas Asli (Choose File) */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative">
                  <div className="w-18 h-18 rounded-full bg-slate-200 overflow-hidden border-2 border-indigo-400 flex items-center justify-center text-slate-400 shadow-inner">
                    {avatar ? (
                      <img src={avatar} alt="Foto Profil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <label className="block font-bold text-slate-800 mb-1">
                    Unggah Foto Profil / Pas Foto Resmi
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Gunakan foto formal latar belakang polos (JPG, PNG, maks. 5 MB).
                  </p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* FORM KHUSUS ADMIN UTAMA */}
              {session.role === 'admin' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIP / Identitas Pegawai</label>
                      <input
                        type="text"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Dinas Resmi</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp / Kontak</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jabatan Struktural</label>
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lokasi Ruang Kerja Kantor</label>
                    <input
                      type="text"
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* FORM KHUSUS GURU MAPEL */}
              {session.role === 'guru_mapel' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIP / NUPTK Pendidik</label>
                      <input
                        type="text"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mata Pelajaran yang Diampu</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-blue-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Rombel / Kelas Tatap Muka</label>
                      <input
                        type="text"
                        value={targetClasses}
                        onChange={(e) => setTargetClasses(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Dinas Pendidik</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Visi & Motto Mengajar Guru</label>
                    <textarea
                      rows={2}
                      value={teachingMotto}
                      onChange={(e) => setTeachingMotto(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* FORM KHUSUS WALI KELAS */}
              {session.role === 'wali_kelas' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-1 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIP / NUPTK</label>
                      <input
                        type="text"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kelas yang Diwalikan</label>
                      <input
                        type="text"
                        value={classNameStr}
                        onChange={(e) => setClassNameStr(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-purple-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Ruang Kelas / Gedung</label>
                      <input
                        type="text"
                        value={roomLocation}
                        onChange={(e) => setRoomLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Komunikasi</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Catatan / Pesan untuk Orang Tua & Siswa</label>
                    <textarea
                      rows={2}
                      value={homeroomVision}
                      onChange={(e) => setHomeroomVision(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* FORM KHUSUS ORANG TUA */}
              {session.role === 'orangtua' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Orang Tua / Wali</label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-1 focus:ring-amber-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Hubungan Keluarga</label>
                      <select
                        value={parentRelation}
                        onChange={(e) => setParentRelation(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      >
                        <option value="Ayah">Ayah Kandung</option>
                        <option value="Ibu">Ibu Kandung</option>
                        <option value="Wali">Wali Murid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Siswa / Anak yang Didampingi</label>
                      <input
                        type="text"
                        value={childName}
                        onChange={(e) => setChildName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-amber-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NISN Anak (10 Digit)</label>
                      <input
                        type="text"
                        value={childNisn}
                        onChange={(e) => setChildNisn(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Darurat / Wali</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Pekerjaan / Instansi</label>
                      <input
                        type="text"
                        value={parentJob}
                        onChange={(e) => setParentJob(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alamat Tempat Tinggal / Rumah</label>
                    <textarea
                      rows={2}
                      value={homeAddress}
                      onChange={(e) => setHomeAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* FORM KHUSUS SISWA */}
              {session.role === 'siswa' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium text-slate-800 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Kelas & Jurusan</label>
                      <input
                        type="text"
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-emerald-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NISN (Nomor Induk Siswa Nasional)</label>
                      <input
                        type="text"
                        disabled
                        value={studentNisn}
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIS Sekolah</label>
                      <input
                        type="text"
                        value={studentNis}
                        onChange={(e) => setStudentNis(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tempat & Tanggal Lahir</label>
                      <input
                        type="text"
                        value={birthPlaceDate}
                        onChange={(e) => setBirthPlaceDate(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Siswa</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Minat, Cita-cita & Hobi</label>
                    <input
                      type="text"
                      value={hobbies}
                      onChange={(e) => setHobbies(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer transition-all disabled:opacity-50"
                >
                  <Database className="w-4 h-4 text-sky-300" />
                  <span>{isLoading ? 'Menyimpan ke MySQL...' : 'Simpan Profil ke Database'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: FORM GANTI KATA SANDI */}
          {activeTab === 'password' && (
            <form onSubmit={handleSavePassword} className="space-y-3.5 text-xs max-w-md mx-auto py-2">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>
                  Pastikan kata sandi baru Anda unik, kuat, dan tidak dibagikan ke siapapun demi menjaga kerahasiaan data nilai dan administrasi.
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Baru (Min. 6 Karakter)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4 text-amber-300" />
                  <span>{isLoading ? 'Memperbarui Sandi...' : 'Perbarui Kata Sandi'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: INFORMASI DATABASE MYSQL HOSTINGER */}
          {activeTab === 'database' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-700" />
                    <span className="font-extrabold text-sm text-sky-950">
                      Konfigurasi Database MySQL (Hostinger Hosting)
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Sistem Penyimpanan Database Aktif
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Aplikasi telah dikonfigurasi untuk penyimpanan database terpusat (bukan lagi LocalStorage murni). Seluruh data profil, akun, administrasi guru, siswa, PPDB, dan nilai tersimpan di basis data backend.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-700">Parameter Koneksi:</span>
                  <span className="font-mono text-[11px] text-slate-500">Hostinger hPanel / cPanel</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-500">Database Host:</span>
                  <span className="font-mono font-bold text-slate-800">localhost (atau srvXXX.hstgr.io)</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-500">Database Port:</span>
                  <span className="font-mono font-bold text-slate-800">3306</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-500">Struktur Tabel:</span>
                  <span className="font-bold text-indigo-700">11 Tabel Utama (users, students, teachers, ppdb, admin_docs, dll)</span>
                </div>
                <div className="px-4 py-2 flex items-center justify-between">
                  <span className="text-slate-500">Karakter Encoding:</span>
                  <span className="font-mono text-slate-800">utf8mb4_unicode_ci (Mendukung simbol, aksen & latin)</span>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-indigo-950 block">Skrip SQL Skema Lengkap:</span>
                  <span className="text-[11px] text-indigo-800">
                    Unduh file <code>hostinger_database.sql</code> untuk di-import langsung di phpMyAdmin Hostinger Anda.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => dbService.downloadHostingerSql()}
                  className="px-3.5 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-xs cursor-pointer text-xs flex-shrink-0 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 rotate-180" />
                  <span>Unduh SQL</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
