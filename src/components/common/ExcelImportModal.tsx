import React, { useState } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Users,
  GraduationCap,
} from 'lucide-react';
import { Student, TeacherStaff } from '../../types';
import {
  parseStudentsFromCSV,
  parseTeachersFromCSV,
  downloadStudentTemplate,
  downloadTeacherTemplate,
} from '../../services/excelTemplate';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'teachers' | 'students';
  onImportTeachers?: (teachers: TeacherStaff[]) => void;
  onImportStudents?: (students: Student[]) => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  type,
  onImportTeachers,
  onImportStudents,
}) => {
  if (!isOpen) return null;

  const [file, setFile] = useState<File | null>(null);
  const [parsedTeachers, setParsedTeachers] = useState<TeacherStaff[]>([]);
  const [parsedStudents, setParsedStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (fileToRead: File) => {
    setError(null);
    setFile(fileToRead);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setError('Berkas kosong atau tidak dapat dibaca.');
          setIsProcessing(false);
          return;
        }

        if (type === 'teachers') {
          const parsed = parseTeachersFromCSV(text);
          if (parsed.length === 0) {
            setError(
              'Format berkas tidak sesuai dengan Template Guru/Pegawai. Pastikan menggunakan Template Excel resmi SMAK Setia Bakti.'
            );
          } else {
            setParsedTeachers(parsed);
          }
        } else {
          const parsed = parseStudentsFromCSV(text);
          if (parsed.length === 0) {
            setError(
              'Format berkas tidak sesuai dengan Template Siswa. Pastikan menggunakan Template Excel resmi SMAK Setia Bakti.'
            );
          } else {
            setParsedStudents(parsed);
          }
        }
      } catch (err: any) {
        setError(`Terjadi kesalahan saat memproses berkas: ${err.message || 'Format tidak valid'}`);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsText(fileToRead);
  };

  const handleConfirmImport = () => {
    if (type === 'teachers' && parsedTeachers.length > 0 && onImportTeachers) {
      onImportTeachers(parsedTeachers);
      alert(`Berhasil mengimpor ${parsedTeachers.length} data Guru & Pegawai ke dalam sistem!`);
      onClose();
    } else if (type === 'students' && parsedStudents.length > 0 && onImportStudents) {
      onImportStudents(parsedStudents);
      alert(`Berhasil mengimpor ${parsedStudents.length} data Siswa ke dalam sistem!`);
      onClose();
    }
  };

  const count = type === 'teachers' ? parsedTeachers.length : parsedStudents.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Impor Data {type === 'teachers' ? 'Guru & Pegawai' : 'Siswa'} dari Excel
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan template resmi untuk mengunggah berkas format .xlsx / .csv
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template info callout */}
        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-indigo-950">Belum punya template Excel?</h4>
            <p className="text-[11px] text-indigo-700">
              Unduh format template resmi yang sudah terkonfigurasi dengan kolom standar sekolah.
            </p>
          </div>
          <button
            type="button"
            onClick={() => (type === 'teachers' ? downloadTeacherTemplate() : downloadStudentTemplate())}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer flex-shrink-0"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Unduh Template</span>
          </button>
        </div>

        {/* Upload Dropzone */}
        <div className="flex-shrink-0">
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-emerald-600 mb-1" />
              <p className="text-xs font-bold text-slate-800">
                {file ? file.name : 'Pilih Berkas CSV / Excel Template'}
              </p>
              <p className="text-[11px] text-slate-400">Klik untuk menjelajah berkas di komputer Anda</p>
            </div>
            <input
              type="file"
              accept=".csv, .txt, .xlsx, .xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 flex-shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Data Preview */}
        {count > 0 && (
          <div className="flex-1 overflow-y-auto space-y-3 min-h-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Terdeteksi {count} baris data siap diimpor:
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0">
                  <tr>
                    <th className="p-2.5">No</th>
                    <th className="p-2.5">Nama Lengkap</th>
                    <th className="p-2.5">{type === 'teachers' ? 'Mata Pelajaran' : 'Kelas'}</th>
                    <th className="p-2.5">{type === 'teachers' ? 'Jabatan' : 'NISN'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {type === 'teachers'
                    ? parsedTeachers.slice(0, 10).map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-bold">{t.name}</td>
                          <td className="p-2.5 text-slate-600">{t.subject}</td>
                          <td className="p-2.5 text-slate-600">{t.role}</td>
                        </tr>
                      ))
                    : parsedStudents.slice(0, 10).map((s, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 text-slate-400">{idx + 1}</td>
                          <td className="p-2.5 font-bold">{s.name}</td>
                          <td className="p-2.5 text-slate-600">{s.className}</td>
                          <td className="p-2.5 text-slate-600">{s.nisn}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            {count > 10 && (
              <p className="text-[11px] text-slate-400 italic">...dan {count - 10} data lainnya.</p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={count === 0 || isProcessing}
            onClick={handleConfirmImport}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Impor {count > 0 ? `${count} Data` : ''} Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
