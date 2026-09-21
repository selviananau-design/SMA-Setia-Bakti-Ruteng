import React, { useRef, useState } from 'react';
import { FileText, Upload, CheckCircle2, AlertCircle, FileCheck, Info, Sparkles, Eye } from 'lucide-react';

interface TeacherAdminPdfUploadProps {
  fileName: string;
  fileSize: string;
  bundleComponents: string[];
  onFileSelect: (fileName: string, fileSize: string, fileDataUrl?: string) => void;
  onBundleComponentsChange: (components: string[]) => void;
  onUseSampleBundle?: () => void;
  subjectName?: string;
  classNameStr?: string;
}

export const MANDATORY_BUNDLE_PARTS = [
  { id: 'cp', label: 'Capaian Pembelajaran (CP)', desc: 'Fase & elemen capaian kompetensi dasar' },
  { id: 'atp', label: 'Alur Tujuan Pembelajaran (ATP)', desc: 'Urutan logis alur pencapaian tujuan pembelajaran' },
  { id: 'prota_promes', label: 'Prota & Promes', desc: 'Pemetaan alokasi jam efektif tahunan & semester' },
  { id: 'kktp', label: 'Kriteria Ketercapaian (KKTP)', desc: 'Interval nilai dan rubrik ketercapaian tujuan' },
  { id: 'rpm', label: 'Rencana Pembelajaran Modul (RPM)', desc: 'Modul ajar lengkap per pertemuan KBM' },
  { id: 'asesmen', label: 'Instrumen Asesmen & Evaluasi', desc: 'Asesmen diagnostik, formatif & sumatif' },
];

export const TeacherAdminPdfUpload: React.FC<TeacherAdminPdfUploadProps> = ({
  fileName,
  fileSize,
  bundleComponents,
  onFileSelect,
  onBundleComponentsChange,
  onUseSampleBundle,
  subjectName = 'Mata Pelajaran',
  classNameStr = 'Kelas Binaan',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMsg('Berkas yang diunggah harus dalam format 1 File PDF (.pdf).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('Ukuran berkas PDF terlalu besar (maksimal 25MB).');
      return;
    }

    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
    const formattedSize = file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onFileSelect(file.name, formattedSize, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const toggleComponent = (label: string) => {
    if (bundleComponents.includes(label)) {
      onBundleComponentsChange(bundleComponents.filter((c) => c !== label));
    } else {
      onBundleComponentsChange([...bundleComponents, label]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-4">
      {/* Notice / Instruction Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-sky-900 text-white p-3.5 rounded-xl text-xs space-y-2 shadow-sm border border-indigo-700">
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 bg-white/10 rounded-lg text-sky-300">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-sky-100 flex items-center gap-1.5">
              <span>Instruksi Administrasi Guru (1 File PDF Tunggal)</span>
              <span className="text-[10px] bg-sky-400 text-sky-950 px-2 py-0.5 rounded-full font-extrabold uppercase">
                Kurikulum Merdeka
              </span>
            </p>
            <p className="text-[11px] text-sky-200 leading-relaxed">
              Seluruh perangkat ajar mulai dari <strong>CP (Capaian Pembelajaran)</strong>, <strong>ATP</strong>, <strong>Prota</strong>, <strong>Promes</strong>, <strong>KKTP</strong>, hingga <strong>RPM (Rencana Pembelajaran Modul)</strong> wajib disatukan ke dalam <strong>1 Berkas PDF</strong> sebelum diunggah ke antrean verifikasi Admin Utama (Kepala Sekolah).
            </p>
          </div>
        </div>
      </div>

      {/* Choose File Area */}
      <div>
        <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
          <span>Pilih Berkas PDF Bundel Lengkap</span>
          {fileName && (
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              1 File PDF Terpilih
            </span>
          )}
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />

        {fileName ? (
          <div className="p-4 bg-emerald-50/80 border-2 border-emerald-300 rounded-xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold text-xs">
                PDF
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{fileName}</p>
                <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-2">
                  <span>Ukuran: {fileSize || '3.8 MB'}</span>
                  <span>•</span>
                  <span>Format: Dokumen PDF Terpadu (CP s/d RPM)</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Ganti Berkas
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-600 bg-indigo-50/80'
                : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/40'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-indigo-950">
                  Pilih Berkas PDF <span className="font-normal text-slate-500">(Choose File)</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Klik untuk jelajahi perangkat atau seret berkas PDF (CP sampai RPM) ke sini
                </p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  Choose File (.pdf)
                </button>
                {onUseSampleBundle && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUseSampleBundle();
                    }}
                    className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Gunakan Bundel Resmi Guru</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </p>
        )}
      </div>

      {/* Checklist Cakupan Bagian dalam 1 Berkas PDF */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-indigo-600" />
            <span>Cakupan Komponen dalam 1 File PDF Ini:</span>
          </p>
          <span className="text-[10px] text-slate-500 font-semibold">
            {bundleComponents.length} dari {MANDATORY_BUNDLE_PARTS.length} Komponen Terpenuhi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MANDATORY_BUNDLE_PARTS.map((part) => {
            const isChecked = bundleComponents.includes(part.label);
            return (
              <label
                key={part.id}
                onClick={() => toggleComponent(part.label)}
                className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // handled by parent onClick
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-tight truncate">{part.label}</p>
                  <p className="text-[10px] text-slate-500 leading-tight truncate">{part.desc}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
