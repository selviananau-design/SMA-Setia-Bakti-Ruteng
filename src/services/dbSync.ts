// Layanan Sinkronisasi Database MySQL Hostinger
// Menggantikan ketergantungan LocalStorage murni dengan Database Server Terpusat

export interface DbStatus {
  connected: boolean;
  host: string;
  port: number;
  user: string;
  database: string;
  lastError: string | null;
  readyForHostinger: boolean;
}

export const dbService = {
  // 1. Cek status koneksi MySQL
  async getStatus(): Promise<DbStatus> {
    try {
      const res = await fetch('/api/db-status');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('[dbService] Tidak dapat mengecek status server DB:', err);
    }
    return {
      connected: false,
      host: 'localhost',
      port: 3306,
      user: 'u123456789_smak',
      database: 'u123456789_smakdb',
      lastError: 'Server offline / fallback mode aktif',
      readyForHostinger: true,
    };
  },

  // 2. Ambil data tersimpan dari Database Server
  async loadAllData(): Promise<Record<string, any>> {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('[dbService] Gagal memuat data dari database:', err);
    }
    return {};
  },

  // 3. Simpan / Sinkronisasi entitas ke Database MySQL
  async syncEntity(entityName: string, data: any): Promise<boolean> {
    try {
      const res = await fetch(`/api/sync/${encodeURIComponent(entityName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.success;
      }
    } catch (err) {
      console.warn(`[dbService] Gagal sinkronisasi ${entityName} ke DB:`, err);
    }
    return false;
  },

  // 4. Update profil pengguna ke Database
  async updateProfile(identifier: string, profileData: any): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, profileData }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.success;
      }
    } catch (err) {
      console.warn('[dbService] Gagal update profil ke DB:', err);
    }
    return false;
  },

  // 5. Unduh file hostinger_database.sql langsung dari browser
  downloadHostingerSql() {
    window.open('/api/download-sql', '_blank');
  },
};
