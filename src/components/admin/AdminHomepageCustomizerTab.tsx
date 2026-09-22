import React, { useState } from 'react';
import {
  LayoutTemplate,
  Sliders,
  Image as ImageIcon,
  Type,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  RefreshCw,
  Eye,
  ExternalLink,
  Sparkles,
  Award,
  Layers,
  BarChart3,
  MessageSquare,
  Upload,
  Info,
  Check,
  ChevronRight,
  BookOpen,
  Briefcase,
  Plane,
  User,
  Users,
  GraduationCap,
  Megaphone,
} from 'lucide-react';
import { HomepageConfig, HeroSlide } from '../../types';
import { HOMEPAGE_PRESET_IMAGES } from '../../data/mockData';
import { ImageUploadField } from '../common/ImageUploadField';

interface AdminHomepageCustomizerTabProps {
  config: HomepageConfig;
  onSaveConfig: (updated: HomepageConfig) => void;
  onResetDefault: () => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminHomepageCustomizerTab: React.FC<AdminHomepageCustomizerTabProps> = ({
  config,
  onSaveConfig,
  onResetDefault,
  onNavigateToWebsiteTab,
}) => {
  const [formData, setFormData] = useState<HomepageConfig>(config);
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'cards_stats' | 'why_us' | 'welcome' | 'ticker'>('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveConfig(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Helper ganti slide spesifik
  const handleUpdateSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const updated = [...formData.heroSlides];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, heroSlides: updated });
  };

  // Tambah slide baru
  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      url: HOMEPAGE_PRESET_IMAGES[formData.heroSlides.length % HOMEPAGE_PRESET_IMAGES.length].url,
      title: 'Slide Baru Kampus SMAK Setia Bakti',
      caption: 'Keterangan atau dokumentasi kegiatan unggulan',
    };
    setFormData({ ...formData, heroSlides: [...formData.heroSlides, newSlide] });
  };

  // Hapus slide
  const handleDeleteSlide = (index: number) => {
    if (formData.heroSlides.length <= 1) {
      alert('Minimal harus memiliki 1 slide gambar utama!');
      return;
    }
    const updated = formData.heroSlides.filter((_, i) => i !== index);
    setFormData({ ...formData, heroSlides: updated });
    if (previewSlideIdx >= updated.length) {
      setPreviewSlideIdx(0);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
              Kustomisasi Beranda
            </span>
            <span className="text-xs text-slate-400">• Tampilan Pengunjung Publik</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <LayoutTemplate className="w-6 h-6 text-blue-600" />
            <span>Ganti Gambar & Tulisan Halaman Utama Website</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Kelola foto slider latar belakang, judul sambutan, teks slogan, kartu peminatan cepat, data statistik, hingga pesan kepala sekolah pada halaman beranda utama.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {onNavigateToWebsiteTab && (
            <button
              type="button"
              onClick={() => onNavigateToWebsiteTab('beranda')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Buka dan lihat tampilan halaman utama saat ini"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Lihat Halaman Utama</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      {/* Alert Berhasil Disimpan */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center justify-between animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Gambar dan tulisan halaman utama berhasil diperbarui!</span>
              <p className="text-[11px] text-emerald-700">
                Perubahan langsung diterapkan pada halaman Beranda utama sekolah dan disinkronkan ke database server.
              </p>
            </div>
          </div>
          {onNavigateToWebsiteTab && (
            <button
              type="button"
              onClick={() => onNavigateToWebsiteTab('beranda')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <span>Lihat Website Sekarang</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Live Interactive Hero Preview Box */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-slate-800 overflow-hidden relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200">Pratinjau Nyata Hero Banner (Slide {previewSlideIdx + 1} dari {formData.heroSlides.length})</span>
          </div>
          <div className="flex items-center gap-1.5">
            {formData.heroSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPreviewSlideIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  previewSlideIdx === i ? 'bg-blue-500 w-6' : 'bg-white/30 hover:bg-white/60'
                }`}
                title={`Lihat Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Cinematic Mockup */}
        <div className="relative min-h-[260px] sm:min-h-[300px] rounded-xl overflow-hidden flex flex-col justify-between p-6 bg-slate-950">
          <img
            src={formData.heroSlides[previewSlideIdx]?.url || HOMEPAGE_PRESET_IMAGES[0].url}
            alt="Hero Preview"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-75 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

          {/* Content overlay */}
          <div className="relative z-10 max-w-lg space-y-2">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
              {formData.heroEyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white leading-tight">
              {formData.heroHeadline} <br />
              <span className="text-white">{formData.heroHeadlineHighlight || 'KAMPUS KAMI'}</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium line-clamp-2">
              {formData.heroSubtitle}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0074d9] text-white font-bold text-[11px] uppercase tracking-wider rounded-none shadow-xs">
                <span>{formData.heroCtaText}</span>
                <span>▶</span>
              </span>
            </div>
          </div>

          {/* 3 mini cards on preview */}
          <div className="relative z-10 grid grid-cols-3 gap-2 pt-4 border-t border-white/10 mt-4 bg-black/40 -mx-6 -mb-6 px-6 py-2.5 backdrop-blur-xs">
            {formData.featureCards.map((card, idx) => (
              <div key={idx} className="flex items-center gap-2 text-left">
                <div className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] flex-shrink-0">
                  ★
                </div>
                <div className="truncate">
                  <p className="text-[10px] font-bold text-white uppercase truncate">{card.title}</p>
                  <p className="text-[9px] text-slate-400 truncate">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveSubTab('hero')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'hero'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>1. Slider Gambar & Teks Utama (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('cards_stats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'cards_stats'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>2. Tiga Kartu Peminatan & 4 Statistik</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('welcome')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'welcome'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>3. Sambutan Kepala Sekolah</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('why_us')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'why_us'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>4. Pilar Keunggulan (Why Choose Us)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ticker')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'ticker'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>5. Pengumuman Berjalan Beranda</span>
        </button>
      </div>

      {/* TAB 1: HERO SLIDER GAMBAR & TEKS UTAMA */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          {/* Tulisan Hero */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Type className="w-4 h-4 text-blue-600" />
                <span>Tulisan & Slogan Utama Banner</span>
              </h3>
              <p className="text-xs text-slate-500">
                Ubah teks tajuk, subjudul, dan tombol ajakan yang pertama kali dibaca pengunjung.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teks Eyebrow (Teks Kecil di Atas Judul)
                </label>
                <input
                  type="text"
                  value={formData.heroEyebrow}
                  onChange={(e) => setFormData({ ...formData, heroEyebrow: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: BUTUH INFORMASI & BANTUAN?"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Judul Utama Baris 1
                </label>
                <input
                  type="text"
                  value={formData.heroHeadline}
                  onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: SELAMAT DATANG DI"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teks Penekanan Judul (Baris 2)
                </label>
                <input
                  type="text"
                  value={formData.heroHeadlineHighlight || ''}
                  onChange={(e) => setFormData({ ...formData, heroHeadlineHighlight: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: KAMPUS KAMI atau SMAK SETIA BAKTI"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Teks Tombol Aksi (CTA Button)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.heroCtaText}
                    onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="BACA SELENGKAPNYA"
                  />
                  <select
                    value={formData.heroCtaTab}
                    onChange={(e) => setFormData({ ...formData, heroCtaTab: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-xl bg-white focus:outline-none"
                  >
                    <option value="akademik">Buka: Jurusan & Akademik</option>
                    <option value="profil">Buka: Profil Sekolah</option>
                    <option value="ppdb">Buka: PPDB Online</option>
                    <option value="kehidupan">Buka: Kehidupan Siswa</option>
                    <option value="berita">Buka: Berita Sekolah</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Tagline / Subjudul Sekolah (Teks Keterangan di Bawah Judul)
                </label>
                <input
                  type="text"
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: SMA KATOLIK SETIA BAKTI RUTENG — MENGINSPIRASI MASA DEPAN"
                />
              </div>
            </div>
          </div>

          {/* Daftar Slide Gambar Latar Belakang */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <span>Daftar Slide Gambar Latar Belakang ({formData.heroSlides.length} Slide Aktif)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Gambar akan berganti otomatis secara berkala dengan efek transisi lembut.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddSlide}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Slide Baru</span>
              </button>
            </div>

            {/* Slider List */}
            <div className="space-y-4">
              {formData.heroSlides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    previewSlideIdx === idx ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800">Slide #{idx + 1}</span>
                      {previewSlideIdx === idx && (
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Sedang Dipratinjau
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPreviewSlideIdx(idx)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50 cursor-pointer"
                      >
                        Pratinjau Slide Ini
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        disabled={formData.heroSlides.length <= 1}
                        className={`p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer ${
                          formData.heroSlides.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                        }`}
                        title="Hapus Slide Ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Thumbnail preview */}
                    <div className="md:col-span-4 space-y-2">
                      <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 relative group">
                        <img
                          src={slide.url}
                          alt={slide.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center text-white text-[11px] font-bold">
                          {slide.title}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 text-center">
                        Disarankan resolusi lanskap (1920x1080 atau minimal 1200x600 px).
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="md:col-span-8 space-y-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Judul / Keterangan Slide (Internal & SEO)
                        </label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(idx, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Judul Slide"
                        />
                      </div>

                      {/* Image Upload Component */}
                      <ImageUploadField
                        label="File Foto / URL Gambar Slide"
                        value={slide.url}
                        onChange={(newUrl) => handleUpdateSlide(idx, 'url', newUrl)}
                        helperText="Unggah foto dari galeri HP/Laptop Anda atau tempel link URL foto langsung."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pilihan Cepat dari Preset Kampus */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Pilih Cepat dari Galeri Foto Kampus SMA Katolik Setia Bakti:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {HOMEPAGE_PRESET_IMAGES.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => handleUpdateSlide(previewSlideIdx, 'url', preset.url)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/40 text-left transition-all group cursor-pointer"
                  >
                    <div className="w-full h-16 rounded-lg overflow-hidden mb-1.5 bg-slate-100">
                      <img
                        src={preset.url}
                        alt={preset.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-800 line-clamp-1 group-hover:text-blue-700">
                      {preset.title}
                    </p>
                    <span className="text-[9px] text-blue-600 font-semibold block mt-0.5">
                      Gunakan untuk Slide {previewSlideIdx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIGA KARTU & EMPAT STATISTIK */}
      {activeSubTab === 'cards_stats' && (
        <div className="space-y-6">
          {/* Tiga Kartu Peminatan Cepat */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Tiga Kartu Peminatan di Bawah Banner Utama</span>
              </h3>
              <p className="text-xs text-slate-500">
                Tiga kartu horizontal tembus pandang yang muncul persis di bawah banner slider.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {formData.featureCards.map((card, idx) => (
                <div key={card.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                      Kartu #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Judul Kartu</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const updated = [...formData.featureCards];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setFormData({ ...formData, featureCards: updated });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Teks Subtitle / Tautan</label>
                    <input
                      type="text"
                      value={card.subtitle}
                      onChange={(e) => {
                        const updated = [...formData.featureCards];
                        updated[idx] = { ...updated[idx], subtitle: e.target.value };
                        setFormData({ ...formData, featureCards: updated });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Empat Angka Statistik Cepat */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Empat Statistik Cepat (Stats Ribbon)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pita angka statistik pencapaian sekolah yang tampil di bawah slider utama.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {formData.quickStats.map((st, idx) => (
                <div key={st.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      Statistik #{idx + 1}
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Angka / Nilai Utama</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...formData.quickStats];
                        updated[idx] = { ...updated[idx], value: e.target.value };
                        setFormData({ ...formData, quickStats: updated });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none"
                      placeholder="Misal: 1.250+ Siswa"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Keterangan Singkat</label>
                    <input
                      type="text"
                      value={st.sublabel}
                      onChange={(e) => {
                        const updated = [...formData.quickStats];
                        updated[idx] = { ...updated[idx], sublabel: e.target.value };
                        setFormData({ ...formData, quickStats: updated });
                      }}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                      placeholder="Misal: Aktif & Berprestasi"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SAMBUTAN KEPALA SEKOLAH */}
      {activeSubTab === 'welcome' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Sambutan Kepala Sekolah di Halaman Utama</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pesan hangat dan foto pimpinan sekolah yang menyapa langsung seluruh tamu dan calon wali murid.
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.welcomeSection.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    welcomeSection: { ...formData.welcomeSection, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Tampilkan di Beranda</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs">
            {/* Foto Kepala Sekolah */}
            <div className="md:col-span-4 space-y-3">
              <div className="w-48 h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mx-auto shadow-xs">
                <img
                  src={
                    formData.welcomeSection.principalPhotoUrl ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80'
                  }
                  alt="Foto Kepala Sekolah"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <ImageUploadField
                label="Ganti Foto Kepala Sekolah"
                value={formData.welcomeSection.principalPhotoUrl || ''}
                onChange={(url) =>
                  setFormData({
                    ...formData,
                    welcomeSection: { ...formData.welcomeSection, principalPhotoUrl: url },
                  })
                }
                helperText="Unggah foto formal pimpinan sekolah."
              />
            </div>

            {/* Tulisan Sambutan */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Badge Sambutan</label>
                <input
                  type="text"
                  value={formData.welcomeSection.badge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      welcomeSection: { ...formData.welcomeSection, badge: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  placeholder="SAMBUTAN RESMI KEPALA SEKOLAH"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Pokok Sambutan</label>
                <input
                  type="text"
                  value={formData.welcomeSection.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      welcomeSection: { ...formData.welcomeSection, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-slate-900 focus:outline-none"
                  placeholder="Judul Sambutan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah & Gelar</label>
                  <input
                    type="text"
                    value={formData.welcomeSection.principalName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeSection: { ...formData.welcomeSection, principalName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                    placeholder="Drs. Petrus Kanisius Dadi"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan Resmi</label>
                  <input
                    type="text"
                    value={formData.welcomeSection.principalRole}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        welcomeSection: { ...formData.welcomeSection, principalRole: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                    placeholder="Kepala Sekolah SMA Katolik Setia Bakti"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Pesan Sambutan</label>
                <textarea
                  rows={4}
                  value={formData.welcomeSection.quote}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      welcomeSection: { ...formData.welcomeSection, quote: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none leading-relaxed"
                  placeholder="Tuliskan pesan sambutan..."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PILAR KEUNGGULAN (WHY CHOOSE US) */}
      {activeSubTab === 'why_us' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Bagian Keunggulan & Mengapa SMAK Setia Bakti</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ubah judul tajuk, paragraf deskripsi, dan 4 pilar alasan memilih SMA Katolik Setia Bakti.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Eyebrow Kategori</label>
              <input
                type="text"
                value={formData.whyChooseUs.eyebrow}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyChooseUs: { ...formData.whyChooseUs, eyebrow: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                placeholder="MENGAPA SMAK SETIA BAKTI?"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Judul Utama Bagian</label>
              <input
                type="text"
                value={formData.whyChooseUs.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyChooseUs: { ...formData.whyChooseUs, title: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                placeholder="Sekolah Katolik yang Membimbing Masa Depanmu"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Paragraf Deskripsi Singkat</label>
              <textarea
                rows={2}
                value={formData.whyChooseUs.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    whyChooseUs: { ...formData.whyChooseUs, description: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* 4 Pilar */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-800 block mb-3">4 Pilar Keunggulan:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {formData.whyChooseUs.pillars.map((pillar, pIdx) => (
                <div key={pillar.id || pIdx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                      Pilar #{pIdx + 1}
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Judul Pilar</label>
                    <input
                      type="text"
                      value={pillar.title}
                      onChange={(e) => {
                        const updated = [...formData.whyChooseUs.pillars];
                        updated[pIdx] = { ...updated[pIdx], title: e.target.value };
                        setFormData({
                          ...formData,
                          whyChooseUs: { ...formData.whyChooseUs, pillars: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Uraian Keterangan</label>
                    <textarea
                      rows={2}
                      value={pillar.desc}
                      onChange={(e) => {
                        const updated = [...formData.whyChooseUs.pillars];
                        updated[pIdx] = { ...updated[pIdx], desc: e.target.value };
                        setFormData({
                          ...formData,
                          whyChooseUs: { ...formData.whyChooseUs, pillars: updated },
                        });
                      }}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PENGUMUMAN BERJALAN BERANDA */}
      {activeSubTab === 'ticker' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Pita Pengumuman Utama (Running Announcement)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Pita notifikasi penting yang berjalan di bagian atas halaman beranda (cocok untuk info PPDB / Libur / Ujian).
              </p>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementBar.enabled}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: { ...formData.announcementBar, enabled: e.target.checked },
                  })
                }
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Aktifkan Pengumuman</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Label Badge</label>
              <input
                type="text"
                value={formData.announcementBar.badgeText}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: { ...formData.announcementBar, badgeText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                placeholder="PENGUMUMAN UTAMA"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Teks Tautan Aksi</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.announcementBar.linkText || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementBar: { ...formData.announcementBar, linkText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  placeholder="Daftar Sekarang"
                />
                <select
                  value={formData.announcementBar.targetTab || 'ppdb'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      announcementBar: { ...formData.announcementBar, targetTab: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none"
                >
                  <option value="ppdb">Halaman PPDB</option>
                  <option value="berita">Halaman Berita</option>
                  <option value="akademik">Halaman Akademik</option>
                  <option value="profil">Halaman Profil</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Isi Pesan Pengumuman</label>
              <textarea
                rows={2}
                value={formData.announcementBar.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcementBar: { ...formData.announcementBar, message: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                placeholder="Tuliskan pesan pengumuman..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Action Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            if (confirm('Kembalikan seluruh teks & gambar beranda ke setelan default awal?')) {
              onResetDefault();
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 3000);
            }
          }}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Kembalikan ke Default Pabrik</span>
        </button>

        <div className="flex items-center gap-2">
          {onNavigateToWebsiteTab && (
            <button
              type="button"
              onClick={() => onNavigateToWebsiteTab('beranda')}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Lihat di Halaman Utama</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Seluruh Perubahan Beranda</span>
          </button>
        </div>
      </div>
    </div>
  );
};
