import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Microscope,
  Compass,
  Globe2,
  Palette,
  TrendingUp,
  CheckCircle2,
  Users,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { MajorProgram } from '../types';
import { INITIAL_MAJORS } from '../data/mockData';

interface AcademicProgramsFullPageProps {
  majors?: MajorProgram[];
  initialSubTab?: string;
  initialMajor?: string;
  onNavigateTab?: (tab: string, subTab?: string) => void;
}

export const AcademicProgramsFullPage: React.FC<AcademicProgramsFullPageProps> = ({
  majors = INITIAL_MAJORS,
  initialSubTab = 'mipa',
  initialMajor,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialMajor || initialSubTab || 'mipa');

  useEffect(() => {
    const target = initialMajor || initialSubTab;
    if (target) {
      setActiveSubTab(target);
    }
  }, [initialSubTab, initialMajor]);

  const navTabs = [
    { id: 'mipa', label: 'Peminatan MIPA', icon: Microscope, color: 'text-blue-600' },
    { id: 'ips', label: 'Peminatan IPS', icon: Compass, color: 'text-indigo-600' },
    { id: 'bahasa', label: 'Bahasa & Budaya', icon: Globe2, color: 'text-emerald-600' },
    { id: 'kriya', label: 'Seni Budaya & Kriya', icon: Palette, color: 'text-amber-600' },
    { id: 'semua', label: 'Semua Jurusan & Kurikulum', icon: BookOpen, color: 'text-purple-600' },
  ];

  return (
    <div className="w-full bg-slate-50 min-h-[650px] py-10 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#1e293b] via-[#0f172a] to-[#1e1b4b] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full inline-block border border-amber-400/20">
              Struktur Akademik Unggul
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Jurusan & Program Akademik
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Kurikulum Merdeka berbasis riset sains, kepekaan sosial, kemampuan multibahasa, dan kearifan seni budaya Manggarai.
            </p>
          </div>
        </div>

        {/* Sub-menu Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
          {navTabs.map((tab) => {
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
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.color}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. VIEW: PEMINATAN MIPA (MATEMATIKA & ILMU PENGETAHUAN ALAM) */}
        {activeSubTab === 'mipa' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded">
                    Sains Eksperimental & Teknologi Masa Depan
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                    Program Studi MIPA (Matematika & Ilmu Pengetahuan Alam)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                    Membina pola pikir logis, metodologi penelitian empiris, serta penguasaan fisika, kimia, biologi modern, dan pemrograman dasar.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Siswa MIPA Aktif</span>
                  <span className="text-2xl font-black text-[#005fb8]">318 Siswa</span>
                  <span className="text-[10px] font-semibold text-emerald-600 block">10 Rombel</span>
                </div>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Mata Pelajaran Peminatan & Riset:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Fisika Terapan & Mekanika',
                        desc: 'Eksperimen gerak, termodinamika, gelombang optik, dan astronomi teleskopik.',
                      },
                      {
                        name: 'Kimia Analitik & Organik',
                        desc: 'Studi reaksi larutan, stoikiometri, fermentasi hasil bumi Flores, dan polimer.',
                      },
                      {
                        name: 'Biologi Lingkungan & Genetika',
                        desc: 'Konservasi ekosistem hutan Manggarai, mikrobiologi terapan, dan botani.',
                      },
                      {
                        name: 'Matematika Peminatan & Kalkulus',
                        desc: 'Aljabar linier, trigonometri lanjut, matriks, serta kalkulus diferensial-integral.',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* Career Pathways */}
                  <div className="p-5 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                    <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-700" />
                      Prospek Program Studi di Perguruan Tinggi (PTN/PTS):
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Lulusan MIPA Setia Bakti memiliki rekam jejak tinggi diterima di <strong>Fakultas Kedokteran</strong> (Undana, Udayana, Unair, UI), <strong>Teknik Informatika & Robotika</strong> (ITB, ITS, Binus), <strong>Farmasi & Kebidanan</strong>, <strong>Arsitektur & Teknik Sipil</strong>, serta <strong>Statistika & Sains Data</strong>.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=700&q=80"
                      alt="Laboratorium MIPA SMAK Setia Bakti"
                      className="w-full h-48 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 bg-slate-50 space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">Fasilitas Khusus MIPA:</h4>
                      <ul className="text-[11px] text-slate-600 space-y-1">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Laboratorium Fisika, Kimia, & Biologi Terpisah
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mikroskop Elektron Digital & Sensor Sains
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Bimbingan Khusus Olimpiade Sains Nasional (OSN)
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('ppdb', 'daftar');
                    }}
                    className="w-full py-2.5 bg-[#005fb8] hover:bg-[#004d99] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Daftar Peminatan MIPA via PPDB</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VIEW: PEMINATAN IPS (ILMU PENGETAHUAN SOSIAL) */}
        {activeSubTab === 'ips' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded">
                    Kepemimpinan Sosial, Ekonomi & Hukum
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                    Program Studi IPS (Ilmu Pengetahuan Sosial)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                    Mencetak calon ekonom, sosiolog kritis, diplomat, dan pemimpin daerah yang berjiwa sosial tinggi serta berintegritas moral kristiani.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-indigo-50 p-4 rounded-xl text-center border border-indigo-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Siswa IPS Aktif</span>
                  <span className="text-2xl font-black text-indigo-700">290 Siswa</span>
                  <span className="text-[10px] font-semibold text-emerald-600 block">9 Rombel</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Mata Pelajaran Peminatan & Analisis:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'Sosiologi & Antropologi Flores',
                        desc: 'Studi mendalam interaksi sosial, kearifan sistem "Lodok" Manggarai, dan penyelesaian konflik kemasyarakatan.',
                      },
                      {
                        name: 'Ekonomi Makro-Mikro & Akuntansi',
                        desc: 'Analisis perbankan, koperasi kredit (kopdit), literasi pasar modal, dan pembukuan neraca keuangan.',
                      },
                      {
                        name: 'Geografi Kepulauan & Mitigasi',
                        desc: 'Geomorfologi NTT, sistem informasi geografis (GIS) pemetaan wilayah, dan kelestarian laut sawu.',
                      },
                      {
                        name: 'Sejarah Kritis Nusantara & Dunia',
                        desc: 'Penelusuran arsip sejarah gereja Nusa Tenggara, pergerakan kemerdekaan, dan geopolitik kontemporer.',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-700" />
                      Prospek Karir & Program Studi Lanjutan:
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Lulusan IPS Setia Bakti melanjutkan ke <strong>Fakultas Hukum</strong> (UGM, Undip, Undana), <strong>Manajemen & Bisnis Akuntansi</strong> (Atma Jaya, Sanata Dharma), <strong>Hubungan Internasional & Diplomasi</strong>, <strong>Administrasi Publik / Pemerintahan</strong>, serta <strong>Akademi Militer & Kepolisian (Akmil/Akpol)</strong>.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                      alt="Diskusi Peminatan IPS SMAK Setia Bakti"
                      className="w-full h-48 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 bg-slate-50 space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">Program Unggulan IPS:</h4>
                      <ul className="text-[11px] text-slate-600 space-y-1">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Praktik Kuliah Kerja Nyata / Riset Sosial Desa
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Simulasi Peradilan Semu & Debat Konstitusi
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Inkubator Kewirausahaan Koperasi Siswa
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('ppdb', 'daftar');
                    }}
                    className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Daftar Peminatan IPS via PPDB</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. VIEW: PEMINATAN BAHASA & BUDAYA */}
        {activeSubTab === 'bahasa' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
                    Komunikasi Global & Pelestarian Sastra
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                    Program Studi Bahasa & Budaya Flores
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                    Kombinasi penguasaan Bahasa Inggris aktif, Bahasa Jerman diplomatik, apresiasi sastra Indonesia, serta penuturan sastra lisan Manggarai.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Siswa Bahasa Aktif</span>
                  <span className="text-2xl font-black text-emerald-700">140 Siswa</span>
                  <span className="text-[10px] font-semibold text-emerald-600 block">5 Rombel</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Kurikulum & Kompetensi Inti:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'English for International Communication',
                        desc: 'Debat bahasa Inggris akademis, penulisan esai formal, TOEFL preparation, dan public speaking.',
                      },
                      {
                        name: 'Bahasa Jerman (Deutsch als Fremdsprache)',
                        desc: 'Penguasaan tata bahasa, pelafalan aktif bersertifikat level A1/A2 dari Goethe Institut.',
                      },
                      {
                        name: 'Sastra Indonesia & Penulisan Kreatif',
                        desc: 'Kritik sastra, penulisan puisi, cerpen bermutu, penerbitan majalah dinding, dan antologi karya.',
                      },
                      {
                        name: 'Etnolinguistik & Filologi Flores',
                        desc: 'Dokumentasi sastra lisan Manggarai ("Goet", "Torok"), kearifan pepatah lokal, dan kajian budaya.',
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-700" />
                      Prospek Karir Menjanjikan:
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Sektor pariwisata internasional Flores dan Labuan Bajo sangat mendambakan alumni jurusan Bahasa: <strong>Pemandu Wisata Profesional & Public Relations</strong>, <strong>Penerjemah Bahasa Asing</strong>, <strong>Jurnalis & Penulis Buku</strong>, <strong>Diplomat Kemenlu</strong>, serta <strong>Dosen Sastra & Kebudayaan</strong>.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&q=80"
                      alt="Laboratorium Bahasa SMAK Setia Bakti"
                      className="w-full h-48 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 bg-slate-50 space-y-1">
                      <h4 className="text-xs font-bold text-slate-800">Fasilitas Khusus Bahasa:</h4>
                      <ul className="text-[11px] text-slate-600 space-y-1">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Laboratorium Bahasa Audio-Visual Digital
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> English Club & Debating Society
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Redaksi Majalah Siswa "Gema Setia Bakti"
                        </li>
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigateTab) onNavigateTab('ppdb', 'daftar');
                    }}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>Daftar Peminatan Bahasa via PPDB</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. VIEW: SENI BUDAYA & KRIYA DAERAH */}
        {activeSubTab === 'kriya' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-2.5 py-1 rounded">
                    Muatan Lokal Unggulan & Estetika Tradisi
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
                    Program Seni Budaya & Kriya Daerah Manggarai
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                    Pusat pelestarian dan revitalisasi warisan seni leluhur: Tenun Songke Manggarai, seni musik tradisional Gong & Gendang, seni tari Caci & Tiba Meka, serta kriya ukir bambu.
                  </p>
                </div>
                <div className="flex-shrink-0 bg-amber-50 p-4 rounded-xl text-center border border-amber-200">
                  <span className="text-[10px] uppercase font-bold text-amber-700 block">Siswa Berprestasi Seni</span>
                  <span className="text-2xl font-black text-amber-900">Juara 1 NTT</span>
                  <span className="text-[10px] font-semibold text-emerald-600 block">Pentas Nusantara 2025</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Kriya Tenun Songke Manggarai</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Siswa dilatih memahami filosofi motif Songke (Ranggong, Mata Manuk, Su’i) dan teknik menenun tradisional menggunakan alat tenun bukan mesin (ATBM).
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Seni Musik Tradisional & Paduan Suara</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kombinasi alat musik etnis Manggarai dengan teknik vokal paduan suara klasik (SATB) Gita Bakti yang sering menjuarai kompetisi tingkat provinsi dan nasional.
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Seni Tari & Teater Daerah</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Koreografi tari Tiba Meka (penyambutan tamu), tari Sae, dan fragmen drama bahasa daerah yang dipentaskan pada acara gerejawi dan festival budaya.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. VIEW: SEMUA JURUSAN & KURIKULUM MERDEKA */}
        {activeSubTab === 'semua' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-widest bg-purple-100 px-2.5 py-1 rounded">
                  Perbandingan & Panduan Peminatan
                </span>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                  Matriks Kurikulum Merdeka SMA Katolik Setia Bakti
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Peserta didik dapat memilih mata pelajaran peminatan utama serta 1 mata pelajaran lintas minat sesuai talenta masa depan.
                </p>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3.5">Peminatan</th>
                      <th className="p-3.5">Kode</th>
                      <th className="p-3.5">Kepala Peminatan</th>
                      <th className="p-3.5">Mata Pelajaran Kunci</th>
                      <th className="p-3.5">Fasilitas Praktik</th>
                      <th className="p-3.5 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {majors.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-bold text-slate-900">{m.name}</td>
                        <td className="p-3.5 font-mono text-purple-800 font-bold">{m.code}</td>
                        <td className="p-3.5 font-medium">{m.headOfDepartment}</td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {m.curriculumHighlights.map((h, i) => (
                              <span key={i} className="bg-slate-200/70 text-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                {h}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-600">
                          {m.code === 'MIPA'
                            ? 'Lab Fisika, Kimia, Biologi'
                            : m.code === 'IPS'
                            ? 'Lab Sosial & Galeri Investasi'
                            : 'Lab Bahasa Multimedia'}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setActiveSubTab(m.code.toLowerCase())}
                            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
