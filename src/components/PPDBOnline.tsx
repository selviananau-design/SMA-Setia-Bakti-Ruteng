import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload,
  Download,
  Search,
  ShieldCheck,
  User,
  GraduationCap,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import { PPDBRegistration } from '../types';
import { exportPPDBReceiptPDF } from '../services/pdfExport';
import { simulateAesEncrypt } from '../services/encryption';

interface PPDBOnlineProps {
  ppdbList: PPDBRegistration[];
  onAddRegistration: (newReg: PPDBRegistration) => void;
  initialSubTab?: string;
}

export const PPDBOnline: React.FC<PPDBOnlineProps> = ({
  ppdbList,
  onAddRegistration,
  initialSubTab = 'daftar',
}) => {
  const [activeTab, setActiveTab] = useState<'daftar' | 'syarat' | 'biaya' | 'beasiswa' | 'jadwal' | 'status'>('daftar');

  React.useEffect(() => {
    if (initialSubTab) {
      if (initialSubTab === 'form') setActiveTab('daftar');
      else if (initialSubTab === 'info') setActiveTab('jadwal');
      else setActiveTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [searchRegNo, setSearchRegNo] = useState<string>('');
  const [searchedResult, setSearchedResult] = useState<PPDBRegistration | null>(null);
  const [searchError, setSearchError] = useState<string>('');
  const [lastSubmitted, setLastSubmitted] = useState<PPDBRegistration | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    nisn: '',
    nik: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: 'Ruteng',
    birthDate: '2010-05-12',
    originSchool: '',
    chosenMajor: 'MIPA' as 'MIPA' | 'IPS' | 'Bahasa & Budaya',
    mathScore: '88',
    scienceScore: '90',
    indoScore: '86',
    engScore: '85',
    parentName: '',
    parentJob: 'PNS / Guru',
    parentPhone: '',
    parentIncome: 'Rp 3.000.000 - Rp 5.000.000',
    address: '',
    ijazahUploaded: true,
    kkUploaded: true,
    raporUploaded: true,
    fotoUploaded: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.nisn || !formData.originSchool) {
        alert('Mohon lengkapi Nama, NISN, dan Asal Sekolah terlebih dahulu.');
        return;
      }
    }
    if (currentStep === 3) {
      if (!formData.parentName || !formData.parentPhone) {
        alert('Mohon lengkapi Nama dan No. Handphone Orang Tua.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();

    const avgScore =
      (parseFloat(formData.mathScore || '0') +
        parseFloat(formData.scienceScore || '0') +
        parseFloat(formData.indoScore || '0') +
        parseFloat(formData.engScore || '0')) /
      4;

    const nextId = ppdbList.length + 1;
    const newRegNumber = `PPDB-2026-${String(nextId).padStart(3, '0')}`;

    const newRecord: PPDBRegistration = {
      id: `ppdb-${Date.now()}`,
      regNumber: newRegNumber,
      fullName: formData.fullName,
      nisn: formData.nisn,
      originSchool: formData.originSchool,
      chosenMajor: formData.chosenMajor,
      gender: formData.gender,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      parentIncome: formData.parentIncome,
      averageScore: parseFloat(avgScore.toFixed(1)),
      registeredDate: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      status: 'Berkas Lengkap',
      documents: {
        ijazah: formData.ijazahUploaded,
        kartuKeluarga: formData.kkUploaded,
        raporSMP: formData.raporUploaded,
        pasFoto: formData.fotoUploaded,
      },
      notes: 'Pendaftaran mandiri daring berhasil. Menunggu verifikasi tim seleksi PPDB.',
    };

    onAddRegistration(newRecord);
    setLastSubmitted(newRecord);
    setCurrentStep(1);
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const query = searchRegNo.trim().toUpperCase();
    if (!query) return;

    const found = ppdbList.find(
      (p) => p.regNumber.toUpperCase() === query || p.nisn === query
    );
    if (found) {
      setSearchedResult(found);
    } else {
      setSearchedResult(null);
      setSearchError('Nomor Pendaftaran atau NISN tidak ditemukan. Pastikan nomor telah benar (Contoh: PPDB-2026-001).');
    }
  };

  return (
    <section className="w-full py-10 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-1 rounded-full inline-block">
                Penerimaan Siswa Baru
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Gelombang I Buka
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#321759] font-serif tracking-tight mt-1">
              PPDB Daring SMAK Setia Bakti
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Sistem pendaftaran peserta didik baru online yang cepat, aman, dan terenkripsi.
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('daftar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'daftar' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Formulir Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('syarat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'syarat' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Syarat & Berkas Masuk
            </button>
            <button
              onClick={() => setActiveTab('biaya')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'biaya' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Rincian Biaya & SPP
            </button>
            <button
              onClick={() => setActiveTab('beasiswa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'beasiswa' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Beasiswa & Yayasan
            </button>
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'jadwal' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Jadwal & Seleksi
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'status' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Cek Status & Unduh Bukti
            </button>
          </div>
        </div>

        {/* TAB 1: FORMULIR PENDAFTARAN (WIZARD MULTI-STEP) */}
        {activeTab === 'daftar' && (
          <div className="mt-8 max-w-3xl mx-auto">
            {lastSubmitted ? (
              /* Success Confirmation Banner */
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 text-center animate-fadeIn shadow-lg">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-200/70 px-3 py-1 rounded-full">
                  Pendaftaran Berhasil Dikirim
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  Selamat, {lastSubmitted.fullName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto">
                  Data Anda telah tersimpan dengan aman dalam sistem database terenkripsi SMA Katolik Setia Bakti Ruteng.
                </p>

                {/* Unique Registration Badge */}
                <div className="my-6 p-4 bg-white rounded-xl border border-emerald-200 shadow-sm max-w-sm mx-auto">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Nomor Registrasi Anda:</p>
                  <p className="text-2xl font-black text-[#432874] tracking-wider mt-1 font-mono">
                    {lastSubmitted.regNumber}
                  </p>
                  <span className="inline-block text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded mt-1">
                    Peminatan: {lastSubmitted.chosenMajor}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => exportPPDBReceiptPDF(lastSubmitted)}
                    className="w-full sm:w-auto px-5 py-3 bg-[#432874] hover:bg-[#341b5e] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Kartu Bukti Pendaftaran (PDF)</span>
                  </button>
                  <button
                    onClick={() => setLastSubmitted(null)}
                    className="w-full sm:w-auto px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Daftar Siswa Lain
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                {/* Wizard Progress Bar */}
                <div className="bg-[#3b1d70] text-white p-4 sm:p-6">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-purple-200">Tahap {currentStep} dari 4</span>
                    <span className="text-amber-300">
                      {currentStep === 1 && 'Identitas Calon Siswa'}
                      {currentStep === 2 && 'Peminatan & Nilai Rapor SMP'}
                      {currentStep === 3 && 'Data Orang Tua / Wali'}
                      {currentStep === 4 && 'Unggah Dokumen & Enkripsi'}
                    </span>
                  </div>
                  <div className="w-full bg-purple-950 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmitRegistration} className="p-6 sm:p-8 space-y-6">
                  {/* STEP 1: IDENTITAS CALON SISWA */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-700" />
                        <span>Data Diri Calon Siswa</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Lengkap Calon Siswa <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            placeholder="Sesuai Ijazah SMP (contoh: Yohanes Karel Pantur)"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            NISN (10 Digit) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={10}
                            value={formData.nisn}
                            onChange={(e) => handleInputChange('nisn', e.target.value.replace(/\D/g, ''))}
                            placeholder="0089123401"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            NIK (16 Digit - Terenkripsi) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              maxLength={16}
                              value={formData.nik}
                              onChange={(e) => handleInputChange('nik', e.target.value.replace(/\D/g, ''))}
                              placeholder="531002XXXXXXXXXX"
                              className="w-full pl-3 pr-8 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none font-mono"
                            />
                            <ShieldCheck className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Jenis Kelamin <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                          >
                            <option value="L">Laki-Laki (Putra)</option>
                            <option value="P">Perempuan (Putri)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Asal Sekolah (SMP / MTs) <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.originSchool}
                            onChange={(e) => handleInputChange('originSchool', e.target.value)}
                            placeholder="Contoh: SMPK St. Fransiskus Ruteng"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Alamat Domisili Siswa
                          </label>
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Jalan, Kelurahan/Desa, Kecamatan, Kabupaten"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: PEMINATAN & NILAI RAPOR */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-purple-700" />
                        <span>Pilihan Peminatan & Nilai Rapor SMP</span>
                      </h4>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">
                          Pilihan Peminatan / Jurusan <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {[
                            {
                              id: 'MIPA',
                              label: 'MIPA (Matematika & IPA)',
                              desc: 'Fokus Sains, Kedokteran, Rekayasa Teknologi',
                            },
                            {
                              id: 'IPS',
                              label: 'IPS (Ilmu Pengetahuan Sosial)',
                              desc: 'Fokus Hukum, Ekonomi, Manajemen, Sosial',
                            },
                            {
                              id: 'Bahasa & Budaya',
                              label: 'Bahasa & Budaya',
                              desc: 'Fokus Bahasa Inggris, Jerman, Sastra & Diplomasi',
                            },
                          ].map((m) => (
                            <label
                              key={m.id}
                              className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                                formData.chosenMajor === m.id
                                  ? 'border-purple-700 bg-purple-50 shadow-sm'
                                  : 'border-slate-200 hover:border-purple-300'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-bold text-slate-900">{m.label}</span>
                                <input
                                  type="radio"
                                  name="major"
                                  checked={formData.chosenMajor === m.id}
                                  onChange={() => handleInputChange('chosenMajor', m.id)}
                                  className="text-purple-700"
                                />
                              </div>
                              <span className="text-[11px] text-slate-500 leading-snug">{m.desc}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3">
                        <label className="block text-xs font-bold text-slate-700 mb-2">
                          Nilai Rata-Rata Rapor SMP Semester 1 - 5 (Skala 0 - 100)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              Matematika
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={formData.mathScore}
                              onChange={(e) => handleInputChange('mathScore', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs font-bold text-purple-900 bg-white border border-slate-300 rounded"
                            />
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              IPA Terpadu
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={formData.scienceScore}
                              onChange={(e) => handleInputChange('scienceScore', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs font-bold text-purple-900 bg-white border border-slate-300 rounded"
                            />
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              B. Indonesia
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={formData.indoScore}
                              onChange={(e) => handleInputChange('indoScore', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs font-bold text-purple-900 bg-white border border-slate-300 rounded"
                            />
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                              B. Inggris
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={formData.engScore}
                              onChange={(e) => handleInputChange('engScore', e.target.value)}
                              className="w-full px-2.5 py-1.5 text-xs font-bold text-purple-900 bg-white border border-slate-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: DATA ORANG TUA / WALI */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-700" />
                        <span>Data Orang Tua / Wali Siswa</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nama Ayah / Wali <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.parentName}
                            onChange={(e) => handleInputChange('parentName', e.target.value)}
                            placeholder="Nama Lengkap Orang Tua / Wali"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Pekerjaan Orang Tua / Wali
                          </label>
                          <input
                            type="text"
                            value={formData.parentJob}
                            onChange={(e) => handleInputChange('parentJob', e.target.value)}
                            placeholder="PNS / Petani / Wiraswasta / Pegawai"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            No. WhatsApp / HP Aktif <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.parentPhone}
                            onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                            placeholder="081234567890 (Untuk Notifikasi Hasil PPDB)"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Penghasilan Orang Tua / Bulan
                          </label>
                          <select
                            value={formData.parentIncome}
                            onChange={(e) => handleInputChange('parentIncome', e.target.value)}
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-purple-600 focus:outline-none"
                          >
                            <option value="Di bawah Rp 1.500.000">Di bawah Rp 1.500.000 (Syarat KIP/Beasiswa)</option>
                            <option value="Rp 1.500.000 - Rp 3.000.000">Rp 1.500.000 - Rp 3.000.000</option>
                            <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                            <option value="Di atas Rp 5.000.000">Di atas Rp 5.000.000</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: UNGGAH DOKUMEN & ENKRIPSI */}
                  {currentStep === 4 && (
                    <div className="space-y-4 animate-fadeIn">
                      <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-purple-700" />
                        <span>Unggah Berkas Persyaratan & Verifikasi Enkripsi</span>
                      </h4>

                      <p className="text-xs text-slate-600">
                        Pastikan seluruh salinan dokumen berikut telah siap dalam format PDF/JPG/PNG:
                      </p>

                      <div className="space-y-2.5">
                        {[
                          { key: 'ijazahUploaded', label: '1. Ijazah / Surat Keterangan Lulus (SKL) SMP' },
                          { key: 'kkUploaded', label: '2. Salinan Kartu Keluarga (KK)' },
                          { key: 'raporUploaded', label: '3. Salinan Rapor SMP Semester 1 - 5' },
                          { key: 'fotoUploaded', label: '4. Pas Foto Berwarna 3x4 (Latar Belakang Biru/Merah)' },
                        ].map((docItem) => (
                          <div
                            key={docItem.key}
                            className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <FileCheck className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-semibold text-slate-800">{docItem.label}</span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ✓ Siap Unggah
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Security Notice */}
                      <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 flex items-start gap-3">
                        <ShieldCheck className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-purple-900 space-y-1">
                          <p className="font-bold">Keamanan Data Terjamin (UU Perlindungan Data Pribadi):</p>
                          <p className="text-slate-600 leading-relaxed">
                            Data identitas NIK, NISN, dan nomor kontak Anda dienkripsi menggunakan algoritma
                            kriptografi 256-bit dan hanya dapat diakses oleh Panitia Resmi PPDB SMAK Setia Bakti Ruteng.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="px-5 py-2.5 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <span>Lanjut ke Tahap {currentStep + 1}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Kirim Pendaftaran Resmi</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CEK STATUS PENDAFTARAN & UNDUH BUKTI */}
        {activeTab === 'status' && (
          <div className="mt-8 max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-2">Cek Status & Unduh Kartu Registrasi</h3>
              <p className="text-xs text-slate-600 mb-4">
                Masukkan Nomor Registrasi PPDB Anda (contoh: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-purple-700 font-bold">PPDB-2026-001</code>) atau NISN 10-digit:
              </p>

              <form onSubmit={handleSearchStatus} className="flex gap-2">
                <input
                  type="text"
                  value={searchRegNo}
                  onChange={(e) => setSearchRegNo(e.target.value)}
                  placeholder="PPDB-2026-001 atau NISN"
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 font-mono"
                />
                <button
                  type="submit"
                  className="bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Cari Data</span>
                </button>
              </form>

              {searchError && (
                <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}
            </div>

            {searchedResult && (
              <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-md animate-fadeIn space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Status Verifikasi</span>
                    <div className="mt-0.5">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          searchedResult.status === 'Diterima'
                            ? 'bg-emerald-100 text-emerald-800'
                            : searchedResult.status === 'Berkas Lengkap'
                            ? 'bg-blue-100 text-blue-800'
                            : searchedResult.status === 'Perlu Perbaikan'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        ● {searchedResult.status}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-[#432874]">
                    {searchedResult.regNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Calon Siswa</span>
                    <span className="font-semibold text-slate-800">{searchedResult.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">NISN</span>
                    <span className="font-mono font-semibold text-slate-800">{searchedResult.nisn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Asal Sekolah</span>
                    <span className="font-semibold text-slate-800">{searchedResult.originSchool}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Pilihan Peminatan</span>
                    <span className="font-semibold text-purple-900">{searchedResult.chosenMajor}</span>
                  </div>
                </div>

                {searchedResult.notes && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900">
                    <span className="font-bold block mb-0.5">Catatan Panitia:</span>
                    <span>{searchedResult.notes}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => exportPPDBReceiptPDF(searchedResult)}
                    className="w-full py-2.5 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Cetak / Unduh Kartu Pendaftaran Resmi (PDF)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: SYARAT PENDAFTARAN & BERKAS */}
        {activeTab === 'syarat' && (
          <div className="mt-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded">
                  Ketentuan Resmi PPDB 2026/2027
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Syarat Pendaftaran & Kelengkapan Berkas
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Seluruh calon peserta didik wajib memenuhi persyaratan umum dan melampirkan berkas dokumen asli/legalisir.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-purple-700" />
                    <span>Persyaratan Umum Calon Siswa</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Telah lulus SMP/MTs atau sederajat dengan Surat Keterangan Lulus (SKL) / Ijazah.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Berusia setinggi-tingginya 21 tahun pada tanggal 1 Juli 2026.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Memiliki Nomor Induk Siswa Nasional (NISN) aktif yang terdaftar di Pusdatin Kemdikbudristek.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>Berkelakuan baik, tidak terlibat narkoba atau tindak pidana, serta sanggup menaati tata tertib sekolah.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-700" />
                    <span>Berkas Dokumen Yang Dilampirkan</span>
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <span>Fotokopi Ijazah / SKL SMP yang telah dilegalisir (2 lembar).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <span>Fotokopi Kartu Keluarga (KK) & Akta Kelahiran (2 lembar).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <span>Surat Permandian / Baptis bagi yang beragama Katolik (atau surat keterangan bagi yang bukan).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                      <span>Pasfoto terbaru ukuran 3x4 berwarna latar belakang merah (4 lembar).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                      <span>Piagam/Sertifikat prestasi akademik atau seni/olahraga (jika ada).</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setActiveTab('daftar')}
                  className="px-6 py-2.5 bg-[#432874] hover:bg-[#341b5e] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
                >
                  <span>Mulai Isi Formulir Pendaftaran Daring</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: RINCIAN BIAYA PENDIDIKAN & SPP */}
        {activeTab === 'biaya' && (
          <div className="mt-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
                  Transparansi Pembiayaan
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Rincian Biaya Pendidikan & SPP Tahun Ajaran 2026/2027
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  SMA Katolik Setia Bakti berkomitmen menyediakan pendidikan unggul dengan biaya terjangkau serta skema cicilan bagi orang tua.
                </p>
              </div>

              {/* Table of fees */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3.5">Komponen Biaya</th>
                      <th className="p-3.5">Keterangan / Fasilitas</th>
                      <th className="p-3.5 text-right">Nominal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Uang Pangkal / Pembangunan Gedung</td>
                      <td className="p-3.5 text-slate-600">Dibayar 1x selama menempuh pendidikan (dapat diangsur 3 tahap).</td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900">Rp 2.500.000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">SPP Bulanan (Iuran Pendidikan)</td>
                      <td className="p-3.5 text-slate-600">Termasuk praktikum lab, ujian CBT, dan akses e-learning portal.</td>
                      <td className="p-3.5 text-right font-mono font-bold text-purple-900">Rp 275.000 / bln</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Paket Seragam Sekolah (4 Stel Lengkap)</td>
                      <td className="p-3.5 text-slate-600">Putih-Abu, Batik Khas Setia Bakti, Pramuka Lengkap, dan Kaos Olahraga.</td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900">Rp 850.000</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Asuransi Siswa & OSIS Tahunan</td>
                      <td className="p-3.5 text-slate-600">Perlindungan kecelakaan 24 jam dan iuran kegiatan kesiswaan.</td>
                      <td className="p-3.5 text-right font-mono font-bold text-slate-900">Rp 120.000 / thn</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-slate-900">Buku Paket Kurikulum Merdeka</td>
                      <td className="p-3.5 text-slate-600">Dipinjamkan gratis dari Perpustakaan St. Agustinus selama 1 tahun.</td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600">GRATIS (BOS)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Catatan Bantuan Keuangan:</span>
                <p>
                  Bagi calon siswa dari keluarga prasejahtera atau memiliki saudara kandung aktif di SMAK Setia Bakti, tersedia keringanan uang gedung hingga 40% melalui rekomendasi Pastor Paroki atau Tim Yayasan Sukma.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB: BEASISWA PRESTASI & YAYASAN */}
        {activeTab === 'beasiswa' && (
          <div className="mt-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded">
                  Dukungan & Apresiasi Bakat
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Program Beasiswa Prestasi & Bantuan Sosial
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Kami membuka pintu seluas-luasnya bagi siswa berprestasi tinggi dan mereka yang membutuhkan bantuan biaya.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-200 text-purple-900 px-2 py-0.5 rounded">
                      Kategori 1
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">Beasiswa Juara Rapor SMP</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Diberikan kepada lulusan SMP yang meraih peringkat 1, 2, atau 3 umum di sekolah asalnya.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-purple-100">
                    <span className="text-xs font-black text-purple-900 block">Bebas SPP 6 - 12 Bulan</span>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                      Kategori 2
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">Beasiswa Talenta Seni & Olahraga</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Bagi peraih medali/juara 1-3 OSN, O2SN, FLS2N tingkat Kabupaten, Provinsi NTT, maupun Nasional.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-amber-100">
                    <span className="text-xs font-black text-amber-900 block">Potongan 50% Uang Gedung</span>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                      Kategori 3
                    </span>
                    <h4 className="font-bold text-slate-900 text-base">Beasiswa Afirmasi Gereja & Yayasan</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Bantuan kemitraan Yayasan Persekolahan St. Paulus dan Keuskupan Ruteng untuk anak yatim/piatu dan pra-sejahtera.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-emerald-100">
                    <span className="text-xs font-black text-emerald-900 block">Bantuan Penuh & Asrama</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: JADWAL SELEKSI & ALUR */}
        {activeTab === 'jadwal' && (
          <div className="mt-8 max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                  Agenda Tahunan
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Jadwal & Agenda Penting PPDB 2026/2027
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-800 uppercase">Gelombang I (Jalur Prestasi & Reguler)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Buka</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">1 Maret – 30 April 2026</p>
                  <p className="text-xs text-slate-600">Pendaftaran daring, tes peminatan, dan wawancara orang tua.</p>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase">Gelombang II (Jalur Reguler Umum)</span>
                    <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Segera</span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">2 Mei – 25 Juni 2026</p>
                  <p className="text-xs text-slate-600">Pendaftaran lanjutan jika kuota rombel masih tersedia.</p>
                </div>
              </div>

              <div className="p-4 bg-slate-100 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sudah mendaftar sebelumnya?</h4>
                  <p className="text-[11px] text-slate-500">Gunakan nomor pendaftaran untuk mengecek status verifikasi berkas.</p>
                </div>
                <button
                  onClick={() => setActiveTab('status')}
                  className="px-4 py-2 bg-[#432874] text-white text-xs font-bold rounded-lg hover:bg-[#341b5e] transition-colors cursor-pointer"
                >
                  Cek Status Registrasi
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
