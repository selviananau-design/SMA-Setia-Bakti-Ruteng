import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  Feather,
  Camera,
  Calendar,
  Eye,
  CheckCircle2,
  Users,
  Search,
  Layers,
} from 'lucide-react';
import { Extracurricular, StudentWork } from '../../types';

interface AdminCampusLifeTabProps {
  extracurriculars: Extracurricular[];
  studentWorks: StudentWork[];
  onAddExtracurricular: (eskul: Extracurricular) => void;
  onDeleteExtracurricular: (id: string) => void;
  onAddStudentWork: (work: StudentWork) => void;
  onDeleteStudentWork: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminCampusLifeTab: React.FC<AdminCampusLifeTabProps> = ({
  extracurriculars,
  studentWorks,
  onAddExtracurricular,
  onDeleteExtracurricular,
  onAddStudentWork,
  onDeleteStudentWork,
  onNavigateToWebsiteTab,
}) => {
  const [subTab, setSubTab] = useState<'karya' | 'eskul'>('karya');
  const [filterCategory, setFilterCategory] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showEskulModal, setShowEskulModal] = useState(false);
  const [previewWork, setPreviewWork] = useState<StudentWork | null>(null);

  // Form State: Student Work
  const [workTitle, setWorkTitle] = useState('');
  const [workAuthor, setWorkAuthor] = useState('');
  const [workAuthorClass, setWorkAuthorClass] = useState('X-MIPA 1');
  const [workCategory, setWorkCategory] = useState<'Cerita' | 'Puisi' | 'Jurnalistik' | 'Esai' | 'Karya Seni'>('Cerita');
  const [workExcerpt, setWorkExcerpt] = useState('');
  const [workContent, setWorkContent] = useState('');
  const [workCover, setWorkCover] = useState('');

  // Form State: Eskul
  const [eskulName, setEskulName] = useState('');
  const [eskulCategory, setEskulCategory] = useState<'Kesenian' | 'Olahraga' | 'Akademik & Literasi' | 'Kepemimpinan' | 'Kerohanian'>('Akademik & Literasi');
  const [eskulCoach, setEskulCoach] = useState('');
  const [eskulSchedule, setEskulSchedule] = useState('Jumat, 15.00 - 17.00 WITA');
  const [eskulLocation, setEskulLocation] = useState('Lab Komputer / Ruang Redaksi');
  const [eskulDesc, setEskulDesc] = useState('');
  const [eskulMembers, setEskulMembers] = useState(30);

  const handleAddWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workTitle.trim() || !workAuthor.trim()) return;

    const newWork: StudentWork = {
      id: `work-${Date.now()}`,
      title: workTitle.trim(),
      type: (workCategory as any) || 'Cerita',
      category: workCategory,
      studentName: workAuthor.trim(),
      author: workAuthor.trim(),
      studentClass: workAuthorClass,
      authorClass: workAuthorClass,
      publishDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      excerpt: workExcerpt.trim() || workContent.slice(0, 120) + '...',
      content: workContent.trim(),
      coverImage: workCover.trim() || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
      likes: 1,
      reads: 10,
      commentsCount: 0,
      status: 'Terbit',
    };

    onAddStudentWork(newWork);
    setWorkTitle('');
    setWorkAuthor('');
    setWorkExcerpt('');
    setWorkContent('');
    setWorkCover('');
    setShowWorkModal(false);
  };

  const handleAddEskul = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eskulName.trim()) return;

    const newEskul: Extracurricular = {
      id: `eskul-${Date.now()}`,
      name: eskulName.trim(),
      category: eskulCategory,
      coach: eskulCoach.trim() || 'Guru Pembina',
      schedule: eskulSchedule,
      location: eskulLocation,
      description: eskulDesc.trim() || 'Wadah pembinaan minat dan bakat siswa SMAK Setia Bakti.',
      membersCount: Number(eskulMembers) || 25,
      achievements: ['Peserta Aktif Tingkat Kabupaten', 'Pekan Budaya & Seni'],
      icon: 'Feather',
    };

    onAddExtracurricular(newEskul);
    setEskulName('');
    setEskulCoach('');
    setEskulDesc('');
    setShowEskulModal(false);
  };

  const filteredWorks = studentWorks.filter((w) => {
    const cat = w.category || w.type || '';
    const author = w.author || w.studentName || '';
    const matchCat = filterCategory === 'semua' || cat === filterCategory;
    const matchSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-amber-100 text-amber-900 tracking-wider">
            Kehidupan Siswa & Ekstrakurikuler
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Kelola Ekskul & Karya Siswa (Cerita, Puisi, Jurnalistik)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Unggah dan publikasikan karya sastra, liputan jurnalistik, serta ragam kegiatan eskul siswa Setia Bakti.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'karya' ? (
            <button
              onClick={() => setShowWorkModal(true)}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Karya Siswa Baru</span>
            </button>
          ) : (
            <button
              onClick={() => setShowEskulModal(true)}
              className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow cursor-pointer transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Ekstrakurikuler</span>
            </button>
          )}
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('karya')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'karya'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Feather className="w-4 h-4" />
          <span>Karya Siswa (Cerita, Puisi, Jurnalistik)</span>
          <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-mono">
            {studentWorks.length}
          </span>
        </button>

        <button
          onClick={() => setSubTab('eskul')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'eskul'
              ? 'bg-blue-700 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Daftar Kegiatan Ekstrakurikuler</span>
          <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-mono">
            {extracurriculars.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: KARYA SISWA */}
      {/* ========================================================= */}
      {subTab === 'karya' && (
        <div className="space-y-4">
          {/* Filter ribbon */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-semibold mr-1">Kategori:</span>
              {['semua', 'Cerita', 'Puisi', 'Jurnalistik', 'Esai'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari judul atau pengarang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Cards Grid of Works */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorks.map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-colors"
              >
                {work.coverImage && (
                  <div className="h-40 w-full overflow-hidden relative">
                    <img
                      src={work.coverImage}
                      alt={work.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#211142]/80 backdrop-blur-sm text-amber-300">
                      {work.category}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{work.date}</span>
                    <span className="font-semibold text-slate-600">{work.authorClass}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {work.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-semibold">
                    Karya: <strong className="text-purple-950">{work.author}</strong>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                    "{work.excerpt}"
                  </p>
                </div>

                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewWork(work)}
                    className="text-purple-700 hover:text-purple-950 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Baca Karya</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus karya "${work.title}" karya ${work.author}?`)) {
                        onDeleteStudentWork(work.id);
                      }
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                    title="Hapus Karya"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWorks.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs">
              Tidak ada karya siswa yang cocok dengan filter. Klik "Upload Karya Siswa Baru" untuk menambahkan karya baru.
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: EKSTRAKURIKULER */}
      {/* ========================================================= */}
      {subTab === 'eskul' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {extracurriculars.map((eskul) => (
            <div
              key={eskul.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    {eskul.category}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Hapus eskul ${eskul.name}?`)) onDeleteExtracurricular(eskul.id);
                    }}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900">{eskul.name}</h3>
                <p className="text-xs text-slate-500">
                  Pembina: <strong className="text-slate-800">{eskul.coach}</strong>
                </p>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {eskul.description}
                </p>

                <div className="space-y-1 text-xs text-slate-600">
                  <p>
                    <strong>Jadwal:</strong> {eskul.schedule}
                  </p>
                  <p>
                    <strong>Lokasi:</strong> {eskul.location}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Prestasi & Rekam Jejak:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {eskul.achievements.map((ach: string, idx: number) => (
                      <span key={idx} className="bg-amber-50 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded">
                        ★ {ach}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Anggota Aktif:</span>
                <span className="font-bold text-blue-800 font-mono">{eskul.membersCount} Siswa</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: UPLOAD KARYA SISWA */}
      {showWorkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-[#211142] text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Feather className="w-4 h-4 text-amber-400" />
                <span>Upload Karya Sastra / Jurnalistik Siswa</span>
              </h3>
              <button onClick={() => setShowWorkModal(false)} className="text-white/80 hover:text-white p-1">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddWork} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Judul Karya</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Senja di Pelataran Golo Curu / Wawancara Khusus..."
                  value={workTitle}
                  onChange={(e) => setWorkTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Siswa / Pengarang</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap Siswa"
                    value={workAuthor}
                    onChange={(e) => setWorkAuthor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas Siswa</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: X-MIPA 1 / XI-IPS 2"
                    value={workAuthorClass}
                    onChange={(e) => setWorkAuthorClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori Karya</label>
                  <select
                    value={workCategory}
                    onChange={(e) => setWorkCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Cerita">Cerita / Cerpen</option>
                    <option value="Puisi">Puisi / Sajak</option>
                    <option value="Jurnalistik">Liputan Jurnalistik</option>
                    <option value="Esai">Esai Opini / Resensi</option>
                    <option value="Karya Seni">Karya Seni / Lukisan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Foto Sampul (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={workCover}
                    onChange={(e) => setWorkCover(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kutipan Menarik (Excerpt)</label>
                <input
                  type="text"
                  placeholder="Kutipan 1-2 kalimat pemikat pembaca..."
                  value={workExcerpt}
                  onChange={(e) => setWorkExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Isi Lengkap Karya Siswa</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Ketik atau tempelkan teks lengkap cerita, bait puisi, atau liputan jurnalistik di sini..."
                  value={workContent}
                  onChange={(e) => setWorkContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowWorkModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold shadow"
                >
                  Publikasikan Karya Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH EKSTRAKURIKULER */}
      {showEskulModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-blue-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-300" />
                <span>Tambah Ekstrakurikuler Baru</span>
              </h3>
              <button onClick={() => setShowEskulModal(false)} className="text-white/80 hover:text-white p-1">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddEskul} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Ekstrakurikuler</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Jurnalistik Gema Setia Bakti / Teater Remaja"
                  value={eskulName}
                  onChange={(e) => setEskulName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={eskulCategory}
                    onChange={(e) => setEskulCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Akademik & Literasi">Akademik & Literasi</option>
                    <option value="Kesenian">Kesenian & Budaya</option>
                    <option value="Olahraga">Olahraga & Bela Diri</option>
                    <option value="Kepemimpinan">Kepemimpinan & Organisasi</option>
                    <option value="Kerohanian">Kerohanian Katolik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Guru Pembina</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Pembina"
                    value={eskulCoach}
                    onChange={(e) => setEskulCoach(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jadwal Latihan</label>
                  <input
                    type="text"
                    value={eskulSchedule}
                    onChange={(e) => setEskulSchedule(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lokasi Latihan</label>
                  <input
                    type="text"
                    value={eskulLocation}
                    onChange={(e) => setEskulLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Kegiatan Eskul</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Uraikan materi pelatihan, target lomba, dan aktivitas rutin..."
                  value={eskulDesc}
                  onChange={(e) => setEskulDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowEskulModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-bold shadow"
                >
                  Simpan Eskul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PREVIEW KARYA SISWA */}
      {previewWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="bg-[#211142] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-300">
                  {previewWork.category} Siswa
                </span>
                <h3 className="text-base font-bold text-white">{previewWork.title}</h3>
              </div>
              <button onClick={() => setPreviewWork(null)} className="text-white/80 hover:text-white p-1">
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{previewWork.author}</p>
                  <p className="text-slate-500">Kelas {previewWork.authorClass}</p>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{previewWork.date}</span>
              </div>

              <div className="whitespace-pre-line text-slate-800 font-serif text-sm leading-relaxed p-4 bg-slate-50 rounded-xl border border-slate-200">
                {previewWork.content}
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewWork(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
