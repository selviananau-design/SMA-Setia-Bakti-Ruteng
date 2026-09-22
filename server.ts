import express, { Request, Response } from 'express';
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
  // Port untuk mode lokal, Passenger akan menimpa ini dengan socket path
  const LOCAL_PORT = Number(process.env.PORT) || 3000;

  console.log(`[Server] ℹ️ Memulai server...`);
  console.log(`[Server] ℹ️ NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[Server] ℹ️ PORT dari environment: ${process.env.PORT || 'TIDAK DISET'}`);
  console.log(`[Server] ℹ️ Phusion Passenger: ${typeof (global as any).PhusionPassenger !== 'undefined' ? 'AKTIF' : 'TIDAK AKTIF'}`);

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  try {
    await initDatabase();
    console.log('✅ Koneksi database berhasil diinisialisasi.');
  } catch (error) {
    console.error('❌ Gagal menginisialisasi database:', error);
  }

  // -------------------------------------------------------------
  // API ROUTES
  // -------------------------------------------------------------

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/db-status', async (req: Request, res: Response) => {
    const status = await getDatabaseStatus();
    res.json(status);
  });

  app.get('/api/download-sql', (req: Request, res: Response) => {
    const sqlPath = path.join(process.cwd(), 'hostinger_database.sql');
    if (fs.existsSync(sqlPath)) {
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader('Content-Disposition', 'attachment; filename="smak_hostinger_database.sql"');
      return res.sendFile(sqlPath);
    }
    res.status(404).json({ error: 'Berkas database SQL tidak ditemukan' });
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, role } = req.body;

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
        name: role === 'orangtua' ? 'Bpk. Antonius Ngganggu (Orang Tua Yohanes Ndau)' : 'Yohanes Maria Vianney Ndau',
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

    const fallbackUser = {
      role: role || 'siswa',
      name: username,
      identifier: username,
      token: `token_${Date.now()}`,
    };
    return res.json({ success: true, session: fallbackUser });
  });

  app.post('/api/auth/update-profile', async (req: Request, res: Response) => {
    const { identifier, profileData } = req.body;
    try {
      await saveEntityToDb(`profile_${identifier}`, profileData);
      res.json({ success: true, message: 'Profil berhasil diperbarui di database' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/data', async (req: Request, res: Response) => {
    try {
      const data = await getAllDbEntities();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/sync/:entity', async (req: Request, res: Response) => {
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
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // -------------------------------------------------------------
  // LISTEN: Deteksi Phusion Passenger (Hostinger) vs Mode Lokal
  // -------------------------------------------------------------
  if (typeof (global as any).PhusionPassenger !== 'undefined') {
    // Mode Passenger: Passenger memberikan socket path melalui process.env.PORT
    console.log('[Server] 🚀 Mode Phusion Passenger terdeteksi. Menggunakan socket Passenger.');
    // Passenger akan mengatur agar aplikasi listen pada socket yang benar
    app.listen(process.env.PORT as any, () => {
      console.log(`[Server] ✅ Server berhasil berjalan melalui Phusion Passenger.`);
    });
  } else {
    // Mode lokal: Dengarkan pada port TCP biasa
    app.listen(LOCAL_PORT, () => {
      console.log(`[Server] ✅ Server berhasil berjalan di port ${LOCAL_PORT} (mode lokal).`);
    });
  }
}

startServer();