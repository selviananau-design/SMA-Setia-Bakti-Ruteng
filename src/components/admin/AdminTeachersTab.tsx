import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
  FileSpreadsheet,
  FileDown,
  Upload,
} from 'lucide-react';
import { TeacherStaff } from '../../types';
import { ImageUploadField } from '../common/ImageUploadField';
import {
  exportTeachersToExcelTemplate,
  downloadTeacherTemplate,
} from '../../services/excelTemplate';
import { ExcelImportModal } from '../common/ExcelImportModal';

interface AdminTeachersTabProps {
  teachers: TeacherStaff[];
  onAddTeacher: (teacher: TeacherStaff) => void;
  onUpdateTeacher?: (teacher: TeacherStaff) => void;
  onDeleteTeacher: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminTeachersTab: React.FC<AdminTeachersTabProps> = ({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onNavigateToWebsiteTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherStaff | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

  // New teacher form state
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [nuptk, setNuptk] = useState('');
  const [role, setRole] = useState<TeacherStaff['role']>('Guru Tetap');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState<TeacherStaff['department']>('MIPA');
  const [education, setEducation] = useState('S1 Pendidikan');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80'
  );
  const [bio, setBio] = useState('');

  const handleCreateTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject) {
      alert('Mohon isi nama lengkap dan mata pelajaran / bidang tugas!');
      return;
    }

    const newTeacher: TeacherStaff = {
      id: `t-${Date.now()}`,
      name,
      nip: nip || '198501012010011005',
      nuptk: nuptk || '1234567890123456',
      role,
      subject,
      department,
      education: education || 'S1 Pendidikan',
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@smaksetiabakti.sch.id`,
      phone: phone || '081234567890',
      photoUrl,
      bio: bio || `Pendidik berdedikasi di bidang ${subject} dengan komitmen mengabdi bagi kemajuan peserta didik SMAK Setia Bakti Ruteng.`,
    };

    onAddTeacher(newTeacher);
    setShowAddModal(false);
    setName('');
    setSubject('');
    setBio('');
    alert(`Data guru ${name} berhasil disimpan dan langsung tampil di halaman Profil Guru Website!`);
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesDept = selectedDept === 'Semua' || t.department === selectedDept;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.includes(searchQuery);
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with integration status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
              Direktori Website
            </span>
            <span className="text-xs text-slate-400">• Tampil di Profil Guru & Pegawai</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Profil Guru & Tenaga Kependidikan</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Input profil tenaga pengajar, NIP, NUPTK, mata pelajaran yang diampu, dan gelar akademik.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => exportTeachersToExcelTemplate(teachers)}
            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Ekspor Seluruh Data Guru & Pegawai ke Excel (Format Template Resmi)"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor ke Excel</span>
          </button>

          <button
            type="button"
            onClick={downloadTeacherTemplate}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Unduh Format Template Excel Kosong untuk Guru/Pegawai"
          >
            <FileDown className="w-4 h-4 text-indigo-600" />
            <span>Template Excel</span>
          </button>

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-bold rounded-xl border border-indigo-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Impor Data Guru dari Template Excel / CSV"
          >
            <Upload className="w-4 h-4 text-indigo-600" />
            <span>Impor dari Excel</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Guru / Pegawai</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, mata pelajaran, atau NIP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['Semua', 'MIPA', 'IPS & Bahasa', 'Agama & Budi Pekerti', 'Kesiswaan & BK', 'Tata Usaha'].map(
            (dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedDept === dept
                    ? 'bg-[#3b1d70] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {dept}
              </button>
            )
          )}
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeachers.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 text-purple-800">
                    {t.department}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{t.name}</h3>
                  <p className="text-xs font-semibold text-purple-700 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {t.subject}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Jabatan:</span>
                  <span className="font-semibold text-slate-800">{t.role}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">NIP:</span>
                  <span className="font-mono text-slate-700">{t.nip}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pendidikan:</span>
                  <span className="font-semibold text-slate-800">{t.education}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed italic">
                "{t.bio}"
              </p>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[200px]">{t.email}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setEditingTeacher({ ...t })}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  title="Edit Data Guru"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Hapus data pendidik "${t.name}"?`)) {
                      onDeleteTeacher(t.id);
                    }
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus Guru"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: TAMBAH GURU BARU */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Tambah Profil Pendidik / Pegawai Baru</h3>
                <p className="text-xs text-slate-500">
                  Data ini akan langsung ditampilkan di direktori Profil Guru pada Website.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dra. Maria Yosefina, M.Pd."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan di Sekolah</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as TeacherStaff['role'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                  >
                    <option value="Kepala Sekolah">Kepala Sekolah</option>
                    <option value="Wakil Kepala Sekolah">Wakil Kepala Sekolah</option>
                    <option value="Guru Tetap">Guru Tetap</option>
                    <option value="Guru BK">Guru BK</option>
                    <option value="Staf Tata Usaha">Staf Tata Usaha</option>
                    <option value="Laboran/Pustakawan">Laboran/Pustakawan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran / Tugas Utama *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Fisika & Sains Terapan"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departemen / Rumpun</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as TeacherStaff['department'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white font-medium"
                  >
                    <option value="MIPA">Rumpun MIPA</option>
                    <option value="IPS & Bahasa">Rumpun IPS & Bahasa</option>
                    <option value="Agama & Budi Pekerti">Agama & Budi Pekerti</option>
                    <option value="Kesiswaan & BK">Kesiswaan & BK</option>
                    <option value="Tata Usaha">Tata Usaha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    placeholder="198001012005011002"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pendidikan Terakhir</label>
                  <input
                    type="text"
                    placeholder="Contoh: S2 Magister Pendidikan Fisika"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Unggah Pas Foto Profil Guru / Pegawai (Choose File)"
                value={photoUrl}
                onChange={(dataUrl) => setPhotoUrl(dataUrl)}
                helperText="Pilih berkas foto resmi/formal dari perangkat (JPG, PNG, WEBP). Bukan berupa link URL."
                aspectRatio="square"
                placeholderText="Klik atau seret pas foto dari perangkat ke sini"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bio / Dedikasi Pendidik</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Kesan, pesan, atau filosofi mendidik..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Profil Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT GURU */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  <span>Edit Profil Pendidik / Pegawai</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Perbarui profil resmi pendidik: <strong className="text-slate-800">{editingTeacher.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setEditingTeacher(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateTeacher) {
                  onUpdateTeacher(editingTeacher);
                } else {
                  onDeleteTeacher(editingTeacher.id);
                  onAddTeacher(editingTeacher);
                }
                alert(`Data guru "${editingTeacher.name}" berhasil diperbarui!`);
                setEditingTeacher(null);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan / Role *</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.role}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    type="text"
                    value={editingTeacher.nip}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, nip: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">NUPTK</label>
                  <input
                    type="text"
                    value={editingTeacher.nuptk || ''}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, nuptk: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran yang Diampu *</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kelompok Mapel / Departemen *</label>
                  <select
                    value={editingTeacher.department}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="MIPA">MIPA</option>
                    <option value="IPS">IPS</option>
                    <option value="Bahasa">Bahasa</option>
                    <option value="Agama & Karakter">Agama & Karakter</option>
                    <option value="Umum / BK">Umum / BK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pendidikan Terakhir *</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.education}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, education: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Resmi</label>
                  <input
                    type="email"
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. WhatsApp / HP</label>
                <input
                  type="text"
                  value={editingTeacher.phone || ''}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, phone: e.target.value })}
                  placeholder="08..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              {/* Unggah / URL Foto Guru */}
              <ImageUploadField
                label="Foto Profil Guru (Upload dari Komputer atau Tempel URL Web)"
                value={editingTeacher.photoUrl}
                onChange={(newUrl) => setEditingTeacher({ ...editingTeacher, photoUrl: newUrl })}
                placeholder="Pilih file gambar atau tempel URL foto"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kutipan / Profil Singkat</label>
                <textarea
                  rows={3}
                  value={editingTeacher.bio}
                  onChange={(e) => setEditingTeacher({ ...editingTeacher, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Simpan Perubahan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Impor Excel Guru */}
      {showImportModal && (
        <ExcelImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="teachers"
          onImportTeachers={(importedList) => {
            importedList.forEach((t) => onAddTeacher(t));
          }}
        />
      )}
    </div>
  );
};
