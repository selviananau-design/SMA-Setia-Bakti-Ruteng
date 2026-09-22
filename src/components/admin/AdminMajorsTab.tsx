import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Edit2, CheckCircle2, GraduationCap, Award, Users } from 'lucide-react';
import { MajorProgram } from '../../types';

interface AdminMajorsTabProps {
  majors: MajorProgram[];
  onAddMajor: (major: MajorProgram) => void;
  onUpdateMajor?: (major: MajorProgram) => void;
  onDeleteMajor: (id: string) => void;
  onNavigateToWebsiteTab?: (tab: string) => void;
}

export const AdminMajorsTab: React.FC<AdminMajorsTabProps> = ({
  majors,
  onAddMajor,
  onUpdateMajor,
  onDeleteMajor,
  onNavigateToWebsiteTab,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMajor, setEditingMajor] = useState<MajorProgram | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState<'MIPA' | 'IPS' | 'BAHASA' | 'LAINNYA'>('MIPA');
  const [head, setHead] = useState('');
  const [desc, setDesc] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [careers, setCareers] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newMajor: MajorProgram = {
      id: `jur-${Date.now()}`,
      name,
      code,
      headOfDepartment: head || 'Ketua Peminatan',
      description: desc || 'Peminatan keilmuan Kurikulum Merdeka SMAK Setia Bakti.',
      totalStudents: 150,
      curriculumHighlights: curriculum ? curriculum.split(',').map((c) => c.trim()) : ['Praktikum Riset', 'Proyek Profil Pelajar'],
      careerProspects: careers ? careers.split(',').map((c) => c.trim()) : ['Perguruan Tinggi Negeri', 'Kedinasan', 'Profesional'],
    };

    onAddMajor(newMajor);
    setName('');
    setHead('');
    setDesc('');
    setCurriculum('');
    setCareers('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 tracking-wider">
            Kurikulum & Jurusan
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span>Kelola Jurusan & Program Peminatan</span>
          </h2>
          <p className="text-xs text-slate-500">
            Admin Utama dapat menambah atau menyunting program peminatan akademik bagi siswa.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jurusan / Peminatan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {majors.map((m) => (
          <div
            key={m.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-indigo-300 transition-colors"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                    m.code === 'MIPA'
                      ? 'bg-purple-100 text-purple-900'
                      : m.code === 'IPS'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  Kode: {m.code}
                </span>

                <button
                  onClick={() => {
                    if (window.confirm(`Hapus jurusan ${m.name}?`)) onDeleteMajor(m.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                  title="Hapus Jurusan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{m.name}</h3>
              <p className="text-xs text-slate-500">
                Ketua Peminatan: <strong className="text-slate-800">{m.headOfDepartment}</strong>
              </p>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {m.description}
              </p>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Keunggulan Kurikulum:
                </span>
                <div className="flex flex-wrap gap-1">
                  {m.curriculumHighlights.map((ch, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                      • {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Prospek Karir & Kuliah:
                </span>
                <div className="flex flex-wrap gap-1">
                  {m.careerProspects.map((cp, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                      ✓ {cp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Siswa Terdaftar:</span>
              <span className="font-bold text-slate-900 font-mono">{m.totalStudents} Siswa</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Major */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-indigo-900 text-white p-4 flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>Tambah Program Peminatan / Jurusan</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/80 hover:text-white p-1">
                ✕
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap Jurusan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Peminatan Rekayasa Teknologi & Vokasi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Peminatan</label>
                  <select
                    value={code}
                    onChange={(e) => setCode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="MIPA">MIPA</option>
                    <option value="IPS">IPS</option>
                    <option value="BAHASA">BAHASA</option>
                    <option value="LAINNYA">LAINNYA</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ketua Peminatan</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Guru Penanggung Jawab"
                    value={head}
                    onChange={(e) => setHead(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deskripsi Peminatan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Uraikan fokus keilmuan dan kompetensi yang dipelajari siswa..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keunggulan Kurikulum (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Robotika, Laboratorium Bioteknologi, Praktikum Sains..."
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Prospek Karir & Kuliah (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Kedokteran, Teknik Informatika, Farmasi, Peneliti..."
                  value={careers}
                  onChange={(e) => setCareers(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-bold shadow"
                >
                  Simpan Jurusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
