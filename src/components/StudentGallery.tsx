import React, { useState } from 'react';
import { Image, X, Calendar, Tag, Eye } from 'lucide-react';
import { INITIAL_GALLERY } from '../data/mockData';
import { GalleryItem } from '../types';

export const StudentGallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = ['Semua', 'Rohani', 'Prestasi', 'Seni & Budaya', 'Akademik', 'Olahraga'];

  const filteredItems = INITIAL_GALLERY.filter((item) =>
    selectedCategory === 'Semua' ? true : item.category === selectedCategory
  );

  return (
    <section className="w-full py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-200 gap-3">
          <div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-1 rounded-full inline-block mb-1">
              Dokumentasi Kreativitas & Prestasi
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#321759] font-serif tracking-tight">
              Galeri Kegiatan Siswa
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Merekam dinamika kehidupan sekolah, pembinaan iman kristiani, kompetisi sains, dan seni budaya Manggarai.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#432874] text-white shadow'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-100 hover:text-purple-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Perbesar Foto
                  </span>
                </div>
                <span className="absolute top-3 left-3 bg-[#432874]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-700" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#432874] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200">
            <div className="relative max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="max-h-[60vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {activeItem.category}
                </span>
                <span className="text-xs text-slate-400">{activeItem.date}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {activeItem.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {activeItem.description}
              </p>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveItem(null)}
                className="px-4 py-1.5 bg-[#432874] text-white text-xs font-semibold rounded hover:bg-[#341b5e] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
