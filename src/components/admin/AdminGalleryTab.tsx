import React, { useState } from 'react';
import {
  Image,
  Plus,
  Trash2,
  ExternalLink,
  Tag,
  Calendar,
} from 'lucide-react';
import { GalleryItem } from '../../types';

interface AdminGalleryTabProps {
  galleryList: GalleryItem[];
  onAddGallery: (item: GalleryItem) => void;
  onDeleteGallery: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminGalleryTab: React.FC<AdminGalleryTabProps> = ({
  galleryList,
  onAddGallery,
  onDeleteGallery,
  onNavigateToWebsiteTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Rohani' | 'Prestasi' | 'Seni & Budaya' | 'Akademik' | 'Olahraga'>('Prestasi');
  const [date, setDate] = useState('18 September 2026');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80'
  );
  const [description, setDescription] = useState('');

  const handleCreateGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Mohon isi judul dan deskripsi dokumentasi kegiatan!');
      return;
    }

    const newItem: GalleryItem = {
      id: `g-${Date.now()}`,
      title,
      category,
      date: date || 'September 2026',
      imageUrl,
      description,
    };

    onAddGallery(newItem);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    alert(`Dokumentasi "${title}" berhasil ditambahkan dan langsung tampil pada Galeri Siswa Website!`);
  };

  const filteredGallery = galleryList.filter(
    (g) => selectedCategory === 'Semua' || g.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with integration status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-800 text-[10px] font-extrabold uppercase tracking-wider">
              Dokumentasi Website
            </span>
            <span className="text-xs text-slate-400">• Tampil di Halaman Galeri Siswa</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Galeri Kegiatan & Prestasi Siswa</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah foto dokumentasi kegiatan rohani, pentas seni budaya Manggarai, olimpiade sains, dan perlombaan olahraga.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToWebsiteTab && (
            <button
              onClick={() => onNavigateToWebsiteTab('galeri')}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#432874] text-xs font-bold rounded-xl border border-purple-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Galeri di Website</span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Foto Dokumentasi</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['Semua', 'Rohani', 'Prestasi', 'Seni & Budaya', 'Akademik', 'Olahraga'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
              selectedCategory === cat
                ? 'bg-[#3b1d70] text-white shadow'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#3b1d70]/90 text-white backdrop-blur-sm">
                  {item.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <span className="text-[11px] font-semibold text-purple-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {item.date}
                </span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-end">
              <button
                onClick={() => {
                  if (window.confirm(`Hapus foto dokumentasi "${item.title}"?`)) {
                    onDeleteGallery(item.id);
                  }
                }}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Hapus Dokumentasi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: TAMBAH FOTO DOKUMENTASI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tambah Foto Galeri Kegiatan Siswa</h3>
                <p className="text-xs text-slate-500">
                  Foto ini akan langsung dipublikasikan pada Halaman Galeri Siswa Website.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGallery} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kegiatan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pentas Seni Tari Caci & Budaya Manggarai"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                  >
                    <option value="Rohani">Rohani & Keagamaan</option>
                    <option value="Prestasi">Prestasi & Kompetisi</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Akademik">Akademik & Sains</option>
                    <option value="Olahraga">Olahraga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal Kegiatan</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Contoh: 18 September 2026"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Dokumentasi</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-400">Preset Foto:</span>
                  {[
                    { label: 'Paduan Suara', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80' },
                    { label: 'Laboratorium', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80' },
                    { label: 'Pentas Budaya', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80' },
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(p.url)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded text-[10px] font-semibold cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Dokumentasi *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan singkat mengenai momen dan tujuan kegiatan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Unggah ke Galeri Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
