import mysql, { Pool } from 'mysql2/promise';

// ==========================================================
// KONFIGURASI DATABASE MySQL (OPTIMIZED FOR LOW RESOURCE)
// ==========================================================
export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}

// Cache config agar tidak dibaca ulang setiap saat
let cachedConfig: DbConfig | null = null;

export const getDbConfig = (): DbConfig => {
  if (cachedConfig) return cachedConfig;

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || '';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'u128935091_db_stiba';

  cachedConfig = {
    host,
    port: 3306, // SELALU 3306, jangan baca env DB_PORT
    user,
    password,
    database,
  };

  // Log hanya sekali, bukan setiap initDatabase dipanggil
  console.log('[DB Config] host=%s, user=%s, db=%s', host, user || '(KOSONG)', database);

  return cachedConfig;
};

let pool: Pool | null = null;
let isConnected = false;
let lastError: string | null = null;
let isInitializing = false;

// In-Memory Storage Cache (fallback jika database tidak terhubung)
const inMemoryStore: Record<string, any> = {};

// ==========================================================
// INISIALISASI DATABASE (OPTIMIZED)
// ==========================================================
export async function initDatabase() {
  // Cegah double init jika ada multiple request saat startup
  if (isInitializing) {
    console.log('[DB] Init sudah berjalan, skip...');
    return { connected: isConnected, host: 'pending', database: 'pending' };
  }

  if (pool && isConnected) {
    console.log('[DB] Sudah terhubung sebelumnya, skip init ulang.');
    return { connected: true, host: cachedConfig?.host || 'localhost', database: cachedConfig?.database || '' };
  }

  isInitializing = true;
  const config = getDbConfig();

  // Cek kredensial dasar
  if (!config.user) {
    console.error('[DB Error] ❌ DB_USER tidak diset!');
    isConnected = false;
    lastError = 'DB_USER tidak diset';
    isInitializing = false;
    return { connected: false, error: lastError };
  }

  try {
    console.log('[DB] Membuat connection pool (optimized)...');
    pool = mysql.createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      // ========================================================
      // OPTIMASI RESOURCE: Kurangi connection pool dari 10 → 2
      // ========================================================
      waitForConnections: true,
      connectionLimit: 2,        // ← HEMAT RAM (dari 10 → 2)
      maxIdle: 2,                // ← Maks 2 koneksi idle
      idleTimeout: 60000,        // ← Putuskan koneksi idle setelah 60 detik
      queueLimit: 5,             // ← Batasi antrian
      connectTimeout: 8000,      // ← Timeout koneksi 8 detik
      // ========================================================
      // MATIKAN KEEP-ALIVE: Hemat resource (koneksi tidak terus terbuka)
      // ========================================================
      enableKeepAlive: false,    // ← HEMAT CPU & RAM
    });

    console.log('[DB] Menguji koneksi...');
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnected = true;
    lastError = null;
    console.log(`[DB Success] ✅ Terhubung ke database: ${config.database}@${config.host}:${config.port}`);

    // ========================================================
    // HAPUS QUERY DIAGNOSTIK STARTUP (HEMAT RESOURCE)
    // Cek max_allowed_packet dan SHOW TABLES sudah dihapus karena
    // tidak perlu dan hanya membuang resource saat startup
    // ========================================================

    isInitializing = false;
    return { connected: true, host: config.host, database: config.database };
  } catch (err: any) {
    isConnected = false;
    lastError = err?.message || 'Gagal terhubung ke MySQL';
    console.error(`[DB Error] ❌ Gagal: ${lastError}`);
    isInitializing = false;
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
// SIMPAN DATA KE DATABASE (dengan validasi ringan)
// ==========================================================
export async function saveEntityToDb(entityKey: string, data: any) {
  // Simpan ke memori dulu
  inMemoryStore[entityKey] = data;

  const jsonString = JSON.stringify(data);
  const sizeInBytes = jsonString.length;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);

  // Cek koneksi
  if (!pool || !isConnected) {
    console.warn(`[DB Sync] ❌ Database tidak terhubung. '${entityKey}' hanya di memori.`);
    return {
      success: false,
      error: 'Database tidak terhubung. Cek Environment Variables di Hostinger.',
    };
  }

  try {
    await pool.query(
      'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [entityKey, jsonString, jsonString]
    );
    console.log(`[DB Sync Success] ✅ '${entityKey}' (${sizeInKB} KB) tersimpan.`);
    return {
      success: true,
      count: Array.isArray(data) ? data.length : 1,
      size: { bytes: sizeInBytes, kb: sizeInKB },
    };
  } catch (err: any) {
    const errMsg = err.message || 'Unknown error';
    const errCode = err.code || 'NO_CODE';

    console.error(`[DB Sync Error] ❌ GAGAL simpan '${entityKey}': ${errMsg} (${errCode})`);

    let userMessage = errMsg;
    if (errCode === 'ER_NET_PACKET_TOO_LARGE' || errMsg.includes('max_allowed_packet')) {
      userMessage = `Data terlalu besar. Kompres gambar atau kurangi data.`;
    } else if (errMsg.includes('Data too long')) {
      userMessage = `Kolom database terlalu kecil. Pastikan bertipe LONGTEXT.`;
    }

    return {
      success: false,
      error: userMessage,
      code: errCode,
      size: { bytes: sizeInBytes, kb: sizeInKB },
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
      console.log(`[DB Fetch] ✅ Memuat ${rows.length} entitas.`);
      return dbData;
    } catch (err: any) {
      console.warn('[DB Fetch] Gagal baca semua data:', err.message);
    }
  }

  console.log(`[DB Fetch] ⚠️ Pakai cache memori.`);
  return inMemoryStore;
}