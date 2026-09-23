import React, { useState, useEffect } from 'react';
import {
  Building2,
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Heart,
  Lightbulb,
  Cross,
} from 'lucide-react';
import { SchoolProfile, HomepageConfig } from '../types';
import { INITIAL_SCHOOL_PROFILE, DEFAULT_HOMEPAGE_CONFIG } from '../data/mockData';

interface SchoolProfileSectionProps {
  profile?: SchoolProfile;
  homepageConfig?: HomepageConfig;
  initialSubTab?: string;
  onNavigateTab?: (tab: string, subTab?: string) => void;
}

export const SchoolProfileSection: React.FC<SchoolProfileSectionProps> = ({
  profile = INITIAL_SCHOOL_PROFILE,
  homepageConfig,
  initialSubTab = 'sejarah',
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // ==========================================================
  // SINKRONISASI DATA KEPALA SEKOLAH
  // ==========================================================
  const welcome = homepageConfig?.welcomeSection || DEFAULT_HOMEPAGE_CONFIG.welcomeSection;

  const principalPhoto =
    welcome?.principalPhotoUrl ||
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80';

  const principalName = welcome?.principalName || profile.principal || 'Kepala Sekolah';
  const principalRole = welcome?.principalRole || 'Kepala Sekolah SMA Katolik Setia Bakti Ruteng';
  const principalGreetingTitle = welcome?.title || 'Mendidik Manusia Seutuhnya: Cerdas Akal, Luhur Hati, dan Kuat Karakter';
  const principalQuote = welcome?.quote || '';
  const principalBadge = welcome?.badge || 'PESAN & HARAPAN PENDIDIK';

  // ==========================================================
  // FOTO SEJARAH (diambil dari profile.historyPhotoUrl)
  // ==========================================================
  const historyPhotoUrl =
    profile.historyPhotoUrl ||
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80';

  const historyPhotoCaption =
    profile.historyPhotoCaption || 'Kampus Hijau Berwawasan Lingkungan';

  // ==========================================================
  // FOTO FASILITAS (jika ada di profile, gunakan; jika tidak, pakai default)
  // ==========================================================
  const defaultFacilities = [
    {
      id: 'fac-1',
      title: 'Laboratorium MIPA Terpadu',
      desc: 'Fasilitas praktikum Fisika, Kimia, dan Biologi lengkap dengan mikroskop optik modern, preparat, kit robotika sains, dan ruang asam bersertifikasi.',
      img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80',
      tag: 'Sains & Riset',
    },
    {
      id: 'fac-2',
      title: 'Laboratorium Komputer & Multimedia',
      desc: '3 ruang lab komputer ber-AC dengan koneksi internet fiber-optic 100 Mbps, perangkat PC Intel Core i7 untuk pembelajaran coding, desain grafis, dan asesmen digital.',
      img: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
      tag: 'Teknologi Digital',
    },
    {
      id: 'fac-3',
      title: 'Perpustakaan Digital St. Agustinus',
      desc: 'Koleksi lebih dari 12.000 judul buku fisik, ensiklopedia, jurnal ilmiah, ruang baca berkarpet yang tenang, dan katalog e-library daring.',
      img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80',
      tag: 'Literasi & Pustaka',
    },
    {
      id: 'fac-4',
      title: 'Kapela Sekolah St. Yohanes Paulus II',
      desc: 'Tempat hening untuk ibadat pagi, adorasi sakramen mahakudus, misa perayaan hari raya gereja, dan pembinaan retret/rekoleksi tahunan siswa.',
      img: 'https://images.unsplash.com/photo-1548625361-1960246a47a1?auto=format&fit=crop&w=600&q=80',
      tag: 'Spiritualitas Katolik',
    },
    {
      id: 'fac-5',
      title: 'Asrama Putra & Putri Terpadu',
      desc: 'Hunian asrama asri dan aman di lingkungan sejuk Ruteng dengan pendampingan suster dan pastor, ruang belajar bersama, serta katering nutrisi terjamin.',
      img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80',
      tag: 'Kehidupan Asrama',
    },
    {
      id: 'fac-6',
      title: 'Kompleks Olahraga & Pentas Seni',
      desc: 'Lapangan basket berstandar Perbasi, lapangan voli, futsal, dan aula serbaguna kapasitas 1.200 orang untuk pementasan tari caci dan paduan suara.',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
      tag: 'Olahraga & Seni',
    },
  ];

  const facilityItems =
    profile.facilityPhotos && profile.facilityPhotos.length > 0
      ? profile.facilityPhotos
      : defaultFacilities;

  const tabs = [
    { id: 'sejarah', label: 'Sejarah & Identitas', icon: Building2 },
    { id: 'visi-misi', label: 'Visi, Misi & Karakter', icon: Compass },
    { id: 'sambutan', label: 'Sambutan Kepala Sekolah', icon: BookOpen },
    { id: 'fasilitas', label: 'Fasilitas & Sarana', icon: Award },
    { id: 'identitas', label: 'Akreditasi & Tata Kelola', icon: ShieldCheck },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-[600px] py-10 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#004d99] via-[#005fb8] to-[#0074d9] rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
              Tentang Sekolah Kami
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Profil SMA Katolik Setia Bakti Ruteng
            </h1>
            <p className="text-sm text-blue-100 leading-relaxed">
              Mendidik dengan Iman, Berilmu Unggul, dan Berbudi Luhur sejak 1968 di Jantung Kota Dingin Ruteng, Flores, Nusa Tenggara Timur.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-blue-50">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                Akreditasi: {profile.accreditation || 'A (Unggul)'}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                <GraduationCap className="w-4 h-4 text-emerald-300" />
                NPSN: {profile.npsn || '50302811'}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                <Building2 className="w-4 h-4 text-sky-300" />
                {profile.yayasan || 'Yayasan Persekolahan St. Paulus Ruteng'}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Menu Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#005fb8] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SEJARAH & IDENTITAS SEKOLAH */}
        {activeSubTab === 'sejarah' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                  Jejak Langkah Historis
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900">
                  Sejarah Pendirian & Pengabdian Pendidikan
                </h2>
                <div className="text-sm text-slate-700 space-y-4 leading-relaxed">
                  <p>
                    {profile.history ||
                      'SMA Katolik Setia Bakti Ruteng didirikan pada tanggal 1 Agustus 1968 oleh para perintis misi Katolik di bawah naungan Keuskupan Ruteng dan Yayasan Persekolahan St. Paulus Ruteng (YAPERPATER).'}
                  </p>
                  <p>
                    Nama <strong>"Setia Bakti"</strong> mengakar dari nilai luhur kesetiaan kepada ajaran Kristus, nusa dan bangsa, serta pembaktian tulus tanpa pamrih bagi kesejahteraan umat manusia dan pemajuan masyarakat Manggarai.
                  </p>
                  <p>
                    Selama lebih dari setengah abad berkarya, SMAK Setia Bakti telah meluluskan lebih dari 4.800 alumni yang kini mengabdi sebagai dokter spesialis, profesor dan dosen, imam dan biarawati, insinyur teknik, hakim, perwira TNI-Polri, pengusaha, serta pemimpin pemerintahan daerah dan nasional.
                  </p>
                </div>

                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tahun Berdiri</p>
                    <p className="text-lg font-black text-slate-800">1968</p>
                    <p className="text-[10px] text-slate-500">58+ Tahun Mengabdi</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Akreditasi BAN-S/M</p>
                    <p className="text-lg font-black text-emerald-600">A (96/100)</p>
                    <p className="text-[10px] text-slate-500">Sangat Unggul</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Lulusan & Alumni</p>
                    <p className="text-lg font-black text-[#005fb8]">4.820+</p>
                    <p className="text-[10px] text-slate-500">Tersebar di Nusantara</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                  <img
                    src={historyPhotoUrl}
                    alt={historyPhotoCaption}
                    className="w-full h-56 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-slate-900 text-base">{historyPhotoCaption}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Terletak di dataran tinggi Ruteng yang sejuk, kompleks sekolah dilengkapi taman refleksi, kapela doa, dan fasilitas multimedia berstandar nasional.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Motto Sekolah</span>
                  </div>
                  <p className="text-lg font-serif italic text-amber-950 font-bold">
                    "{profile.motto || 'Fides, Scientia, et Mores'}"
                  </p>
                  <p className="text-xs text-amber-800">
                    Artinya: Berakar pada <strong>Iman</strong>, menjunjung tinggi <strong>Ilmu Pengetahuan</strong>, dan memancarkan <strong>Moralitas Luhur</strong> dalam setiap perbuatan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VISI & MISI */}
        {activeSubTab === 'visi-misi' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="max-w-3xl space-y-2">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-1 rounded">
                  Arah & Landasan Filosofis
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900">
                  Visi, Misi & Nilai-Nilai Pembinaan Karakter
                </h2>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 space-y-2">
                <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">
                  VISI SEKOLAH (TARGET 2030)
                </span>
                <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic font-serif">
                  "{profile.vision ||
                    'Menjadi lembaga pendidikan Katolik unggulan di tingkat regional dan nasional yang menghasilkan generasi beriman teguh, cerdas berpengetahuan, berkarakter luhur, serta mencintai kebudayaan lokal Flores pada tahun 2030.'}"
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                  MISI STRATEGIS SEKOLAH:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(profile.missions && profile.missions.length > 0
                    ? profile.missions
                    : [
                        'Menyelenggarakan proses pembelajaran akademis bermutu tinggi berbasis Kurikulum Merdeka yang menumbuhkan daya nalar kritis dan inovasi.',
                        'Menanamkan nilai-nilai moralitas kristiani, spiritualitas cinta kasih, dan keteladanan santo pelindung sekolah dalam kehidupan sehari-hari.',
                        'Mengembangkan potensi minat, bakat, kepemimpinan, dan kewirausahaan siswa melalui beragam kegiatan ekstrakurikuler serta literasi jurnalistik.',
                        'Melestarikan dan mendayagunakan kearifan lokal budaya Manggarai dalam harmoni kebhinekaan nusantara.',
                        'Mewujudkan tata kelola sekolah yang transparan, akuntabel, berbasis teknologi digital terpadu, dan berorientasi pada kepuasan civitas akademika.',
                      ]
                  ).map((misi, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#005fb8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{misi}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                  4 Pilar Nilai Karakter Siswa Setia Bakti:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1.5">
                    <Heart className="w-6 h-6 text-rose-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Fides (Iman Teguh)</h4>
                    <p className="text-xs text-slate-600">Hidup berserah kepada Tuhan, rajin berdoa, dan mempraktikkan kasih kristiani kepada sesama.</p>
                  </div>
                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1.5">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Scientia (Cerdas & Kritis)</h4>
                    <p className="text-xs text-slate-600">Haus akan pengetahuan, tekun meriset sains dan teknologi, serta berjiwa pembelajar seumur hidup.</p>
                  </div>
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1.5">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Mores (Integritas Moral)</h4>
                    <p className="text-xs text-slate-600">Jujur, disiplin, berani membela kebenaran, dan santun dalam bertutur kata serta bertindak.</p>
                  </div>
                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200 space-y-1.5">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                    <h4 className="font-bold text-slate-900 text-sm">Kearifan Manggarai</h4>
                    <p className="text-xs text-slate-600">Menjaga falsafah "Neka hemong kuni agu kalo" (Jangan lupakan tanah kelahiran dan budaya leluhur).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAMBUTAN KEPALA SEKOLAH */}
        {activeSubTab === 'sambutan' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 text-center space-y-3">
                <div className="w-48 h-56 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-slate-100 bg-slate-100">
                  <img
                    src={principalPhoto}
                    alt={principalName}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{principalName}</h3>
                  <p className="text-xs font-semibold text-[#005fb8]">{principalRole}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Masa Bakti: 2022 – Sekarang</p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-8 pt-6 lg:pt-0">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded">
                  {principalBadge}
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900">"{principalGreetingTitle}"</h2>
                <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                  <p>
                    <em>Salam damai sejahtera dalam kasih Kristus bagi kita semua,</em>
                  </p>
                  <p>
                    {principalQuote ||
                      'Selamat datang di portal resmi SMA Katolik Setia Bakti Ruteng. Kami berkomitmen menyelenggarakan pendidikan Katolik yang berkarakter, mengakar pada budaya Manggarai, serta siap bersaing di panggung nasional dan global.'}
                  </p>
                </div>
                <div className="pt-2">
                  <p className="font-serif italic text-slate-800 font-semibold">Tuhan Memberkati Kita Sekalian.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FASILITAS & SARANA PRASARANA */}
        {activeSubTab === 'fasilitas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100 px-2.5 py-1 rounded">
                  Infrastruktur Pembelajaran Modern
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Sarana & Prasarana Kampus Terpadu
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Disediakan untuk menunjang eksplorasi ilmiah, kreativitas digital, olahraga kebugaran, dan kehidupan rohani peserta didik.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilityItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-44 w-full overflow-hidden bg-slate-200 relative">
                        <img
                          src={item.img}
                          alt={item.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {item.tag}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <div className="px-5 pb-4">
                      <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Kondisi Terawat & Beroperasi Penuh
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: IDENTITAS RESMI */}
        {activeSubTab === 'identitas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                  Legalitas & Data Pokok Pendidikan
                </span>
                <h3 className="text-xl font-bold text-slate-900">Identitas Resmi Sekolah (Kemendikbudristek)</h3>

                <div className="space-y-3 text-xs divide-y divide-slate-100">
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Nama Resmi Satuan Pendidikan:</span>
                    <span className="font-bold text-slate-800 text-right">{profile.name}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Nomor Pokok Sekolah Nasional (NPSN):</span>
                    <span className="font-bold font-mono text-purple-900 text-right">{profile.npsn || '50302811'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Status Akreditasi Sekolah:</span>
                    <span className="font-bold text-emerald-700 text-right">{profile.accreditation || 'A (Unggul) - BAN S/M'}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Bentuk Pendidikan:</span>
                    <span className="font-bold text-slate-800 text-right">Sekolah Menengah Atas (SMA)</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Status Kepemilikan:</span>
                    <span className="font-bold text-slate-800 text-right">Yayasan Swasta Katolik</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Badan Penyelenggara:</span>
                    <span className="font-bold text-slate-800 text-right">{profile.yayasan}</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Kurikulum Yang Digunakan:</span>
                    <span className="font-bold text-slate-800 text-right">Kurikulum Merdeka Mandiri Berbagi</span>
                  </div>
                  <div className="pt-2 flex justify-between">
                    <span className="text-slate-500 font-medium">Waktu Penyelenggaraan:</span>
                    <span className="font-bold text-slate-800 text-right">Pagi Hari (07.00 - 14.15 WITA)</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded">
                  Sekretariat & Pelayanan
                </span>
                <h3 className="text-xl font-bold text-slate-900">Alamat & Kanal Informasi</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800 block text-sm mb-0.5">Alamat Kampus:</span>
                      <p className="text-slate-600 leading-relaxed">{profile.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block text-sm mb-0.5">Telepon Sekretariat:</span>
                      <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline font-semibold">
                        {profile.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 block text-sm mb-0.5">Surel Resmi (Email):</span>
                      <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline font-semibold">
                        {profile.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('jurusan');
                    }}
                    className="w-full py-2.5 bg-[#005fb8] hover:bg-[#004d99] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Jelajahi Peminatan & Program Akademik</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};