import React, { useState } from 'react';
import {
  Palette,
  Image as ImageIcon,
  Type,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  GraduationCap,
  Cross,
  BookOpen,
  ShieldCheck,
  Award,
  Upload,
  Eye,
  Sliders,
  Settings,
  Flame,
} from 'lucide-react';
import { AdminSidebarConfig } from '../../types';
import { dbService } from '../../services/dbSync';

export const DEFAULT_SIDEBAR_CONFIG: AdminSidebarConfig = {
  logoType: 'icon',
  logoUrl: '',
  presetIcon: 'graduation',
  logoShape: 'rounded',
  title: 'DASBOR ADMINISTRATOR',
  subtitle: 'SMAK SETIA BAKTI',
  tagline: 'Ruteng, Flores, NTT',
  adminRoleLabel: 'Admin Utama',
  statusBadgeText: 'MySQL Aktif',
  themeAccent: 'indigo',
};

interface AdminSidebarCustomizerTabProps {
  config: AdminSidebarConfig;
  onSaveConfig: (newConfig: AdminSidebarConfig) => void;
  onClose?: () => void;
}

export const AdminSidebarCustomizerTab: React.FC<AdminSidebarCustomizerTabProps> = ({
  config,
  onSaveConfig,
  onClose,
}) => {
  const [formConfig, setFormConfig] = useState<AdminSidebarConfig>({
    ...DEFAULT_SIDEBAR_CONFIG,
    ...config,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setUploadError('Ukuran berkas logo terlalu besar. Maksimal 4 MB.');
        return;
      }
      setUploadError(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormConfig((prev) => ({
          ...prev,
          logoType: 'image',
          logoUrl: base64,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSaveConfig(formConfig);
    // Simpan ke storage dan sinkronisasi ke server
    localStorage.setItem('smak_sidebar_config', JSON.stringify(formConfig));
    dbService.syncEntity('sidebarConfig', formConfig);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onClose) onClose();
    }, 2000);
  };

  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan tampilan sidebar ke setelan bawaan?')) {
      setFormConfig(DEFAULT_SIDEBAR_CONFIG);
      onSaveConfig(DEFAULT_SIDEBAR_CONFIG);
      localStorage.setItem('smak_sidebar_config', JSON.stringify(DEFAULT_SIDEBAR_CONFIG));
      dbService.syncEntity('sidebarConfig', DEFAULT_SIDEBAR_CONFIG);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Render icon preview
  const renderSelectedIcon = () => {
    switch (formConfig.presetIcon) {
      case 'cross':
        return <Cross className="w-6 h-6" />;
      case 'book':
        return <BookOpen className="w-6 h-6" />;
      case 'shield':
        return <ShieldCheck className="w-6 h-6" />;
      case 'award':
        return <Award className="w-6 h-6" />;
      case 'graduation':
      default:
        return <GraduationCap className="w-6 h-6" />;
    }
  };

  // Gradient classes based on themeAccent
  const getAccentGradient = (accent?: string) => {
    switch (accent) {
      case 'purple':
        return 'from-purple-600 to-fuchsia-600';
      case 'blue':
        return 'from-sky-500 to-blue-600';
      case 'emerald':
        return 'from-emerald-500 to-teal-600';
      case 'amber':
        return 'from-amber-500 to-orange-600';
      case 'indigo':
      default:
        return 'from-blue-600 to-indigo-600';
    }
  };

  const getShapeRadius = (shape?: string) => {
    switch (shape) {
      case 'circle':
        return 'rounded-full';
      case 'square':
        return 'rounded-lg';
      case 'rounded':
      default:
        return 'rounded-2xl';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Palette className="w-3 h-3" />
              Kustomisasi Tampilan
            </span>
            <span className="text-xs text-slate-400">• Pengaturan Visual Sidebar Admin</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Ganti Foto, Logo & Tulisan Sidebar</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesuaikan identitas visual sidebar Admin Utama: unggah logo atau foto sekolah kustom, ubah judul, nama instansi, serta status badge.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>Reset Bawaan</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Pengaturan sidebar berhasil disimpan dan langsung diterapkan ke tampilan sidebar admin!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Configuration (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* SECTION 1: GANTI FOTO / LOGO */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">1. Foto & Logo Sidebar</h3>
                <p className="text-[11px] text-slate-500">Pilih antara unggah foto/logo kustom atau ikon preset sekolah.</p>
              </div>
            </div>

            {/* Type selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormConfig((prev) => ({ ...prev, logoType: 'image' }))}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  formConfig.logoType === 'image'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Foto / Berkas Gambar</span>
              </button>
              <button
                type="button"
                onClick={() => setFormConfig((prev) => ({ ...prev, logoType: 'icon' }))}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  formConfig.logoType === 'icon'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Ikon Lambang Prestasi</span>
              </button>
            </div>

            {/* If Image mode */}
            {formConfig.logoType === 'image' && (
              <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Unggah Berkas Foto / Logo (PNG, JPG, SVG, WebP)
                  </label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-7 h-7 text-indigo-500 mb-1" />
                      <p className="text-xs font-bold text-slate-700">Klik untuk Pilih Berkas Foto</p>
                      <p className="text-[11px] text-slate-400">Maks. 4 MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadError && <p className="text-xs text-rose-600 font-semibold mt-1">{uploadError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Atau Masukkan URL Gambar / Logo Online
                  </label>
                  <input
                    type="url"
                    value={formConfig.logoUrl || ''}
                    onChange={(e) =>
                      setFormConfig((prev) => ({ ...prev, logoUrl: e.target.value, logoType: 'image' }))
                    }
                    placeholder="https://example.com/logo-smak-setiabakti.png"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* If Icon mode */}
            {formConfig.logoType === 'icon' && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Ikon Lambang Institusi
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'graduation', label: 'Toga / Edukasi', icon: GraduationCap },
                    { id: 'cross', label: 'Salib Katolik', icon: Cross },
                    { id: 'book', label: 'Buku & Kitab', icon: BookOpen },
                    { id: 'shield', label: 'Perisai Pelindung', icon: ShieldCheck },
                    { id: 'award', label: 'Bintang Prestasi', icon: Award },
                  ].map((preset) => {
                    const IconComponent = preset.icon;
                    const isSelected = formConfig.presetIcon === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() =>
                          setFormConfig((prev) => ({
                            ...prev,
                            presetIcon: preset.id as any,
                            logoType: 'icon',
                          }))
                        }
                        className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 cursor-pointer transition-all text-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span className="text-[10px] font-bold leading-tight line-clamp-1">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Logo Shape */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bentuk Wadah Logo
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'rounded', label: 'Rounded Halus (2xl)' },
                  { id: 'circle', label: 'Lingkaran Penuh' },
                  { id: 'square', label: 'Kotak Tegas (lg)' },
                ].map((shape) => (
                  <button
                    key={shape.id}
                    type="button"
                    onClick={() =>
                      setFormConfig((prev) => ({ ...prev, logoShape: shape.id as any }))
                    }
                    className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all text-center ${
                      formConfig.logoShape === shape.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: GANTI TULISAN PADA SIDEBAR */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Type className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">2. Tulisan & Label Teks Sidebar</h3>
                <p className="text-[11px] text-slate-500">Sesuaikan judul, nama sekolah, dan keterangan status di sidebar.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Utama Sidebar (Header Atas)
                </label>
                <input
                  type="text"
                  value={formConfig.title}
                  onChange={(e) => setFormConfig((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="DASBOR ADMINISTRATOR"
                  className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">Disarankan menggunakan huruf kapital rapi (misal: DASBOR ADMINISTRATOR, PANEL UTAMA SEKOLAH).</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subjudul / Nama Sekolah
                </label>
                <input
                  type="text"
                  value={formConfig.subtitle}
                  onChange={(e) => setFormConfig((prev) => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="SMAK SETIA BAKTI"
                  className="w-full px-3.5 py-2.5 text-xs font-bold text-indigo-700 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline / Lokasi Kampus (Opsional)
                </label>
                <input
                  type="text"
                  value={formConfig.tagline || ''}
                  onChange={(e) => setFormConfig((prev) => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Ruteng, Flores, NTT"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Label Akun Admin di Sidebar
                  </label>
                  <input
                    type="text"
                    value={formConfig.adminRoleLabel || 'Admin Utama'}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, adminRoleLabel: e.target.value }))}
                    placeholder="Admin Utama / Kepala Sekolah"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teks Status Koneksi / Badge
                  </label>
                  <input
                    type="text"
                    value={formConfig.statusBadgeText || 'MySQL Aktif'}
                    onChange={(e) => setFormConfig((prev) => ({ ...prev, statusBadgeText: e.target.value }))}
                    placeholder="MySQL Aktif / Terverifikasi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: TEMA WARNA AKSEN */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">3. Warna Aksen & Gradasi Logo</h3>
                <p className="text-[11px] text-slate-500">Pilih warna gradasi pada kotak logo dan tombol aktif di sidebar.</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {[
                { id: 'indigo', label: 'Indigo Biru', color: 'from-blue-600 to-indigo-600' },
                { id: 'purple', label: 'Ungu Bangsawan', color: 'from-purple-600 to-fuchsia-600' },
                { id: 'blue', label: 'Sky Biru Cerah', color: 'from-sky-500 to-blue-600' },
                { id: 'emerald', label: 'Zamrud Hijau', color: 'from-emerald-500 to-teal-600' },
                { id: 'amber', label: 'Emas Mulia', color: 'from-amber-500 to-orange-600' },
              ].map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setFormConfig((prev) => ({ ...prev, themeAccent: theme.id as any }))}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 cursor-pointer transition-all ${
                    formConfig.themeAccent === theme.id
                      ? 'border-indigo-600 bg-slate-50 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${theme.color} shadow-sm`} />
                  <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Pane (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <div className="bg-[#0a1124] text-slate-200 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Pratinjau Langsung Sidebar
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  Live View
                </span>
              </div>

              {/* Sidebar Header Brand Preview */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#131c38]/60 border border-slate-800">
                <div
                  className={`w-12 h-12 ${getShapeRadius(
                    formConfig.logoShape
                  )} bg-gradient-to-tr ${getAccentGradient(
                    formConfig.themeAccent
                  )} flex items-center justify-center text-white shadow-lg overflow-hidden flex-shrink-0 border border-white/20`}
                >
                  {formConfig.logoType === 'image' && formConfig.logoUrl ? (
                    <img
                      src={formConfig.logoUrl}
                      alt="Logo Sidebar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    renderSelectedIcon()
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-white tracking-wider leading-tight line-clamp-1 uppercase">
                    {formConfig.title || 'DASBOR ADMINISTRATOR'}
                  </h4>
                  <p className="text-[11px] font-bold text-sky-400 tracking-wider uppercase line-clamp-1">
                    {formConfig.subtitle || 'SMAK SETIA BAKTI'}
                  </p>
                  {formConfig.tagline && (
                    <p className="text-[10px] text-slate-400 line-clamp-1">{formConfig.tagline}</p>
                  )}
                </div>
              </div>

              {/* Sidebar User Widget Preview */}
              <div className="p-3 rounded-2xl bg-[#131c38] border border-slate-700/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm">
                    AD
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold text-white truncate">
                      {formConfig.adminRoleLabel || 'Admin Utama'}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {formConfig.statusBadgeText || 'MySQL Aktif'}
                    </div>
                  </div>
                </div>
                <div className="px-2 py-1 bg-indigo-600/80 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <Settings className="w-3 h-3" />
                  <span>Profil</span>
                </div>
              </div>

              {/* Mock Menu Items */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r ${getAccentGradient(
                    formConfig.themeAccent
                  )} shadow-md`}
                >
                  <Palette className="w-4 h-4" />
                  <span>Kustomisasi Sidebar (Aktif)</span>
                </div>
                <div className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-400 bg-slate-800/30">
                  <GraduationCap className="w-4 h-4" />
                  <span>Ringkasan Kinerja</span>
                </div>
                <div className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-slate-400 bg-slate-800/30">
                  <BookOpen className="w-4 h-4" />
                  <span>Profil Guru & Pegawai</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                💡 <span className="font-semibold text-slate-300">Tips:</span> Perubahan foto dan tulisan ini akan tersimpan otomatis di perangkat dan tersinkronisasi langsung ke database server.
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Perubahan ke Sidebar Sekarang</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
