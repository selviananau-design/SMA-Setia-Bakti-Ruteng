import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  getDatabaseStatus,
  saveEntityToDb,
  getEntityFromDb,
  getAllDbEntities,
} from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Inisialisasi koneksi MySQL Hostinger
  await initDatabase();

  // -------------------------------------------------------------
  // API ROUTES (Harus didaftarkan SEBELUM Vite Middleware)
  // -------------------------------------------------------------

  // 1. Health check & status database
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/db-status', async (req, res) => {
    const status = await getDatabaseStatus();
    res.json(status);
  });

  // 2. Download Hostinger SQL script
  app.get('/api/download-sql', (req, res) => {
    const sqlPath = path.join(process.cwd(), 'hostinger_database.sql');
    if (fs.existsSync(sqlPath)) {
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', 'attachment; filename="smak_hostinger_database.sql"');
      return res.sendFile(sqlPath);
    }
    res.status(404).json({ error: 'Berkas database SQL tidak ditemukan' });
  });

  // 3. User Authentication Endpoint
  app.post('/api/auth/login', async (req, res) => {
    const { username, password, role } = req.body;

    // Kredensial default demo / db
    const users: Record<string, any> = {
      admin: {
        id: 'usr-admin-1',
        role: 'admin',
        name: 'Drs. Petrus Kanisius Dadi (Admin Utama)',
        identifier: 'admin',
        email: 'admin@smaksetiabakti.sch.id',
        token: 'token_admin_mysql_auth',
        nip: '197001011995011001',
      },
      walikelas: {
        id: 'usr-wali-1',
        role: 'wali_kelas',
        teacherType: 'wali_kelas',
        name: 'Theresia Imelda Ndua, S.Pd., M.Si.',
        identifier: 'walikelas',
        nip: '198811202015022004',
        email: 'theresia.ndua@smaksetiabakti.sch.id',
        className: 'X-MIPA 1',
        token: 'token_wali_mysql_auth',
      },
      gurumapel: {
        id: 'usr-mapel-1',
        role: 'guru_mapel',
        teacherType: 'guru_mapel',
        name: 'Drs. Fransiskus Xaverius, M.Pd.',
        identifier: 'gurumapel',
        nip: '198504122010011012',
        email: 'fransiskus.xaverius@smaksetiabakti.sch.id',
        subject: 'Biologi & Bioteknologi',
        className: 'X-MIPA 1',
        token: 'token_mapel_mysql_auth',
      },
      '0078129011': {
        id: 'usr-siswa-1',
        role: role === 'orangtua' ? 'orangtua' : 'siswa',
        name:
          role === 'orangtua'
            ? 'Bpk. Antonius Ngganggu (Orang Tua Yohanes Ndau)'
            : 'Yohanes Maria Vianney Ndau',
        identifier: '0078129011',
        className: 'X-MIPA 1',
        childNisn: '0078129011',
        token: 'token_member_mysql_auth',
      },
    };

    const targetUser = users[username];
    if (targetUser) {
      return res.json({ success: true, session: targetUser });
    }

    // Default fallback allow login
    const fallbackUser = {
      role: role || 'siswa',
      name: username,
      identifier: username,
      token: `token_${Date.now()}`,
    };
    return res.json({ success: true, session: fallbackUser });
  });

  // 4. Update Profile User
  app.post('/api/auth/update-profile', async (req, res) => {
    const { identifier, profileData } = req.body;
    try {
      await saveEntityToDb(`profile_${identifier}`, profileData);
      res.json({ success: true, message: 'Profil berhasil diperbarui di database' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Get All Data from Database Store
  app.get('/api/data', async (req, res) => {
    try {
      const data = await getAllDbEntities();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Save/Sync Entity Data into Database
  app.post('/api/sync/:entity', async (req, res) => {
    const { entity } = req.params;
    const data = req.body;
    try {
      await saveEntityToDb(entity, data);
      res.json({ success: true, entity, count: Array.isArray(data) ? data.length : 1 });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // -------------------------------------------------------------
  // VITE MIDDLEWARE (Development) vs STATIC ASSETS (Production)
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
