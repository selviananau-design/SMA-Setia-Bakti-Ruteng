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
    });

    const connection = await pool.getConnection();
    await connection.ping();

    // Buat tabel app_settings jika belum ada
    await connection.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        setting_key VARCHAR(255) PRIMARY KEY,
        setting_value LONGTEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

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

export async function saveEntityToDb(entityKey: string, data: any) {
  inMemoryStore[entityKey] = data;

  if (pool && isConnected) {
    try {
      await pool.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [entityKey, JSON.stringify(data), JSON.stringify(data)]
      );
      console.log(`[DB Sync Success] Data ${entityKey} berhasil disimpan ke MySQL.`);
      return { success: true, count: Array.isArray(data) ? data.length : 1 };
    } catch (err: any) {
      console.error(`[DB Sync Error] Gagal menyimpan ${entityKey} ke MySQL:`, err.message);
      return { success: false, error: err.message };
    }
  }
  
  console.warn(`[DB Sync Warning] Database tidak terhubung, data ${entityKey} hanya tersimpan di memori sementara.`);
  return { success: false, error: 'Database tidak terhubung' };
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