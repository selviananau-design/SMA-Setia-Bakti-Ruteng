import React from 'react';
import {
  Briefcase,
  Cpu,
  HeartPulse,
  Palette,
  Users,
  Scale,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AcademicProgramsSectionProps {
  onNavigateTab: (tab: string) => void;
}

export const AcademicProgramsSection: React.FC<AcademicProgramsSectionProps> = ({
  onNavigateTab,
}) => {
  const programs = [
    {
      id: 'bisnis',
      title: 'Bisnis & Manajemen Sosial',
      subtitle: 'Ilmu Pengetahuan Sosial (IPS)',
      desc: 'Membangun keterampilan kepemimpinan, pemahaman ekonomi terapan, dan tata kelola masyarakat.',
      image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=600&q=80',
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      id: 'teknik',
      title: 'Sains & Teknologi Terapan',
      subtitle: 'Matematika & Fisika (MIPA)',
      desc: 'Mengembangkan daya inovasi melalui matematika lanjut, robotika, dan komputasi sains.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      icon: Cpu,
      color: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'kesehatan',
      title: 'Kesehatan & Sains Hayati',
      subtitle: 'Biologi & Kimia (MIPA)',
      desc: 'Praktikum riset mikroskopik, kimia analitis, dan bimbingan persiapan masuk fakultas kedokteran.',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80',
      icon: HeartPulse,
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'seni',
      title: 'Seni, Bahasa & Humaniora',
      subtitle: 'Bahasa & Budaya Flores',
      desc: 'Eksplorasi kreativitas ekspresi, sastra dunia, bahasa asing, dan pelestarian budaya Manggarai.',
      image: 'https://images.unsplash.com/photo-1460518451282-474b15672083?auto=format&fit=crop&w=600&q=80',
      icon: Palette,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'sosial',
      title: 'Pendidikan & Ilmu Sosial',
      subtitle: 'Karakter & Pengabdian',
      desc: 'Membina empati sosial, nilai toleransi Kristiani, dan pengabdian nyata bagi masyarakat Nusa Tenggara.',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
      icon: Users,
      color: 'bg-rose-50 text-rose-700',
    },
    {
      id: 'hukum',
      title: 'Hukum & Tata Kewargaan',
      subtitle: 'Debat & Etika Publik',
      desc: 'Menegakkan nilai keadilan, kecakapan argumentasi ilmiah, dan integritas calon penegak hukum.',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      icon: Scale,
      color: 'bg-indigo-50 text-indigo-700',
    },
  ];

  return (
    <section className="w-full py-14 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header with Eyebrow and "View All" link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KEUNGGULAN AKADEMIK</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Temukan Program yang Menginspirasimu
            </h2>
          </div>

          <button
            onClick={() => onNavigateTab('akademik')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 hover:text-purple-900 transition-colors cursor-pointer group whitespace-nowrap self-start sm:self-auto"
          >
            <span>LIHAT SEMUA PROGRAM</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6-Card Grid matching reference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {programs.map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                onClick={() => onNavigateTab('akademik')}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`p-2 rounded-lg ${prog.color} shadow-sm backdrop-blur-sm bg-white/90`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {prog.subtitle}
                    </p>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-950 transition-colors mb-2">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {prog.desc}
                    </p>
                  </div>
                </div>

                {/* Explore Link */}
                <div className="px-5 pb-5 pt-1">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                    <span>Jelajahi Kurikulum</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
