import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/mockData';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenLogin }) => {
  return (
    <footer className="w-full bg-[#080e1a] text-slate-300 border-t border-slate-800 text-xs">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1 (4 cols on lg): Identity, Motto & Socials */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-amber-400/40 flex items-center justify-center text-amber-400 font-serif font-black text-base shadow">
                ✦
              </div>
              <div>
                <h3 className="font-serif font-bold text-white text-base tracking-tight uppercase leading-tight">
                  SMAK SETIA BAKTI
                </h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                  RUTENG — FLORES — NTT
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SMA Katolik Setia Bakti Ruteng berdedikasi membentuk pribadi unggul yang memadukan
              keutamaan iman Kristiani, kecerdasan sains, dan kearifan budaya Manggarai untuk menjadi
              pemimpin masa depan.
            </p>

            {/* Social Icons matching reference */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#facebook"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Facebook Resmi SMA Katolik Setia Bakti Ruteng');
                }}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="#twitter"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Twitter/X Resmi SMA Katolik Setia Bakti');
                }}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="#instagram"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Instagram Resmi @smaksetiabaktirtg');
                }}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="#youtube"
                onClick={(e) => {
                  e.preventDefault();
                  alert('YouTube Humas SMA Katolik Setia Bakti');
                }}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700/80 hover:border-amber-400 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2 (2 cols on lg): Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('beranda')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Beranda Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('akademik')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Profil & Kurikulum
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ppdb')}
                  className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-bold"
                >
                  Pendaftaran PPDB
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('galeri')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Kehidupan Siswa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guru')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Guru & Pendidik
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('berita')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Warta & Berita
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 (2 cols on lg): Resources */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Sumber Daya
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenLogin}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Portal Login Siswa
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLogin}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Portal Guru & Staf
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('statistik')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Ikatan Alumni (IKASBA)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('statistik')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Dasbor Statistik
                </button>
              </li>
              <li>
                <a
                  href="#perpustakaan"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Layanan E-Library & Perpustakaan Digital SMAK Setia Bakti Ruteng');
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer block"
                >
                  Perpustakaan Daring
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 (2 cols on lg): Admissions */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Akademik & PPDB
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('akademik')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Peminatan MIPA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('akademik')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Peminatan IPS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('akademik')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Bahasa & Budaya
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ppdb')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Beasiswa Pendidikan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('akademik')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Biaya & Syarat Masuk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5 (2 cols on lg): Contact Us */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Kontak Resmi
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                <span className="leading-snug">{SCHOOL_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{SCHOOL_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">{SCHOOL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Sen - Jum: 07:00 - 15:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-slate-800/80 py-6 px-4 bg-[#050912]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 SMA Katolik Setia Bakti Ruteng. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                alert('Kebijakan Privasi & Perlindungan Data Siswa Sesuai UU No. 27/2022 (UU PDP).');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                alert('Syarat & Ketentuan Layanan Portal Resmi SMAK Setia Bakti Ruteng.');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Syarat & Ketentuan
            </a>
            <a
              href="#sitemap"
              onClick={(e) => {
                e.preventDefault();
                alert('Peta Situs Portal SMAK Setia Bakti Ruteng.');
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Peta Situs
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
