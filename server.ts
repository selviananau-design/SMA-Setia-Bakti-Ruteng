import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
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
  const LOCAL_PORT = Number(process.env.PORT) || 3000;

  console.log(`[Server] ℹ️ Memulai server...`);
  console.log(`[Server] ℹ️ NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`[Server] ℹ️ PORT dari environment: ${process.env.PORT || 'TIDAK DISET'}`);
  console.log(
    `[Server] ℹ️ Phusion Passenger: ${
      typeof (global as any).PhusionPassenger !== 'undefined' ? 'AKTIF' : 'TIDAK AKTIF'
    }`
  );

  // ==========================================================
  // KONFIGURASI UPLOAD FILE (MULTER)
  // ==========================================================
  // Folder uploads disimpan di root proyek (bukan di dist) agar tidak terhapus saat deploy
  const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    console.log(`[Uploads] Folder dibuat: ${UPLOADS_DIR}`);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      // Sanitasi nama file dan tambahkan timestamp agar unik
      const ext = path.extname(file.originalname).toLowerCase();
      const baseName = path
        .basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, '-')
        .substring(0, 40);
      const uniqueName = `${Date.now()}-${baseName}${ext}`;
      cb(null, uniqueName);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Maks 5 MB
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Format file tidak diizinkan. Gunakan JPG, PNG, WebP, SVG, atau GIF.'));
      }
    },
  });

  // ==========================================================
  // MIDDLEWARE DASAR
  // ==========================================================
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Sajikan file dari folder uploads secara statis
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ==========================================================
  // INISIALISASI DATABASE
  // ==========================================================
  try {
    await initDatabase();
    console.log('✅ Koneksi database berhasil diinisialisasi.');
  } catch (error) {
    console.error('❌ Gagal menginisialisasi database:', error);
  }

  // ==========================================================
  // API ROUTES
  // ==========================================================

  // 1. Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. Status database
  app.get('/api/db-status', async (req: Request, res: Response) => {
    const status = await getDatabaseStatus();
    res.json(status);
  });

  // 3. Download SQL script
  app.get('/api/download-sql', (req: Request, res: Response) => {
    const sqlPath = path.join(process.cwd(), 'hostinger_database.sql');
    if (fs.existsSync(sqlPath)) {
      res.setHeader('Content-Type', 'application/sql');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="smak_hostinger_database.sql"'
      );
      return res.sendFile(sqlPath);
    }
    res.status(404).json({ error: 'Berkas database SQL tidak ditemukan' });
  });

  // 4. Upload gambar (BARU) - Menggantikan Base64
  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Tidak ada file yang diunggah.' });
      }

      // Kembalikan URL relatif yang bisa diakses dari frontend
      const fileUrl = `/uploads/${req.file.filename}`;
      console.log(`[Upload Success] File disimpan: ${fileUrl} (${(req.file.size / 1024).toFixed(2)} KB)`);

      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
      });
    } catch (err: any) {
      console.error('[Upload Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Login
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

    const fallbackUser = {
      role: role || 'siswa',
      name: username,
      identifier: username,
      token: `token_${Date.now()}`,
    };
    return res.json({ success: true, session: fallbackUser });
  });

  // 6. Update profil
  app.post('/api/auth/update-profile', async (req: Request, res: Response) => {
    const { identifier, profileData } = req.body;
    try {
      await saveEntityToDb(`profile_${identifier}`, profileData);
      res.json({ success: true, message: 'Profil berhasil diperbarui di database' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Ambil semua data
  app.get('/api/data', async (req: Request, res: Response) => {
    try {
      const data = await getAllDbEntities();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 8. Sinkronisasi entitas ke database
  app.post('/api/sync/:entity', async (req: Request, res: Response) => {
    const { entity } = req.params;
    const data = req.body;
    try {
      const result = await saveEntityToDb(entity, data);
      if (result.success) {
        res.json({ success: true, entity, count: Array.isArray(data) ? data.length : 1 });
      } else {
        res.status(500).json({ success: false, entity, error: result.error });
      }
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================================
  // VITE MIDDLEWARE (Development) vs STATIC ASSETS (Production)
  // ==========================================================
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

  // ==========================================================
  // LISTEN: Deteksi Phusion Passenger (Hostinger) vs Mode Lokal
  // ==========================================================
  if (typeof (global as any).PhusionPassenger !== 'undefined') {
    console.log('[Server] 🚀 Mode Phusion Passenger terdeteksi. Menggunakan socket Passenger.');
    app.listen(process.env.PORT as any, () => {
      console.log(`[Server] ✅ Server berhasil berjalan melalui Phusion Passenger.`);
    });
  } else {
    app.listen(LOCAL_PORT, () => {
      console.log(`[Server] ✅ Server berjalan di port ${LOCAL_PORT} (mode lokal).`);
    });
  }
}

startServer();