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
}

export const PPDBOnline: React.FC<PPDBOnlineProps> = ({ ppdbList, onAddRegistration }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'status' | 'info'>('form');
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
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'form' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Formulir Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'status' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Cek Status & Unduh Bukti
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'info' ? 'bg-[#432874] text-white shadow-sm' : 'text-slate-700 hover:text-purple-900'
              }`}
            >
              Alur & Jadwal
            </button>
          </div>
        </div>

        {/* TAB 1: FORMULIR PENDAFTARAN (WIZARD MULTI-STEP) */}
        {activeTab === 'form' && (
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

        {/* TAB 3: ALUR & JADWAL */}
        {activeTab === 'info' && (
          <div className="mt-8 max-w-4xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-[#432874] font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                  1
                </span>
                <h4 className="font-bold text-sm text-slate-900">Pendaftaran Daring</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pengisian formulir biodata dan upload kelengkapan dokumen melalui portal ini.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-[#432874] font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                  2
                </span>
                <h4 className="font-bold text-sm text-slate-900">Verifikasi & Wawancara</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Pengecekan keaslian berkas dan tes bakat minat peminatan MIPA/IPS/Bahasa.
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-[#432874] font-bold flex items-center justify-center mx-auto mb-2 text-sm">
                  3
                </span>
                <h4 className="font-bold text-sm text-slate-900">Daftar Ulang & MPLS</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Registrasi ulang, pembagian seragam, dan masa pengenalan lingkungan sekolah.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
