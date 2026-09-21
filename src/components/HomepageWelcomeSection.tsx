import React from 'react';
import { Quote, ArrowRight, Award, CheckCircle2 } from 'lucide-react';
import { HomepageWelcomeSection as WelcomeSectionType } from '../types';

interface HomepageWelcomeSectionProps {
  welcome: WelcomeSectionType;
  onNavigateTab: (tab: string) => void;
}

export const HomepageWelcomeSection: React.FC<HomepageWelcomeSectionProps> = ({
  welcome,
  onNavigateTab,
}) => {
  if (!welcome || !welcome.enabled) return null;

  return (
    <section className="w-full py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left: Foto Kepala Sekolah */}
            <div className="lg:col-span-4 p-6 sm:p-8 bg-gradient-to-br from-[#1a1c38] to-[#0f1124] text-white flex flex-col items-center text-center justify-center relative overflow-hidden">
              <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative w-44 h-52 sm:w-48 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 mb-4 bg-slate-800">
                <img
                  src={
                    welcome.principalPhotoUrl ||
                    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80'
                  }
                  alt={welcome.principalName}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h4 className="text-base font-bold text-white tracking-wide">
                {welcome.principalName}
              </h4>
              <p className="text-xs text-blue-300 font-medium mt-0.5">
                {welcome.principalRole}
              </p>

              <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[10px] font-semibold border border-white/10">
                <Award className="w-3 h-3 text-amber-400" />
                <span>Pemimpin Penggerak Katolik</span>
              </div>
            </div>

            {/* Right: Kutipan Sambutan */}
            <div className="lg:col-span-8 p-6 sm:p-10 lg:p-12 space-y-4 relative">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                  {welcome.badge || 'SAMBUTAN RESMI'}
                </span>
                <span className="text-xs text-slate-400">• SMA Katolik Setia Bakti Ruteng</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                {welcome.title}
              </h3>

              <div className="relative">
                <Quote className="w-8 h-8 text-blue-200 absolute -top-2 -left-2 sm:-left-3 opacity-60 -z-0" />
                <p className="relative z-10 text-slate-600 text-sm sm:text-base leading-relaxed pl-5 italic font-serif">
                  "{welcome.quote}"
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateTab('profil')}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-md active:scale-95"
                >
                  <span>Baca Profil Lengkap Sekolah</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('ppdb')}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Informasi PPDB 2026</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
