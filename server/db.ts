import mysql, { Pool } from 'mysql2/promise';

// ==========================================================
// KONFIGURASI DATABASE MySQL
// ==========================================================
export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

export const getDbConfig = (): DbConfig => {
  // Ambil dari environment variables
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || '';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'u128935091_db_stiba';

  // DEBUG: Tampilkan nilai env yang terbaca (password disamarkan)
  console.log('[DB Config] Konfigurasi yang akan digunakan:');
  console.log(`  host     : ${host}`);
  console.log(`  port     : 3306 (DIPAKSA - tidak baca env DB_PORT)`);
  console.log(`  user     : ${user || '(KOSONG! Cek Environment Variables)'}`);
  console.log(`  password : ${password ? '(ada, ' + password.length + ' karakter)' : '(KOSONG! Cek Environment Variables)'}`);
  console.log(`  database : ${database}`);

  return {
    host,
    port: 3306, // ← SELALU 3306, jangan gunakan process.env.DB_PORT
    user,
    password,
    database,
  };
};

let pool: Pool | null = null;
let isConnected = false;
let lastError: string | null = null;

// In-Memory Storage Cache (fallback jika database tidak terhubung)
const inMemoryStore: Record<string, any> = {};

// ==========================================================
// INISIALISASI DATABASE
// ==========================================================
export async function initDatabase() {
  const config = getDbConfig();

  // Cek apakah kredensial dasar sudah diisi
  if (!config.user) {
    console.error('[DB Error] ❌ DB_USER tidak diset! Isi Environment Variables di Hostinger.');
    isConnected = false;
    lastError = 'DB_USER tidak diset di Environment Variables';
    return { connected: false, error: lastError };
  }

  try {
    console.log('[DB] Membuat connection pool...');
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000, // 10 detik
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });

    console.log('[DB] Menguji koneksi...');
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnected = true;
    lastError = null;
    console.log(`[DB Success] ✅ Berhasil terhubung ke database MySQL: ${config.database}@${config.host}:${config.port}`);

    // Cek max_allowed_packet
    try {
      const [rows]: any = await pool.query("SHOW VARIABLES LIKE 'max_allowed_packet'");
      if (rows && rows.length > 0) {
        const maxPacketBytes = parseInt(rows[0].Value, 10);
        const maxPacketMB = (maxPacketBytes / (1024 * 1024)).toFixed(2);
        console.log(`[DB Info] max_allowed_packet: ${maxPacketMB} MB`);
        if (maxPacketBytes < 4 * 1024 * 1024) {
          console.warn(`[DB Warning] ⚠️ max_allowed_packet terlalu kecil. Minta Hostinger naikkan ke 64 MB.`);
        }
      }
    } catch (e: any) {
      console.warn('[DB Info] Tidak bisa cek max_allowed_packet:', e.message);
    }

    // Cek tabel app_settings
    try {
      const [tables]: any = await pool.query("SHOW TABLES LIKE 'app_settings'");
      if (!tables || tables.length === 0) {
        console.warn('[DB Warning] ⚠️ Tabel app_settings TIDAK ADA! Buat tabel di phpMyAdmin.');
      } else {
        console.log('[DB Info] ✅ Tabel app_settings ditemukan.');
      }
    } catch (e: any) {
      console.warn('[DB Info] Tidak bisa cek tabel:', e.message);
    }

    return { connected: true, host: config.host, database: config.database };
  } catch (err: any) {
    isConnected = false;
    lastError = err?.message || 'Gagal terhubung ke server MySQL';
    console.error(`[DB Error] ❌ Gagal terhubung: ${lastError}`);
    console.error(`[DB Error] Code: ${err.code}, Errno: ${err.errno}`);
    return { connected: false, error: lastError };
  }
}

// ==========================================================
// STATUS DATABASE
// ==========================================================
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

// ==========================================================
// QUERY UMUM
// ==========================================================
export async function queryDb<T = any>(sql: string, params?: any[]): Promise<T[]> {
  if (pool && isConnected) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows as T[];
    } catch (err: any) {
      console.error('[DB Query Error]', err.message);
      throw err;
    }
  }
  return [];
}

// ==========================================================
// SIMPAN DATA KE DATABASE
// ==========================================================
export async function saveEntityToDb(entityKey: string, data: any) {
  // Simpan dulu ke memori sebagai cache
  inMemoryStore[entityKey] = data;

  const jsonString = JSON.stringify(data);
  const sizeInBytes = jsonString.length;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(3);

  console.log(`[DB Sync] Simpan '${entityKey}' (${sizeInKB} KB / ${sizeInMB} MB)...`);

  // Deteksi Base64
  const base64Matches = jsonString.match(/data:image\/[a-zA-Z]+;base64,/g);
  const base64Count = base64Matches ? base64Matches.length : 0;

  if (base64Count > 0) {
    console.warn(`[DB Sync] '${entityKey}' mengandung ${base64Count} gambar Base64`);
  }

  // Batas ukuran keras: 8 MB
  const HARD_LIMIT_MB = 8;
  if (sizeInBytes > HARD_LIMIT_MB * 1024 * 1024) {
    const errorMsg = `Data '${entityKey}' terlalu besar (${sizeInMB} MB > ${HARD_LIMIT_MB} MB).`;
    console.error(`[DB Sync REJECTED] ❌ ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
      size: { bytes: sizeInBytes, mb: sizeInMB },
      base64Count,
    };
  }

  // Cek koneksi
  if (!pool || !isConnected) {
    console.warn(`[DB Sync] ❌ Database tidak terhubung. '${entityKey}' hanya di memori.`);
    return {
      success: false,
      error: 'Database tidak terhubung. Cek Environment Variables (DB_USER, DB_PASSWORD, DB_NAME) di Hostinger.',
    };
  }

  try {
    await pool.query(
      'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [entityKey, jsonString, jsonString]
    );
    console.log(`[DB Sync Success] ✅ '${entityKey}' (${sizeInKB} KB) tersimpan ke MySQL.`);
    return {
      success: true,
      count: Array.isArray(data) ? data.length : 1,
      size: { bytes: sizeInBytes, kb: sizeInKB, mb: sizeInMB },
      base64Count,
    };
  } catch (err: any) {
    const errMsg = err.message || 'Unknown error';
    const errCode = err.code || 'NO_CODE';

    console.error(`[DB Sync Error] ❌ GAGAL simpan '${entityKey}' (${sizeInKB} KB)`);
    console.error(`[DB Sync Error] Message: ${errMsg}`);
    console.error(`[DB Sync Error] Code: ${errCode}`);

    let userMessage = errMsg;
    if (errCode === 'ER_NET_PACKET_TOO_LARGE' || errMsg.includes('max_allowed_packet')) {
      userMessage = `Data terlalu besar (${sizeInMB} MB). Kompres gambar atau minta Hostinger naikkan max_allowed_packet.`;
    } else if (errMsg.includes('Data too long')) {
      userMessage = `Kolom database terlalu kecil (${sizeInMB} MB). Pastikan kolom setting_value bertipe LONGTEXT.`;
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

// ==========================================================
// AMBIL DATA SPESIFIK
// ==========================================================
export async function getEntityFromDb(entityKey: string) {
  if (pool && isConnected) {
    try {
      const [rows]: any = await pool.query(
        'SELECT setting_value FROM app_settings WHERE setting_key = ? LIMIT 1',
        [entityKey]
      );
      if (rows && rows.length > 0 && rows[0].setting_value) {
        const parsedData = JSON.parse(rows[0].setting_value);
        inMemoryStore[entityKey] = parsedData;
        return parsedData;
      }
    } catch (err) {
      console.warn(`[DB Fetch Warning] Gagal baca '${entityKey}':`, err);
    }
  }
  return inMemoryStore[entityKey] || null;
}

// ==========================================================
// AMBIL SEMUA DATA
// ==========================================================
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

      Object.assign(inMemoryStore, dbData);
      console.log(`[DB Fetch] ✅ Memuat ${rows.length} entitas dari database.`);
      return dbData;
    } catch (err: any) {
      console.warn('[DB Fetch] Gagal baca semua data:', err.message);
    }
  }

  console.log(`[DB Fetch] ⚠️ Menggunakan cache memori (database tidak terhubung).`);
  return inMemoryStore;
}