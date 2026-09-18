import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  GraduationCap,
  Heart,
  Globe,
  Facebook,
  Instagram,
  Youtube,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <footer className="w-full bg-[#27104a] text-purple-100 border-t-4 border-amber-400">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-900 border border-purple-400/40 flex items-center justify-center font-serif text-amber-300 font-extrabold text-xl shadow">
                SB
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base leading-tight">
                  SMA KATOLIK SETIA BAKTI
                </h3>
                <p className="text-xs text-amber-300 font-semibold tracking-wider uppercase">
                  Ruteng - Flores - NTT
                </p>
              </div>
            </div>

            <p className="text-xs text-purple-200 leading-relaxed">
              Lembaga pendidikan menengah Katolik unggulan di bawah naungan Yayasan Sukma Keuskupan Ruteng.
              Membentuk generasi cerdas, berbudi pekerti luhur, berkarakter kristiani, dan berdaya saing global.
            </p>

            <div className="flex items-center gap-2 text-xs">
              <span className="bg-purple-900/80 px-2 py-1 rounded text-amber-300 font-mono font-bold">
                NPSN: 50302821
              </span>
              <span className="bg-emerald-900/60 px-2 py-1 rounded text-emerald-300 font-bold">
                Akreditasi A Unggul
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-purple-800 pb-2">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Beranda Portal Sekolah
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('statistik')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Dasbor Statistik Siswa & Alumni
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guru')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Profil Guru & Tenaga Pendidik
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ppdb')}
                  className="hover:text-amber-300 transition-colors cursor-pointer font-bold text-amber-300"
                >
                  Pendaftaran PPDB Daring 2026/2027
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('galeri')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Galeri Foto & Video Siswa
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-purple-300 underline"
                >
                  Sistem Login Guru & Orang Tua
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-purple-800 pb-2">
              Kontak & Alamat
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-purple-200">
                  Jl. Pelita No. 7, Watu, Kec. Langke Rembong, Kabupaten Manggarai, Nusa Tenggara Timur 86511
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-purple-200">(0385) 21543 / 0812-3456-7890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-purple-200">info@smaksetiabakti.sch.id</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="#facebook"
                aria-label="Facebook SMAK Setia Bakti"
                className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center hover:bg-amber-400 hover:text-purple-950 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram SMAK Setia Bakti"
                className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center hover:bg-amber-400 hover:text-purple-950 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#youtube"
                aria-label="YouTube SMAK Setia Bakti"
                className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center hover:bg-amber-400 hover:text-purple-950 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 4: Privacy & Encryption */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-purple-800 pb-2">
              Keamanan Data & Privasi
            </h4>
            <div className="p-3 bg-purple-950/60 rounded-xl border border-purple-800/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold">Enkripsi AES-256 Aktif</span>
              </div>
              <p className="text-[11px] text-purple-200 leading-relaxed">
                Seluruh data identitas siswa (NIK/NISN), rekam jejak akademik, dan kontak wali murid dilindungi
                berdasarkan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1b0a33] py-4 text-center text-xs text-purple-300 border-t border-purple-900/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} SMA Katolik Setia Bakti Ruteng. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            <span>Fides, Scientia, et Fraternitas</span>
            <span>•</span>
            <span className="text-amber-400 font-semibold">Beriman, Berilmu, dan Bersaudara</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
