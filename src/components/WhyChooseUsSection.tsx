import React from 'react';
import { Lightbulb, Globe2, Compass, HeartHandshake, ArrowRight } from 'lucide-react';

interface WhyChooseUsSectionProps {
  onNavigateTab: (tab: string) => void;
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({ onNavigateTab }) => {
  const pillars = [
    {
      icon: Lightbulb,
      title: 'Pembelajaran Inovatif',
      desc: 'Praktik riset sains langsung dengan guru berpengalaman dan fasilitas Kurikulum Merdeka modern.',
    },
    {
      icon: Globe2,
      title: 'Wawasan Masa Depan',
      desc: 'Mempersiapkan siswa bersaing di universitas favorit nasional maupun kancah internasional.',
    },
    {
      icon: Compass,
      title: 'Kesiapan Studi & Karier',
      desc: 'Bimbingan intensif UTBK/SNBT, pemetaan minat bakat, dan kolaborasi jejaring alumni berprestasi.',
    },
    {
      icon: HeartHandshake,
      title: 'Komunitas Kasih & Suportif',
      desc: 'Pendidikan berasrama Katolik yang aman, penuh persaudaraan, dan menumbuhkan karakter mulia.',
    },
  ];

  return (
    <section className="w-full py-14 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-600">
              MENGAPA SMAK SETIA BAKTI?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Sekolah Katolik yang Membimbing Masa Depanmu
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Lebih dari enam dekade mengabdi di tanah Manggarai, melahirkan ribuan alumni yang kini berkiprah
              sebagai akademisi, dokter, rohaniwan, wirausahawan, dan abdi negara.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('akademik')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-slate-300 hover:border-slate-900 text-slate-800 hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>TENTANG SEKOLAH KAMI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column (8 cols on lg): 4 Horizontal Feature Blocks */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">{pillar.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
