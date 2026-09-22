import React, { useState } from 'react';
import { Rss, FileText, ChevronLeft, ChevronRight, X, Clock, User, Share2 } from 'lucide-react';
import { INITIAL_NEWS } from '../data/mockData';
import { NewsItem } from '../types';

interface DistrictNewsProps {
  onNavigateTab: (tab: string) => void;
  newsList?: NewsItem[];
}

export const DistrictNews: React.FC<DistrictNewsProps> = ({ onNavigateTab, newsList: propNewsList }) => {
  const newsList = propNewsList && propNewsList.length > 0 ? propNewsList : INITIAL_NEWS;
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  return (
    <section className="w-full py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header matching District News in reference photo */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-purple-800 pb-2 mb-6 gap-3">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#321759] font-serif tracking-tight">
              Warta & Berita Sekolah
            </h2>
            <button
              onClick={() => onNavigateTab('berita')}
              className="text-xs sm:text-sm font-semibold text-purple-700 hover:text-purple-950 transition-colors cursor-pointer hidden sm:inline-block"
            >
              Arsip Berita &gt;
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Orange RSS icon matching the circular RSS badge in reference photo */}
            <div
              className="w-7 h-7 rounded-full bg-[#f26522] text-white flex items-center justify-center shadow-sm cursor-pointer hover:opacity-90"
              title="Feed Berita Sekolah"
              onClick={() => alert('Feed Berita SMAK Setia Bakti aktif.')}
            >
              <Rss className="w-4 h-4" />
            </div>

            <button
              onClick={() => onNavigateTab('berita')}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#522d8a] hover:text-purple-950 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#522d8a]" />
              <span>Lihat Semua Berita &gt;</span>
            </button>
          </div>
        </div>

        {/* 4 Cards Grid - Exact replica of the reference screenshot */}
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Article Photo Thumbnail */}
                <div className="relative h-48 sm:h-44 overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-purple-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-wide">
                    {item.category}
                  </span>
                </div>

                {/* Article Text Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-medium block">
                      {item.date} • {item.readTime}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#432874] transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedArticle(item)}
                      className="text-xs font-bold text-[#522d8a] hover:text-purple-950 transition-colors cursor-pointer group-hover:translate-x-0.5 transition-transform"
                    >
                      Baca Selengkapnya &gt;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel pagination dots at the bottom matching reference photo */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <button
              key={i}
              onClick={() => setActiveDot(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === activeDot
                  ? 'bg-purple-800 w-5 ring-2 ring-purple-300'
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
              aria-label={`Halaman Berita ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Complete Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="relative h-56 bg-slate-900">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="bg-purple-600 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {selectedArticle.category}
                </span>
                <h2 className="text-base sm:text-xl font-bold mt-1 leading-snug drop-shadow">
                  {selectedArticle.title}
                </h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-slate-700 text-xs sm:text-sm leading-relaxed">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-purple-700" />
                    <span>{selectedArticle.author}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-700" />
                    <span>{selectedArticle.date}</span>
                  </span>
                </div>
                <button
                  onClick={() => alert('Tautan berita disalin ke papan klip!')}
                  className="flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Bagikan
                </button>
              </div>

              <p className="font-semibold text-slate-900 text-sm">{selectedArticle.excerpt}</p>
              <p>{selectedArticle.content}</p>
              <p>
                Kegiatan ini selaras dengan visi utama SMAK Setia Bakti Ruteng untuk terus memajukan
                kualitas pendidikan di Manggarai dan daratan Flores, membekali siswa dengan kecerdasan
                intelektual, kepekaan rohani, dan keterampilan praktis abad 21.
              </p>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-[#432874] text-white text-xs font-semibold rounded hover:bg-[#341b5e] transition-colors cursor-pointer"
              >
                Tutup Berita
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
