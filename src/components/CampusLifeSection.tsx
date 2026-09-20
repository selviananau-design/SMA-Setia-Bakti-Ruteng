import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Trophy,
  Sparkles,
  Calendar,
  Home,
  Users,
  Feather,
  BookOpen,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  Heart,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Extracurricular, StudentWork } from '../types';
import { INITIAL_EXTRACURRICULARS, INITIAL_STUDENT_WORKS } from '../data/mockData';

interface CampusLifeSectionProps {
  onNavigateTab?: (tab: string, subTab?: string) => void;
  initialSubTab?: string;
  extracurriculars?: Extracurricular[];
  studentWorks?: StudentWork[];
}

export const CampusLifeSection: React.FC<CampusLifeSectionProps> = ({
  onNavigateTab,
  initialSubTab = 'ekskul',
  extracurriculars = INITIAL_EXTRACURRICULARS,
  studentWorks = INITIAL_STUDENT_WORKS,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialSubTab || 'ekskul');
  const [selectedWork, setSelectedWork] = useState<StudentWork | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('semua');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const subMenuTabs = [
    { id: 'ekskul', label: 'Ekstrakurikuler Unggulan', icon: Trophy },
    { id: 'karya', label: 'Karya Siswa (Cerpen & Puisi)', icon: Feather },
    { id: 'osis', label: 'Organisasi Siswa (OSIS & MPK)', icon: Users },
    { id: 'asrama', label: 'Asrama & Kehidupan Sekolah', icon: Home },
    { id: 'galeri', label: 'Galeri Foto & Dokumentasi', icon: Camera },
  ];

  const filteredWorks = studentWorks.filter((w) => {
    if (activeCategoryFilter === 'semua') return true;
    return w.category === activeCategoryFilter;
  });

  return (
    <section className="w-full py-10 bg-slate-50 min-h-[650px] animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Top Header Banner */}
        <div className="bg-[#091326] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full inline-block border border-amber-400/20">
              Lingkungan Dinamis & Penuh Kasih
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white">
              Kehidupan Siswa SMAK Setia Bakti
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Membangun karakter utuh peserta didik melalui 15+ ekstrakurikuler pilihan, literasi karya sastra, kepemimpinan OSIS, pembinaan asrama, dan pentas budaya Flores.
            </p>
          </div>
        </div>

        {/* Sub-menu Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {subMenuTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#3b1d70] text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-900 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-purple-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. SUB-MENU: EKSTRAKURIKULER UNGGULAN */}
        {activeSubTab === 'ekskul' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                    Pengembangan Bakat & Prestasi
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                    Daftar Ekstrakurikuler Pilihan Siswa
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Setiap siswa wajib memilih minimal 1 kegiatan ekstrakurikuler wajib (Pramuka) dan 1 pilihan minat bakat.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#005fb8] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                  {extracurriculars.length} Klub Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {extracurriculars.map((eskul) => (
                  <div
                    key={eskul.id}
                    className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-purple-300 hover:bg-purple-50/20 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-purple-100 text-purple-800">
                          {eskul.category}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 font-semibold">
                          {eskul.membersCount} Siswa
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900">{eskul.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{eskul.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-600">
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-medium">{eskul.schedule}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{eskul.location}</span>
                      </p>
                      <p className="text-slate-500 pt-1">
                        Pembina: <strong>{eskul.coach || (eskul as unknown as { mentor?: string }).mentor || 'Guru Pembina'}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. SUB-MENU: KARYA KREATIF SISWA (CERITA, PUISI, JURNALISTIK) */}
        {activeSubTab === 'karya' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded">
                    Literasi & Majalah Siswa
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                    Karya Kreatif Siswa: Cerita, Puisi & Jurnalistik
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Karya tulis dan liputan investigatif siswa yang terbit secara resmi di majalah dinding digital sekolah.
                  </p>
                </div>

                {/* Filter Category */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {['semua', 'Cerita', 'Puisi', 'Jurnalistik', 'Esai'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCategoryFilter === cat
                          ? 'bg-[#3b1d70] text-white shadow-sm'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50'
                      }`}
                    >
                      {cat === 'semua' ? 'Semua Karya' : cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredWorks.map((work) => (
                  <div
                    key={work.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all group"
                  >
                    {work.coverImage && (
                      <div className="h-44 w-full overflow-hidden relative">
                        <img
                          src={work.coverImage}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#211142]/85 backdrop-blur-sm text-amber-300">
                          {work.category}
                        </span>
                      </div>
                    )}

                    <div className="p-5 flex-1 space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                          <span>{work.date}</span>
                          <span className="font-semibold text-slate-600">{work.authorClass}</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 mt-1 leading-snug group-hover:text-purple-900 transition-colors line-clamp-2">
                          {work.title}
                        </h4>

                        <p className="text-xs text-slate-500 mt-1 font-semibold">
                          Oleh: <strong className="text-slate-800">{work.author}</strong>
                        </p>

                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                          "{work.excerpt}"
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedWork(work)}
                        className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-200 mt-3"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Baca Karya Lengkap</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. SUB-MENU: ORGANISASI SISWA (OSIS) & MPK */}
        {activeSubTab === 'osis' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded">
                  Kepemimpinan Siswa Berintegritas
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Organisasi Siswa Intra Sekolah (OSIS) & MPK
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Kawah candradimuka kepemimpinan kristiani, demokrasi pemilu ketua OSIS digital, dan eksekutor kegiatan kesiswaan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Badan Pengurus Harian (BPH)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Terdiri dari Ketua OSIS, Wakil Ketua, Sekretaris, dan Bendahara yang dipilih secara demokratis melalui E-Voting seluruh siswa tiap tahun ajaran baru.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">8 Seksi Bidang (Sekbid)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Mencakup Sekbid Rohani Katolik, Sekbid Kebangsaan & Bela Negara, Sekbid Kepribadian & Budi Pekerti, Sekbid Olahraga, Sekbid Seni Budaya Manggarai, dan Sekbid IT/Jurnalistik.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Majelis Perwakilan Kelas (MPK)</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lembaga legislatif siswa yang bertugas mengawasi kinerja OSIS, menampung aspirasi perwakilan kelas X, XI, dan XII demi pemajuan sekolah.
                  </p>
                </div>
              </div>

              {/* Action photo */}
              <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                    Program Unggulan Tahunan
                  </span>
                  <h3 className="text-xl font-bold font-serif">Setia Bakti Cup & Festival Budaya Manggarai</h3>
                  <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                    Ajang kompetisi olahraga antar-SMA se-Manggarai Raya dan pentas tari seni tradisi yang sepenuhnya diorganisir oleh OSIS di bawah bimbingan Pembina Kesiswaan.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('galeri', 'galeri');
                    }}
                    className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-colors cursor-pointer shadow"
                  >
                    Lihat Dokumentasi Kegiatan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SUB-MENU: FASILITAS & ASRAMA PUTRA/PUTRI */}
        {activeSubTab === 'asrama' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
                  Rumah Kedua di Kota Ruteng
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Asrama Siswa Putra (St. Yosef) & Putri (St. Maria)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Hunian asrama bernuansa kekeluargaan kristiani di lingkungan sejuk Manggarai dengan pendampingan langsung oleh suster dan frater.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Asrama Putra */}
                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-4 p-6">
                  <img
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=700&q=80"
                    alt="Asrama Putra St. Yosef"
                    className="w-full h-48 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                      Kapasitas 120 Siswa
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Asrama Putra St. Yosef</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Menanamkan kedisiplinan hidup mandiri, kerja bakti lingkungan, olahraga sore, serta doa rosario dan ibadat malam bersama.
                    </p>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kamar tidur berpenghangat alami hawa sejuk Ruteng
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ruang belajar bersama dilengkapi WiFi terfilter edukasi
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Katering 3 kali sehari dengan menu gizi seimbang
                    </li>
                  </ul>
                </div>

                {/* Asrama Putri */}
                <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm space-y-4 p-6">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                    alt="Asrama Putri St. Maria"
                    className="w-full h-48 object-cover rounded-xl"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-900 px-2 py-0.5 rounded">
                      Kapasitas 140 Siswi
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">Asrama Putri St. Maria</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Diasuh oleh para suster dengan fokus pada ketelitian studi, kehalusan budi pekerti, keteraturan harian, dan solidaritas persaudari.
                    </p>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-200">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pengawasan ketat keamanan 24 jam dengan CCTV
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kapela hening khusus untuk doa pribadi dan ekaristi mingguan
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Pelatihan keterampilan menjahit, memasak, dan vokal paduan suara
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SUB-MENU: GALERI FOTO & DOKUMENTASI KEGIATAN */}
        {activeSubTab === 'galeri' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded">
                  Dokumentasi Momen Emas
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Galeri Foto Kegiatan Siswa & Civitas Akademika
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Potret kilas balik misa perayaan, panggung seni budaya, lomba sains olimpiade, dan pembinaan karakter.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    title: 'Misa Syukur Dies Natalis & Hari Guru',
                    category: 'Spiritualitas',
                    img: 'https://images.unsplash.com/photo-1548625361-1960246a47a1?auto=format&fit=crop&w=700&q=80',
                  },
                  {
                    title: 'Pentas Tari Caci & Seni Tradisi Manggarai',
                    category: 'Seni Budaya',
                    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80',
                  },
                  {
                    title: 'Praktikum Uji DNA & Bioteknologi Siswa MIPA',
                    category: 'Akademik Sains',
                    img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80',
                  },
                  {
                    title: 'Juara 1 Turnamen Basket Antar Pelajar NTT',
                    category: 'Olahraga',
                    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=700&q=80',
                  },
                  {
                    title: 'Retret & Rekoleksi Rohani Siswa Kelas XII',
                    category: 'Pembinaan Moral',
                    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=80',
                  },
                  {
                    title: 'Paduan Suara Gita Bakti di Panggung Nasional',
                    category: 'Prestasi Musik',
                    img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=80',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 group hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 w-full overflow-hidden relative">
                      <img
                        src={item.img}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL BACA KARYA SISWA */}
        {selectedWork && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col animate-scaleUp">
              <div className="p-5 bg-gradient-to-r from-[#2e1452] to-[#432874] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                    {selectedWork.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold mt-1 font-serif">{selectedWork.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{selectedWork.author}</p>
                    <p className="text-slate-500">Kelas {selectedWork.authorClass} • SMAK Setia Bakti Ruteng</p>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{selectedWork.date}</span>
                </div>

                {selectedWork.coverImage && (
                  <div className="h-48 w-full rounded-xl overflow-hidden">
                    <img
                      src={selectedWork.coverImage}
                      alt={selectedWork.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="whitespace-pre-line text-slate-800 font-serif text-sm leading-relaxed p-5 bg-slate-50 rounded-xl border border-slate-200">
                  {selectedWork.content}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Diterbitkan secara resmi oleh Redaksi Portal SMAK Setia Bakti
                </span>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="px-4 py-2 bg-[#3b1d70] hover:bg-[#2e1557] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Tutup Jendela
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
