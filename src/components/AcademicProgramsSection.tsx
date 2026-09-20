import React from 'react';

interface AcademicProgramsSectionProps {
  onNavigateTab: (tab: string) => void;
}

export const AcademicProgramsSection: React.FC<AcademicProgramsSectionProps> = ({
  onNavigateTab,
}) => {
  // 3 Program unggulan dalam Bahasa Indonesia
  const featuredCourses = [
    {
      id: 'ips',
      title: 'Peminatan Ilmu Pengetahuan Sosial (IPS)',
      schoolLabel: 'Ekonomi, Sosiologi, Geografi & Kewirausahaan',
      desc: 'Membekali peserta didik dengan pemahaman analisis sosial, literasi finansial, kepemimpinan, dan etika berwirausaha untuk menjawab dinamika kemasyarakatan dan ekonomi modern.',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80',
      tab: 'akademik',
    },
    {
      id: 'mipa',
      title: 'Peminatan Matematika & Ilmu Pengetahuan Alam (MIPA)',
      schoolLabel: 'Fisika, Kimia, Biologi & Riset Teknologi',
      desc: 'Mengembangkan kecakapan berpikir kritis, metodologi riset ilmiah, serta penalaran teknologi sains modern sebagai pijakan unggul menuju perguruan tinggi teknik dan kesehatan.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=700&q=80',
      tab: 'akademik',
    },
    {
      id: 'bahasa',
      title: 'Peminatan Bahasa & Kebudayaan Nusantara',
      schoolLabel: 'Bahasa Inggris, Jerman & Budaya Manggarai',
      desc: 'Mengasah kemampuan diplomasi komunikasi multibahasa, apresiasi sastra, pariwisata berakar budaya Flores, serta kesiapan generasi berwawasan global yang tetap berakar tradisi.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80',
      tab: 'akademik',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 bg-[#fcfcfc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* 3-Card Grid matching the user's reference mockup */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                {/* Image Thumbnail */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3
                    onClick={() => onNavigateTab(course.tab)}
                    className="text-lg font-bold text-slate-800 group-hover:text-[#0074d9] transition-colors leading-snug cursor-pointer mb-3"
                  >
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                    {course.desc}
                  </p>
                </div>
              </div>

              {/* Blue Action Button (Matches Pelajari Selengkapnya >) */}
              <div className="px-6 pb-6 pt-0">
                <button
                  onClick={() => onNavigateTab(course.tab)}
                  className="bg-[#0074d9] hover:bg-[#005fb8] text-white font-semibold text-xs uppercase tracking-wide px-5 py-2.5 rounded-none transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <span>Pelajari Selengkapnya</span>
                  <span className="text-[11px] font-bold">&gt;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
