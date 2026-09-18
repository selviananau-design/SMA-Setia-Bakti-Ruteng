import React from 'react';
import { ArrowRight, Trophy, Sparkles, Calendar, Home, Users } from 'lucide-react';

interface CampusLifeSectionProps {
  onNavigateTab: (tab: string) => void;
}

export const CampusLifeSection: React.FC<CampusLifeSectionProps> = ({ onNavigateTab }) => {
  const highlights = [
    {
      id: 'clubs',
      title: 'Klub & Organisasi',
      desc: '15+ Ekstrakurikuler minat & bakat siswa',
      icon: Users,
      badge: '15+ Ekskul',
    },
    {
      id: 'athletics',
      title: 'Olahraga & Atletik',
      desc: 'Basket, futsal, voli & bela diri berprestasi',
      icon: Trophy,
      badge: 'Kompetisi Resmi',
    },
    {
      id: 'events',
      title: 'Pentas Seni & Tradisi',
      desc: 'Festival budaya Manggarai & pentas tahunan',
      icon: Calendar,
      badge: 'Sepanjang Tahun',
    },
    {
      id: 'housing',
      title: 'Asrama & Kehidupan Sejuk',
      desc: 'Fasilitas asrama terpadu di kota sejuk Ruteng',
      icon: Home,
      badge: 'Asrama Putra/Putri',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Dark Navy Rounded Container matching the reference mockup */}
        <div className="bg-[#091326] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-5">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-400">
                KEHIDUPAN KAMPUS DINAMIS
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                Pengalaman Lebih dari Sekadar Pendidikan Kelas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Dari riset ilmiah, panggung paduan suara hingga kompetisi olahraga dan pembinaan rohani di
                asrama, SMAK Setia Bakti memberikan ribuan peluang untuk bertumbuh seutuhnya.
              </p>
              <div>
                <button
                  onClick={() => onNavigateTab('galeri')}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold px-5 py-3 rounded-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>JELAJAHI KEGIATAN SISWA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle Column (4 cols on lg): Large Student Photo */}
            <div className="lg:col-span-4 h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                alt="Kehidupan Siswa SMAK Setia Bakti"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Persaudaraan & Solidaritas
                </span>
                <p className="text-xs font-semibold text-white mt-1 drop-shadow">
                  Membina kebersamaan penuh kasih dan persahabatan sejati
                </p>
              </div>
            </div>

            {/* Right Column (4 cols on lg): 2x2 Feature Grid */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => onNavigateTab('galeri')}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all hover:border-white/20 cursor-pointer flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
