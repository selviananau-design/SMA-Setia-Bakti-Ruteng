import mysql, { Pool } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Konfigurasi Database MySQL (Disesuaikan dengan Hostinger / cPanel / hPanel)
export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

export const getDbConfig = (): DbConfig => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smak_setiabakti_db',
});

let pool: Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

// In-Memory Storage Cache (berfungsi sebagai fallback sinkronisasi real-time)
const inMemoryStore: Record<string, any> = {};

export async function initDatabase() {
  const config = getDbConfig();
  
  if (!process.env.DB_HOST && !process.env.DB_USER) {
    console.log('[DB Info] Kredensial MySQL Hostinger belum diisi di .env. Menggunakan local store aktif.');
    return { connected: false, message: 'Menunggu konfigurasi MySQL Hostinger' };
  }

  try {
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
      // PENTING: Naikkan max_allowed_packet dari sisi client
      // agar bisa mengirim data yang lebih besar
      maxIdle: 10,
      idleTimeout: 60000,
    });

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnected = true;
    lastError = null;
    console.log(`[DB Success] Berhasil terhubung ke database MySQL Hostinger: ${config.database}@${config.host}`);

    // Cek max_allowed_packet dari sisi server
    try {
      const [rows]: any = await pool.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
      if (rows && rows.length > 0) {
        const maxPacketBytes = parseInt(rows[0].Value, 10);
        const maxPacketMB = (maxPacketBytes / (1024 * 1024)).toFixed(2);
        console.log(`[DB Info] max_allowed_packet MySQL: ${maxPacketMB} MB (${maxPacketBytes} bytes)`);
        if (maxPacketBytes < 4 * 1024 * 1024) {
          console.warn(`[DB Warning] ⚠️ max_allowed_packet terlalu kecil (${maxPacketMB} MB). Data besar akan GAGAL disimpan. Hubungi Hostinger untuk menaikkan ke 64 MB.`);
        }
      }
    } catch (e) {
      console.warn('[DB Info] Tidak bisa cek max_allowed_packet.');
    }

    return { connected: true, host: config.host, database: config.database };
  } catch (err: any) {
    isConnected = false;
    lastError = err?.message || 'Gagal terhubung ke server MySQL';
    console.warn(`[DB Warning] Belum dapat terhubung ke MySQL Hostinger (${lastError}). Mengaktifkan mode Hybrid DB.`);
    return { connected: false, error: lastError };
  }
}

export async function getDatabaseStatus() {
  const config = getDbConfig();
  return {
    connected: isConnected,
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
    lastError,
    readyForHostinger: true,
    sqlScriptAvailable: true,
  };
}

export async function queryDb<T = any>(sql: string, params?: any[]): Promise<T[]> {
  if (pool && isConnected) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (err: any) {
      console.error('[DB Query Error]', err);
      throw err;
    }
  }
  return [];
}

// ==========================================================
// SIMPAN DATA KE DATABASE (DIPERBAIKI)
// - Validasi ukuran data sebelum kirim
// - Deteksi Base64
// - Pesan error yang informatif
// - Log detail untuk debugging
// ==========================================================
export async function saveEntityToDb(entityKey: string, data: any) {
  // Simpan dulu ke memori sebagai cache
  inMemoryStore[entityKey] = data;

  const jsonString = JSON.stringify(data);
  const sizeInBytes = jsonString.length;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(3);

  console.log(`[DB Sync] Mencoba simpan '${entityKey}' (${sizeInKB} KB / ${sizeInMB} MB)...`);

  // Deteksi apakah data mengandung Base64
  const base64Matches = jsonString.match(/data:image\/[a-zA-Z]+;base64,/g);
  const base64Count = base64Matches ? base64Matches.length : 0;

  if (base64Count > 0) {
    console.warn(`[DB Sync Warning] '${entityKey}' mengandung ${base64Count} gambar Base64. Ukuran total: ${sizeInMB} MB`);
  }

  // Batas ukuran keras: 8 MB (di bawah ini seharusnya aman jika max_allowed_packet >= 16 MB)
  const HARD_LIMIT_MB = 8;
  if (sizeInBytes > HARD_LIMIT_MB * 1024 * 1024) {
    const errorMsg = `Data '${entityKey}' terlalu besar (${sizeInMB} MB > ${HARD_LIMIT_MB} MB). ` +
      `Kurangi jumlah gambar atau kompres gambar terlebih dahulu.`;
    console.error(`[DB Sync REJECTED] ❌ ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      size: { bytes: sizeInBytes, mb: sizeInMB },
      base64Count,
    };
  }

  if (!pool || !isConnected) {
    console.warn(`[DB Sync Warning] Database tidak terhubung. Data '${entityKey}' hanya tersimpan di memori.`);
    return {
      success: false,
      error: 'Database tidak terhubung. Periksa koneksi MySQL.',
    };
  }

  try {
    await pool.query(
      'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [entityKey, jsonString, jsonString]
    );
    console.log(`[DB Sync Success] ✅ '${entityKey}' (${sizeInKB} KB) berhasil disimpan ke MySQL.`);
    return {
      success: true,
      count: Array.isArray(data) ? data.length : 1,
      size: { bytes: sizeInBytes, kb: sizeInKB, mb: sizeInMB },
      base64Count,
    };
  } catch (err: any) {
    const errMsg = err.message || 'Unknown error';
    const errCode = err.code || 'NO_CODE';
    const errno = err.errno || 'NO_ERRNO';

    console.error(`[DB Sync Error] ❌ GAGAL simpan '${entityKey}' (${sizeInKB} KB)`);
    console.error(`[DB Sync Error] Message: ${errMsg}`);
    console.error(`[DB Sync Error] Code: ${errCode}, Errno: ${errno}`);

    // Pesan error yang lebih ramah untuk pengguna
    let userMessage = errMsg;
    if (
      errCode === 'ER_NET_PACKET_TOO_LARGE' ||
      errMsg.includes('max_allowed_packet') ||
      errMsg.includes('Got a packet bigger than')
    ) {
      userMessage =
        `Data terlalu besar untuk database (${sizeInMB} MB). ` +
        `Solusi: (1) Kompres gambar lebih kecil, (2) Kurangi jumlah Base64, ` +
        `atau (3) Minta Hostinger naikkan max_allowed_packet ke 64 MB.`;
    } else if (errMsg.includes('Data too long')) {
      userMessage =
        `Kolom database terlalu kecil untuk data ini (${sizeInMB} MB). ` +
        `Pastikan kolom 'setting_value' bertipe LONGTEXT.`;
    }

    return {
      success: false,
      error: userMessage,
      technicalError: errMsg,
      code: errCode,
      size: { bytes: sizeInBytes, kb: sizeInKB, mb: sizeInMB },
      base64Count,
    };
  }
}

export async function getEntityFromDb(entityKey: string) {
  if (pool && isConnected) {
    try {
      const [rows]: any = await pool.query(
        'SELECT setting_value FROM app_settings WHERE setting_key = ? LIMIT 1',
        [entityKey]
      );
      if (rows && rows.length > 0 && rows[0].setting_value) {
        const parsedData = JSON.parse(rows[0].setting_value);
        inMemoryStore[entityKey] = parsedData; // Update cache
        return parsedData;
      }
    } catch (err) {
      console.warn(`[DB Fetch Warning] Gagal membaca ${entityKey} dari MySQL:`, err);
    }
  }

  return inMemoryStore[entityKey] || null;
}

export async function getAllDbEntities() {
  if (pool && isConnected) {
    try {
      const [rows]: any = await pool.query('SELECT setting_key, setting_value FROM app_settings');
      const dbData: Record<string, any> = {};

      for (const row of rows) {
        try {
          dbData[row.setting_key] = JSON.parse(row.setting_value);
        } catch (e) {
          dbData[row.setting_key] = row.setting_value;
        }
      }

      // Update inMemoryStore sebagai cache
      Object.assign(inMemoryStore, dbData);
      return dbData;
    } catch (err) {
      console.warn('[DB Fetch All Warning] Gagal membaca semua data dari MySQL. Menggunakan cache memori.', err);
    }
  }

  // Fallback ke memori jika database gagal
  return inMemoryStore;
}