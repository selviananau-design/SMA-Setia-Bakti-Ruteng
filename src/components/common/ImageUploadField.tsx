import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Trash2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
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
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Berkas yang dipilih harus berupa gambar (JPG, PNG, WEBP, atau GIF).');
      return;
    }

    // Check size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Ukuran gambar terlalu besar (maksimal 8MB).');
      return;
    }

    setFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(file.size > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(file.size / 1024)} KB`);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onChange(result);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Gagal membaca berkas gambar. Silakan coba lagi.');
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
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

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && (
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Foto Terpilih
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 transition-opacity flex flex-col justify-between p-3">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 bg-white/90 hover:bg-white text-slate-800 text-[11px] font-bold rounded-lg shadow transition-all flex items-center gap-1 cursor-pointer"
                  title="Ganti Foto"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Ganti File</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg shadow transition-all flex items-center gap-1 cursor-pointer"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus</span>
                </button>
              </div>

              <div className="text-white text-[11px] truncate">
                <p className="font-semibold truncate">{fileName || 'Foto terpilih'}</p>
                {fileSize && <p className="text-[10px] text-white/80">{fileSize}</p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/70'
              : 'border-slate-300 hover:border-indigo-500 bg-slate-50 hover:bg-indigo-50/30'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-indigo-900">
                Pilih Berkas Foto <span className="font-normal text-slate-500">(Choose File)</span>
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs">{placeholderText}</p>
            </div>
            <button
              type="button"
              className="mt-1 px-3 py-1 bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              Jelajahi File Perangkat
            </button>
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
