import mysql from 'mysql2/promise';
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

let pool: mysql.Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

// In-Memory Storage Cache (berfungsi sebagai fallback sinkronisasi real-time)
const inMemoryStore: Record<string, any> = {};

export async function initDatabase() {
  const config = getDbConfig();
  
  // Hanya inisialisasi pool jika DB_HOST atau DB_USER diset
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
    });

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnected = true;
    lastError = null;
    console.log(`[DB Success] Berhasil terhubung ke database MySQL Hostinger: ${config.database}@${config.host}`);
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

// Eksekusi query aman ke MySQL
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

// Sinkronisasi data entitas ke Store Database
export async function saveEntityToDb(entityKey: string, data: any) {
  inMemoryStore[entityKey] = data;

  if (pool && isConnected) {
    try {
      // Simpan snapshot ke tabel app_settings jika tersedia
      await pool.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [entityKey, JSON.stringify(data), JSON.stringify(data)]
      );
    } catch (err) {
      console.warn(`[DB Sync Warning] Gagal menyimpan ${entityKey} ke MySQL:`, err);
    }
  }

  return { success: true, count: Array.isArray(data) ? data.length : 1 };
}

export async function getEntityFromDb(entityKey: string) {
  if (pool && isConnected) {
    try {
      const [rows]: any = await pool.query(
        'SELECT setting_value FROM app_settings WHERE setting_key = ? LIMIT 1',
        [entityKey]
      );
      if (rows && rows.length > 0 && rows[0].setting_value) {
        return JSON.parse(rows[0].setting_value);
      }
    } catch (err) {
      console.warn(`[DB Fetch Warning] Gagal membaca ${entityKey} dari MySQL:`, err);
    }
  }

  return inMemoryStore[entityKey] || null;
}

export async function getAllDbEntities() {
  return inMemoryStore;
}
