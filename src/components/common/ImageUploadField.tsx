import React, { useRef, useState } from 'react';
import {
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
  helperText?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  placeholderText?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  required = false,
  helperText = 'Format: JPG, PNG, WEBP, GIF (Disarankan max 5MB)',
  className = '',
  aspectRatio = 'video',
  placeholderText = 'Klik atau seret foto ke sini untuk memilih berkas dari perangkat',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ==========================================================
  // FUNGSI UPLOAD KE SERVER (PENGGANTI BASE64)
  // ==========================================================
  const handleFile = async (file: File) => {
    setErrorMessage(null);

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Berkas yang dipilih harus berupa gambar (JPG, PNG, WEBP, atau GIF).');
      return;
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran gambar terlalu besar (maksimal 5MB).');
      return;
    }

    setFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success && result.url) {
        // Simpan URL yang dikembalikan server, BUKAN Base64
        onChange(result.url);
        console.log(`[Upload Success] Foto tersimpan di server: ${result.url}`);
      } else {
        setErrorMessage(result.error || 'Gagal mengunggah gambar ke server.');
        setFileName('');
        setFileSize('');
      }
    } catch (err: any) {
      console.error('[Upload Error]', err);
      setErrorMessage('Terjadi kesalahan saat mengunggah gambar. Periksa koneksi Anda.');
      setFileName('');
      setFileSize('');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setFileName('');
    setFileSize('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const aspectClasses = {
    square: 'aspect-square max-w-[200px]',
    video: 'aspect-video max-w-full',
    wide: 'h-40 w-full',
    auto: 'min-h-[160px] w-full',
  }[aspectRatio];

  // Cek apakah value yang tersimpan adalah URL server atau Base64 (untuk kompatibilitas)
  const isBase64Value = value?.startsWith('data:image/');

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && !isUploading && (
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isBase64Value ? 'Foto Lama (Base64)' : 'Foto Tersimpan di Server'}
          </span>
        )}
        {isUploading && (
          <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Mengunggah...
          </span>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={isUploading}
      />

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-slate-300 bg-slate-50 group">
          <div className={`${aspectClasses} relative flex items-center justify-center bg-slate-900/5`}>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Overlay loading saat upload */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-[11px] font-bold">Mengunggah ke server...</span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold rounded-lg shadow transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                  title="Ganti Foto"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Ganti File</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg shadow transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              </div>

              <div className="text-white text-[11px] truncate">
                <p className="font-semibold truncate">{fileName || 'Foto terpilih'}</p>
                {fileSize && <p className="text-[10px] text-white/80">{fileSize}</p>}
                {!fileName && value && (
                  <p className="text-[10px] text-white/80 truncate">
                    {isBase64Value ? 'Foto lama (Base64)' : value}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isUploading
              ? 'border-blue-500 bg-blue-50/70 cursor-wait'
              : isDragging
              ? 'border-indigo-600 bg-indigo-50/70'
              : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-indigo-900">
                {isUploading ? (
                  'Mengunggah foto ke server...'
                ) : (
                  <>
                    Pilih Berkas Foto{' '}
                    <span className="font-normal text-slate-500">(Choose File)</span>
                  </>
                )}
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs">
                {isUploading ? 'Mohon tunggu sebentar...' : placeholderText}
              </p>
            </div>
            {!isUploading && (
              <button
                type="button"
                className="mt-1 px-3 py-1 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Jelajahi File Perangkat
              </button>
            )}
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </p>
      )}

      {helperText && !errorMessage && (
        <p className="text-[10px] text-slate-400">{helperText}</p>
      )}
    </div>
  );
};