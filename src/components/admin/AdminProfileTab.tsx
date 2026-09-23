import React, { useState } from 'react';
import {
  School,
  Save,
  CheckCircle2,
  Award,
  BookOpen,
  MapPin,
  Phone,
  Mail,
  FileText,
  Camera,
  Image as ImageIcon,
} from 'lucide-react';
import { SchoolProfile } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';

interface AdminProfileTabProps {
  profile: SchoolProfile;
  onUpdateProfile: (updated: SchoolProfile) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminProfileTab: React.FC<AdminProfileTabProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToWebsiteTab,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-blue-100 text-blue-800 tracking-wider">
            Pengaturan Master Data
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <School className="w-5 h-5 text-blue-600" />
            <span>Kelola Profil & Identitas Sekolah</span>
          </h2>
          <p className="text-xs text-slate-500">
            Admin Utama dapat memperbarui profil lembaga, visi-misi, sejarah, akreditasi, dan kontak resmi.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5 animate-fadeIn shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="font-semibold">
            Profil SMA Katolik Setia Bakti Ruteng berhasil disimpan dan diperbarui di seluruh sistem!
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Resmi Sekolah</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">NPSN & Akreditasi</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={formData.npsn}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none"
                placeholder="NPSN: 50302811"
              />
              <input
                type="text"
                required
                value={formData.accreditation}
                onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                placeholder="Akreditasi A"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Yayasan Penyelenggara</label>
            <input
              type="text"
              required
              value={formData.yayasan}
              onChange={(e) => setFormData({ ...formData, yayasan: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Kepala Sekolah</label>
            <input
              type="text"
              required
              value={formData.principal}
              onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-semibold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Motto Sekolah (Semboyan Latin)</label>
            <input
              type="text"
              required
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-serif italic"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Visi Sekolah</label>
            <textarea
              rows={2}
              required
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Misi Sekolah (Satu per baris)</label>
            <textarea
              rows={5}
              required
              value={formData.missions.join('\n')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  missions: e.target.value.split('\n').filter((m) => m.trim().length > 0),
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Sejarah Singkat Lembaga</label>
            <textarea
              rows={4}
              required
              value={formData.history}
              onChange={(e) => setFormData({ ...formData, history: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Alamat Kampus</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nomor Telepon Kantor</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Resmi Sekolah</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none font-mono"
            />
          </div>
        </div>

        {/* ========================================================== */}
        {/* BAGIAN 1: FOTO RESMI & IDENTITAS VISUAL SEKOLAH          */}
        {/* ========================================================== */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Camera className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Foto Resmi & Identitas Visual Sekolah (Pilih Berkas / Choose File)
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-4">
            Unggah foto langsung dari perangkat (komputer / ponsel). Seluruh gambar disimpan langsung ke sistem tanpa perlu memasukkan tautan URL eksternal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ImageUploadField
              label="Logo Resmi Sekolah / Lambang"
              value={formData.logoUrl}
              onChange={(dataUrl) => setFormData({ ...formData, logoUrl: dataUrl })}
              helperText="Format transparan PNG disarankan (Max 5MB)"
              aspectRatio="square"
              placeholderText="Pilih berkas logo sekolah"
            />

            <ImageUploadField
              label="Pas Foto Resmi Kepala Sekolah"
              value={formData.principalPhotoUrl}
              onChange={(dataUrl) => setFormData({ ...formData, principalPhotoUrl: dataUrl })}
              helperText="Pas foto jas / seragam resmi formal"
              aspectRatio="square"
              placeholderText="Pilih foto kepala sekolah"
            />

            <ImageUploadField
              label="Foto Gedung / Kampus Utama"
              value={formData.heroImageUrl}
              onChange={(dataUrl) => setFormData({ ...formData, heroImageUrl: dataUrl })}
              helperText="Foto lanskap gerbang / gedung SMAK Setia Bakti"
              aspectRatio="video"
              placeholderText="Pilih foto gedung kampus"
            />
          </div>
        </div>

        {/* ========================================================== */}
        {/* BAGIAN 2: FOTO SEJARAH & KILAS BALIK (BARU)              */}
        {/* ========================================================== */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-800">
              Foto Sejarah & Kilas Balik Sekolah
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-4">
            Foto ini akan tampil di halaman <strong>Profil → Sejarah & Identitas</strong>. Disarankan foto lanskap dengan kualitas baik.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadField
              label="Foto Sejarah / Gedung Kampus (Profil Sekolah)"
              value={formData.historyPhotoUrl}
              onChange={(dataUrl) => setFormData({ ...formData, historyPhotoUrl: dataUrl })}
              helperText="Foto lanskap gerbang, gedung, atau suasana kampus"
              aspectRatio="video"
              placeholderText="Pilih foto sejarah kampus"
            />

            <div>
              <label className="block font-bold text-slate-700 mb-1">Keterangan / Caption Foto Sejarah</label>
              <textarea
                rows={4}
                value={formData.historyPhotoCaption || ''}
                onChange={(e) => setFormData({ ...formData, historyPhotoCaption: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none leading-relaxed"
                placeholder="Contoh: Kampus Hijau Berwawasan Lingkungan"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Teks ini akan tampil sebagai judul di bawah foto sejarah.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-slate-200">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Profil Sekolah</span>
          </button>
        </div>
      </form>
    </div>
  );
};