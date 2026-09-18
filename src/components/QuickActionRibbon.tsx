import React, { useState } from 'react';
import {
  Trophy,
  Bus,
  UtensilsCrossed,
  CalendarDays,
  FileEdit,
  Briefcase,
  X,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface QuickActionRibbonProps {
  onNavigateTab: (tab: string) => void;
}

export const QuickActionRibbon: React.FC<QuickActionRibbonProps> = ({ onNavigateTab }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const actions = [
    {
      id: 'athletics',
      title: 'Athletics & Ekskul',
      sub: 'Olahraga & Seni',
      icon: Trophy,
      type: 'modal',
    },
    {
      id: 'transport',
      title: 'Asrama & Transport',
      sub: 'Fasilitas Tinggal',
      icon: Bus,
      type: 'modal',
    },
    {
      id: 'lunch',
      title: 'Kantin Sehat',
      sub: 'Menu Bergizi',
      icon: UtensilsCrossed,
      type: 'modal',
    },
    {
      id: 'calendar',
      title: 'Kalender Akademik',
      sub: 'Jadwal 2026/2027',
      icon: CalendarDays,
      type: 'modal',
    },
    {
      id: 'registration',
      title: 'Pendaftaran PPDB',
      sub: 'Daring Diterima',
      icon: FileEdit,
      type: 'tab',
      targetTab: 'ppdb',
    },
    {
      id: 'jobs',
      title: 'Karir & Alumni',
      sub: 'Jejak Lulusan',
      icon: Briefcase,
      type: 'tab',
      targetTab: 'statistik',
    },
  ];

  const handleActionClick = (action: (typeof actions)[0]) => {
    if (action.type === 'tab' && action.targetTab) {
      onNavigateTab(action.targetTab);
    } else {
      setActiveModal(action.id);
    }
  };

  return (
    <>
      {/* 6-Tile Ribbon matching the exact photo */}
      <section className="w-full bg-[#522d8a] text-white py-3 border-y-2 border-purple-950 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-purple-400/20">
            {actions.map((act) => {
              const IconComp = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => handleActionClick(act)}
                  className="py-3 px-2 flex flex-col items-center justify-center text-center group hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {/* Circular Icon Container matching screenshot */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-purple-200/40 flex items-center justify-center mb-1.5 group-hover:scale-110 group-hover:border-amber-300 transition-all bg-purple-900/40 shadow-inner">
                    <IconComp className="w-6 h-6 sm:w-7 sm:h-7 text-purple-100 group-hover:text-amber-300 transition-colors" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold tracking-wide font-sans text-white group-hover:text-amber-300 transition-colors leading-tight">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-purple-200/80 font-medium hidden md:inline-block">
                    {act.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Detail Modal for clicked items */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#432874] text-white px-5 py-4 flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                {activeModal === 'athletics' && <Trophy className="w-5 h-5 text-amber-300" />}
                {activeModal === 'transport' && <Bus className="w-5 h-5 text-amber-300" />}
                {activeModal === 'lunch' && <UtensilsCrossed className="w-5 h-5 text-amber-300" />}
                {activeModal === 'calendar' && <CalendarDays className="w-5 h-5 text-amber-300" />}
                <span>
                  {activeModal === 'athletics' && 'Ekstrakurikuler & Pembinaan Bakat Siswa'}
                  {activeModal === 'transport' && 'Asrama & Fasilitas Transportasi Siswa'}
                  {activeModal === 'lunch' && 'Kantin Sehat & Menu Gizi Seimbang'}
                  {activeModal === 'calendar' && 'Kalender Akademik Semester Ganjil 2026/2027'}
                </span>
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 text-xs sm:text-sm text-slate-700 space-y-3 max-h-[75vh] overflow-y-auto">
              {activeModal === 'athletics' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    SMA Katolik Setia Bakti Ruteng membina lebih dari 14 cabang ekstrakurikuler unggulan
                    yang rutin menjuarai kompetisi tingkat kabupaten, provinsi NTT, dan nasional:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="font-bold text-purple-900">Bidang Olahraga:</p>
                      <ul className="mt-1 space-y-0.5 text-slate-600 list-disc list-inside">
                        <li>Bola Voli Putra & Putri</li>
                        <li>Bola Basket</li>
                        <li>Bulutangkis</li>
                        <li>Atletik & Lari Jarak Menengah</li>
                      </ul>
                    </div>
                    <div className="p-2.5 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="font-bold text-purple-900">Bidang Seni & Budaya:</p>
                      <ul className="mt-1 space-y-0.5 text-slate-600 list-disc list-inside">
                        <li>Paduan Suara Gita Setia Bakti</li>
                        <li>Tari Tradisional Caci & Sasi</li>
                        <li>Band & Orkes Musik Tiup</li>
                        <li>Teater & Sastra Kreatif</li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Jadwal latihan rutin: Setiap Selasa & Jumat pukul 15.30 - 17.30 WITA.</span>
                  </div>
                </div>
              )}

              {activeModal === 'transport' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Menunjang siswa yang berasal dari berbagai pelosok Manggarai Raya, Ngada, Nagekeo, dan
                    luar daerah, sekolah menyediakan:
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="font-bold text-[#432874]">1. Asrama Putra St. Joseph & Asrama Putri St. Maria</p>
                      <p className="text-slate-600 text-xs mt-1">
                        Kapasitas 200 tempat tidur dengan bimbingan rohani harian, jam belajar terpantau,
                        ruang rekreasi, dan makan 3 kali sehari bersertifikasi higienis.
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="font-bold text-[#432874]">2. Bus Antar Jemput Sekolah</p>
                      <p className="text-slate-600 text-xs mt-1">
                        3 armada bus sekolah melayani rute Ruteng - Cancar, Ruteng - Kumba/Watu, dan
                        Ruteng - Karot dengan jadwal tepat waktu.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeModal === 'lunch' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Kantin Sehat SMAK Setia Bakti mengutamakan kebersihan, keamanan pangan bebas pengawet,
                    dan asupan gizi seimbang bagi siswa:
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs space-y-1 text-amber-900">
                    <p className="font-bold">Menu Pilihan Hari Ini (Contoh):</p>
                    <p>• Nasi Beras Merah / Putih + Ikan Kuah Asam Segar + Sayur Bening Kelor Manggarai</p>
                    <p>• Nasi Kuning Komplit Telur Balado + Tempe Orek Organik</p>
                    <p>• Aneka Buah Potong Lokal (Pepaya, Semangka, Pisang Beras)</p>
                    <p>• Air Mineral Higienis & Susu Kedelai Alami</p>
                  </div>
                  <p className="text-xs text-slate-500 italic">
                    Setiap vendor kantin diawasi berkala oleh Dinas Kesehatan Kab. Manggarai.
                  </p>
                </div>
              )}

              {activeModal === 'calendar' && (
                <div className="space-y-3">
                  <p className="leading-relaxed">
                    Agenda Penting Tahun Akademik 2026/2027:
                  </p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 p-2 bg-purple-50 rounded border border-purple-200">
                      <Clock className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-950">20 - 24 Juli 2026:</span>
                        <p className="text-slate-600">Masa Pengenalan Lingkungan Sekolah (MPLS) & Matrikulasi</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-2 bg-purple-50 rounded border border-purple-200">
                      <Clock className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-950">21 - 26 September 2026:</span>
                        <p className="text-slate-600">Asesmen Sumatif Tengah Semester (ASTS) Ganjil</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-2 bg-purple-50 rounded border border-purple-200">
                      <Clock className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-950">01 - 10 Desember 2026:</span>
                        <p className="text-slate-600">Asesmen Sumatif Akhir Semester (ASAS) Ganjil</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 p-2 bg-purple-50 rounded border border-purple-200">
                      <Clock className="w-4 h-4 text-purple-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-purple-950">18 Desember 2026:</span>
                        <p className="text-slate-600">Penerimaan Rapor Semester Ganjil & Libur Natal</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-100 px-5 py-3 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#432874] text-white text-xs font-semibold rounded hover:bg-[#341b5e] transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
