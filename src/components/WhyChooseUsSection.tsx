import React from 'react';
import {
  Lightbulb,
  Globe2,
  Compass,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Award,
} from 'lucide-react';
import { HomepageConfig } from '../types';

interface WhyChooseUsSectionProps {
  onNavigateTab: (tab: string) => void;
  config?: HomepageConfig['whyChooseUs'];
}

export const WhyChooseUsSection: React.FC<WhyChooseUsSectionProps> = ({
  onNavigateTab,
  config,
}) => {
  const eyebrow = config?.eyebrow || 'MENGAPA SMAK SETIA BAKTI?';
  const title = config?.title || 'Sekolah Katolik yang Membimbing Masa Depanmu';
  const description =
    config?.description ||
    'Lebih dari enam dekade mengabdi di tanah Manggarai, melahirkan ribuan alumni yang kini berkiprah sebagai akademisi, dokter, rohaniwan, wirausahawan, dan abdi negara.';
  const ctaText = config?.ctaText || 'TENTANG SEKOLAH KAMI';
  const ctaTab = config?.ctaTab || 'akademik';

  const defaultPillars = [
    {
      id: 'p-1',
      title: 'Pembelajaran Inovatif',
      desc: 'Praktik riset sains langsung dengan guru berpengalaman dan fasilitas Kurikulum Merdeka modern.',
      iconType: 'lightbulb',
    },
    {
      id: 'p-2',
      title: 'Wawasan Masa Depan',
      desc: 'Mempersiapkan siswa bersaing di universitas favorit nasional maupun kancah internasional.',
      iconType: 'globe',
    },
    {
      id: 'p-3',
      title: 'Kesiapan Studi & Karier',
      desc: 'Bimbingan intensif UTBK/SNBT, pemetaan minat bakat, dan kolaborasi jejaring alumni berprestasi.',
      iconType: 'compass',
    },
    {
      id: 'p-4',
      title: 'Komunitas Kasih & Suportif',
      desc: 'Pendidikan berasrama Katolik yang aman, penuh persaudaraan, dan menumbuhkan karakter mulia.',
      iconType: 'heart',
    },
  ];

  const pillars = config?.pillars && config.pillars.length > 0 ? config.pillars : defaultPillars;

  const renderPillarIcon = (iconType: string) => {
    switch (iconType) {
      case 'globe':
        return <Globe2 className="w-5 h-5" />;
      case 'compass':
        return <Compass className="w-5 h-5" />;
      case 'heart':
        return <HeartHandshake className="w-5 h-5" />;
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'award':
        return <Award className="w-5 h-5" />;
      case 'lightbulb':
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <section className="w-full py-14 sm:py-16 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-600">
              {eyebrow}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {description}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab(ctaTab)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-slate-300 hover:border-slate-900 text-slate-800 hover:text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column (8 cols on lg): 4 Horizontal Feature Blocks */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={pillar.id || idx}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform">
                  {renderPillarIcon(pillar.iconType)}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
