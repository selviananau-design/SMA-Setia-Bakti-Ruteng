import React from 'react';
import {
  FileDown,
  FileSpreadsheet,
  FileText,
  Printer,
  Award,
  Users,
  UserCheck,
} from 'lucide-react';
import { Student, TeacherStaff, PPDBRegistration } from '../../types';
import { exportStudentReportPDF, exportTeacherDirectoryPDF } from '../../services/pdfExport';
import { downloadStudentTemplate, downloadTeacherTemplate, exportStudentsToCSV } from '../../services/excelTemplate';

interface AdminReportsTabProps {
  students: Student[];
  teachers: TeacherStaff[];
  ppdbList: PPDBRegistration[];
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  students,
  teachers,
  ppdbList,
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h2 className="text-2xl font-black text-slate-900">Pusat Laporan Unduhan PDF & Template Excel</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Unduh berkas laporan akademik berstandar kearsipan resmi yayasan persekolahan YAPERPATER dan template spreadsheet.
        </p>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Laporan Data Siswa PDF */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileDown className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Laporan Rapor & Data Siswa (PDF)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dokumen rekapitulasi nilai capaian akademik siswa, NISN, status SPP, dan daftar kelulusan berstempel resmi.
            </p>
          </div>
          <button
            onClick={() => exportStudentReportPDF(students, 'semua')}
            className="w-full py-2.5 bg-[#432874] hover:bg-[#321759] text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Unduh Laporan PDF Siswa</span>
          </button>
        </div>

        {/* 2. Direktori Guru & Pegawai PDF */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Buku Induk Guru & Pegawai (PDF)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Daftar biodata resmi seluruh dewan guru, jabatan struktural yayasan, NIP, NUPTK, dan riwayat pendidikan.
            </p>
          </div>
          <button
            onClick={() => exportTeacherDirectoryPDF(teachers)}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Unduh Buku Induk Guru</span>
          </button>
        </div>

        {/* 3. Ekspor Spreadsheet CSV Siswa */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Ekspor Data Siswa (CSV/Excel)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Berkas data terstruktur format Microsoft Excel/CSV berisi seluruh record {students.length} siswa aktif dan alumni.
            </p>
          </div>
          <button
            onClick={() => exportStudentsToCSV(students, 'semua')}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor File CSV Siswa</span>
          </button>
        </div>

        {/* 4. Template Excel Data Siswa Baru */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Template Impor Data Siswa</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format baku kolom Excel untuk mempermudah input massal data siswa baru oleh staf tata usaha sekolah.
            </p>
          </div>
          <button
            onClick={downloadStudentTemplate}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh Template Siswa (.xlsx)</span>
          </button>
        </div>

        {/* 5. Template Excel Data Guru & Staf */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Template Impor Data Guru/Staf</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Format baku kolom Excel untuk pendataan NIP, NUPTK, mapel, dan jabatan dewan pengajar baru.
            </p>
          </div>
          <button
            onClick={downloadTeacherTemplate}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Unduh Template Guru (.xlsx)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
