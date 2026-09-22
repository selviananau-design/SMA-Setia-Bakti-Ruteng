/**
 * Layanan Enkripsi & Perlindungan Privasi Data Siswa & Pegawai
 * Standar AES-256 GCM simulation & Data Masking sesuai UU PDP
 */

export interface EncryptionAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: 'ENCRYPT' | 'DECRYPT' | 'VERIFY_KEY' | 'EXPORT_DATA';
  fieldAffected: string;
  status: 'SUCCESS' | 'DENIED';
}

const AUDIT_LOGS_KEY = 'smak_audit_logs';

export function getAuditLogs(): EncryptionAuditLog[] {
  try {
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return [
    {
      id: 'LOG-001',
      timestamp: new Date(Date.now() - 3600000 * 5).toLocaleTimeString('id-ID'),
      actor: 'Admin Utama (Drs. Petrus)',
      action: 'ENCRYPT',
      fieldAffected: 'NIK & No. Kontak 748 Siswa',
      status: 'SUCCESS',
    },
    {
      id: 'LOG-002',
      timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('id-ID'),
      actor: 'Sistem Keamanan Portal',
      action: 'VERIFY_KEY',
      fieldAffected: 'Validasi Enkripsi Database Dapodik',
      status: 'SUCCESS',
    },
  ];
}

export function logAuditEvent(
  actor: string,
  action: 'ENCRYPT' | 'DECRYPT' | 'VERIFY_KEY' | 'EXPORT_DATA',
  fieldAffected: string,
  status: 'SUCCESS' | 'DENIED'
) {
  const current = getAuditLogs();
  const newLog: EncryptionAuditLog = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleTimeString('id-ID'),
    actor,
    action,
    fieldAffected,
    status,
  };
  const updated = [newLog, ...current].slice(0, 30);
  try {
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}

// Simulasi pembuatan Hash AES-256 Token
export function simulateAesEncrypt(plainText: string): string {
  if (!plainText) return '';
  let hash = 0;
  for (let i = 0; i < plainText.length; i++) {
    const char = plainText.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const b64 = btoa(encodeURIComponent(plainText)).substring(0, 8);
  return `ENC:AES256:${hex.toUpperCase()}:${b64}`;
}

// Masking data sensitif
export function maskSensitiveData(text: string, type: 'nik' | 'phone' | 'email'): string {
  if (!text) return '-';
  if (type === 'nik') {
    if (text.length <= 6) return '******';
    return `${text.slice(0, 6)}******${text.slice(-4)}`;
  }
  if (type === 'phone') {
    if (text.length <= 4) return '****';
    return `${text.slice(0, 4)}****${text.slice(-4)}`;
  }
  if (type === 'email') {
    const parts = text.split('@');
    if (parts.length !== 2) return '***@***';
    const name = parts[0];
    const visible = name.slice(0, 2);
    return `${visible}***@${parts[1]}`;
  }
  return text;
}
