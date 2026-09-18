import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  MapPin,
  Tag,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { NewsItem, SchoolEvent } from '../../types';

interface AdminNewsEventsTabProps {
  newsList: NewsItem[];
  eventsList: SchoolEvent[];
  onAddNews: (news: NewsItem) => void;
  onDeleteNews: (id: string) => void;
  onAddEvent: (event: SchoolEvent) => void;
  onDeleteEvent: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminNewsEventsTab: React.FC<AdminNewsEventsTabProps> = ({
  newsList,
  eventsList,
  onAddNews,
  onDeleteNews,
  onAddEvent,
  onDeleteEvent,
  onNavigateToWebsiteTab,
}) => {
  const [subTab, setSubTab] = useState<'news' | 'events'>('news');
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  // New News form state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Prestasi Akademik');
  const [newsAuthor, setNewsAuthor] = useState('Humas SMAK Setia Bakti');
  const [newsReadTime, setNewsReadTime] = useState('3 Menit');
  const [newsImageUrl, setNewsImageUrl] = useState(
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80'
  );
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');

  // New Event form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventMonth, setEventMonth] = useState('SEP');
  const [eventDay, setEventDay] = useState('28');
  const [eventYear, setEventYear] = useState('2026');
  const [eventTime, setEventTime] = useState('08:00 - 12:30 WITA');
  const [eventLocation, setEventLocation] = useState('Aula St. Fransiskus Asisi');
  const [eventCategory, setEventCategory] = useState<'Akademik' | 'Keagamaan' | 'Rapat' | 'Ujian' | 'Kesiswaan'>('Akademik');
  const [eventDescription, setEventDescription] = useState('');

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsExcerpt) {
      alert('Mohon lengkapi judul dan ringkasan berita!');
      return;
    }

    const newArticle: NewsItem = {
      id: `news-${Date.now()}`,
      title: newsTitle,
      category: newsCategory,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: newsReadTime || '3 Menit',
      imageUrl: newsImageUrl,
      excerpt: newsExcerpt,
      content: newsContent || newsExcerpt,
      author: newsAuthor,
    };

    onAddNews(newArticle);
    setShowAddNewsModal(false);
    setNewsTitle('');
    setNewsExcerpt('');
    setNewsContent('');
    alert('Berita baru berhasil diterbitkan dan langsung tayang pada halaman website!');
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle || !eventDescription) {
      alert('Mohon lengkapi judul dan deskripsi agenda acara!');
      return;
    }

    const newEv: SchoolEvent = {
      id: `ev-${Date.now()}`,
      title: eventTitle,
      month: eventMonth.toUpperCase(),
      day: eventDay,
      year: eventYear,
      time: eventTime,
      location: eventLocation,
      category: eventCategory,
      description: eventDescription,
    };

    onAddEvent(newEv);
    setShowAddEventModal(false);
    setEventTitle('');
    setEventDescription('');
    alert('Agenda acara baru berhasil ditambahkan dan langsung tampil di website!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Integration Badge and Website navigation */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
              Terhubung ke Website
            </span>
            <span className="text-xs text-slate-400">• Sinkronisasi Real-Time</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Berita Warta & Agenda Acara Sekolah</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola publikasi berita kegiatan, prestasi, pengumuman, dan agenda akademik yang langsung tampil di Halaman Berita & Beranda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToWebsiteTab && (
            <button
              onClick={() => onNavigateToWebsiteTab('berita')}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#432874] text-xs font-bold rounded-xl border border-purple-200 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat di Halaman Website</span>
            </button>
          )}

          {subTab === 'news' ? (
            <button
              onClick={() => setShowAddNewsModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Berita Baru</span>
            </button>
          ) : (
            <button
              onClick={() => setShowAddEventModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Buat Agenda Acara Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('news')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            subTab === 'news'
              ? 'bg-[#3b1d70] text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Warta Berita Sekolah ({newsList.length})</span>
        </button>

        <button
          onClick={() => setSubTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
            subTab === 'events'
              ? 'bg-[#3b1d70] text-white shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Agenda Acara Sekolah ({eventsList.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: NEWS MANAGEMENT */}
      {subTab === 'news' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {newsList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#3b1d70]/90 text-white backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500">Oleh: {item.author || 'Admin'}</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus berita "${item.title}"?`)) {
                        onDeleteNews(item.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Berita"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: EVENTS MANAGEMENT */}
      {subTab === 'events' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventsList.map((ev) => (
              <div
                key={ev.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-purple-900 text-white flex flex-col items-center justify-center flex-shrink-0 shadow">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                      {ev.month}
                    </span>
                    <span className="text-2xl font-black text-amber-300 leading-none">{ev.day}</span>
                    <span className="text-[9px] text-purple-300">{ev.year}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                        {ev.category}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ev.time}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {ev.location}
                    </p>
                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">{ev.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm(`Hapus agenda "${ev.title}"?`)) {
                      onDeleteEvent(ev.id);
                    }
                  }}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  title="Hapus Agenda Acara"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEWS */}
      {showAddNewsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Publikasi Warta Berita Sekolah Baru</h3>
                <p className="text-xs text-slate-500">
                  Data berita ini akan langsung ditayangkan pada Beranda dan Halaman Berita Website.
                </p>
              </div>
              <button
                onClick={() => setShowAddNewsModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNews} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Berita *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siswa SMAK Setia Bakti Raih Medali Emas Olimpiade Sains Nasional"
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                  >
                    <option value="Prestasi Akademik">Prestasi Akademik</option>
                    <option value="Fasilitas & Inovasi">Fasilitas & Inovasi</option>
                    <option value="Seni & Budaya">Seni & Budaya</option>
                    <option value="Bimbingan Karir">Bimbingan Karir</option>
                    <option value="Keagamaan">Keagamaan & Rohani</option>
                    <option value="Pengumuman">Pengumuman Resmi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penulis</label>
                  <input
                    type="text"
                    value={newsAuthor}
                    onChange={(e) => setNewsAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Baca</label>
                  <input
                    type="text"
                    value={newsReadTime}
                    onChange={(e) => setNewsReadTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL Foto Sampul</label>
                <input
                  type="url"
                  value={newsImageUrl}
                  onChange={(e) => setNewsImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                />
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-slate-400">Preset Foto:</span>
                  {[
                    { label: 'Prestasi Sains', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80' },
                    { label: 'Lab Komputer', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80' },
                    { label: 'Seni Budaya', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80' },
                  ].map((p, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewsImageUrl(p.url)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-900 rounded text-[10px] font-semibold cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Berita (Excerpt) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ringkasan singkat yang menarik minat pembaca pada kartu berita..."
                  value={newsExcerpt}
                  onChange={(e) => setNewsExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Lengkap Berita</label>
                <textarea
                  rows={4}
                  placeholder="Tulis artikel berita secara detail..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Terbitkan Berita ke Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE EVENT */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tambah Agenda Acara Sekolah Baru</h3>
                <p className="text-xs text-slate-500">
                  Agenda ini akan langsung tampil di kalender acara mendatang pada website.
                </p>
              </div>
              <button
                onClick={() => setShowAddEventModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Agenda Acara *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Misa Pembukaan Tahun Ajaran & Retret Rohani Siswa"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bulan</label>
                  <select
                    value={eventMonth}
                    onChange={(e) => setEventMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGT', 'SEP', 'OKT', 'NOV', 'DES'].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    required
                    value={eventDay}
                    onChange={(e) => setEventDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-center"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tahun</label>
                  <input
                    type="number"
                    value={eventYear}
                    onChange={(e) => setEventYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="Contoh: 08:00 - 13:00 WITA"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Keagamaan">Keagamaan</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Rapat">Rapat / Orang Tua</option>
                    <option value="Ujian">Ujian & Asesmen</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lokasi Acara</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Contoh: Aula St. Fransiskus Asisi SMAK Setia Bakti"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Agenda *</label>
                <textarea
                  required
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Uraian singkat mengenai jalannya agenda kegiatan..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Agenda ke Website
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
