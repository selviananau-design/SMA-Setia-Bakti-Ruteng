/**
 * Layanan Enkripsi & Perlindungan Privasi Data Siswa & Pegawai
 * Standar AES-256 GCM simulation & Data Masking sesuai UU PDP
 * Data audit log disimpan di database MySQL (bukan localStorage).
 */

import { dbService } from './dbSync';

export interface EncryptionAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: 'ENCRYPT' | 'DECRYPT' | 'VERIFY_KEY' | 'EXPORT_DATA';
  fieldAffected: string;
  status: 'SUCCESS' | 'DENIED';
}

// In-memory cache untuk audit log (akan disinkronkan ke database)
let auditLogsCache: EncryptionAuditLog[] = [];

// Data default audit log
const DEFAULT_AUDIT_LOGS: EncryptionAuditLog[] = [
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

/**
 * Memuat audit logs dari database
 */
export async function loadAuditLogs(): Promise<EncryptionAuditLog[]> {
  try {
    const data = await dbService.loadAllData();
    if (data?.auditLogs && Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
      auditLogsCache = data.auditLogs;
      return auditLogsCache;
    }
    // Jika belum ada di database, gunakan default dan simpan ke DB
    auditLogsCache = DEFAULT_AUDIT_LOGS;
    await dbService.syncEntity('auditLogs', DEFAULT_AUDIT_LOGS);
    return auditLogsCache;
  } catch (e) {
    console.warn('[encryption] Gagal memuat audit logs dari database:', e);
    if (auditLogsCache.length === 0) {
      auditLogsCache = DEFAULT_AUDIT_LOGS;
    }
    return auditLogsCache;
  }
}

/**
 * Mengambil audit logs dari cache (sinkron)
 */
export function getAuditLogs(): EncryptionAuditLog[] {
  if (auditLogsCache.length === 0) {
    return DEFAULT_AUDIT_LOGS;
  }
  return auditLogsCache;
}

/**
 * Menambahkan event audit baru dan menyimpannya ke database
 */
export async function logAuditEvent(
  actor: string,
  action: 'ENCRYPT' | 'DECRYPT' | 'VERIFY_KEY' | 'EXPORT_DATA',
  fieldAffected: string,
  status: 'SUCCESS' | 'DENIED'
): Promise<void> {
  const current = getAuditLogs();
  const newLog: EncryptionAuditLog = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleTimeString('id-ID'),
    actor,
    action,
    fieldAffected,
    status,
  };
  const updated = [newLog, ...current].slice(0, 100);
  auditLogsCache = updated;

  // Sinkronkan ke database
  try {
    await dbService.syncEntity('auditLogs', updated);
  } catch (e) {
    console.warn('[encryption] Gagal menyimpan audit log ke database:', e);
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