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
  console.log(`[Server] ℹ️ HOME: ${process.env.HOME || 'TIDAK DISET'}`);
  console.log(`[Server] ℹ️ CWD: ${process.cwd()}`);
  console.log(
    `[Server] ℹ️ Phusion Passenger: ${
      typeof (global as any).PhusionPassenger !== 'undefined' ? 'AKTIF' : 'TIDAK AKTIF'
    }`
  );

  // ==========================================================
  // KONFIGURASI FOLDER UPLOAD PERSISTEN
  // ==========================================================
  // Di Hostinger, folder deployment berada di dalam `versions/` yang dihapus setiap deploy.
  // Kita perlu menyimpan upload di folder PERSISTEN di luar `versions/`.
  //
  // Lokasi prioritas (dicoba dari atas ke bawah):
  // 1. ENV UPLOADS_DIR (paling fleksibel)
  // 2. Untuk Passenger (Hostinger): /home/USERNAME/portal-uploads
  // 3. Fallback untuk lokal: ./uploads
  const UPLOADS_DIR = (() => {
    if (process.env.UPLOADS_DIR) {
      return process.env.UPLOADS_DIR;
    }

    if (typeof (global as any).PhusionPassenger !== 'undefined' && process.env.HOME) {
      // Passenger mode di Hostinger — simpan di home folder user, di luar `versions/`
      return path.join(process.env.HOME, 'portal-uploads');
    }

    // Development lokal
    return path.join(process.cwd(), 'uploads');
  })();

  if (!fs.existsSync(UPLOADS_DIR)) {
    try {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      console.log(`[Uploads] ✅ Folder dibuat: ${UPLOADS_DIR}`);
    } catch (err) {
      console.error(`[Uploads] ❌ Gagal membuat folder ${UPLOADS_DIR}:`, err);
    }
  } else {
    console.log(`[Uploads] ✅ Folder sudah ada: ${UPLOADS_DIR}`);
  }

  // Verifikasi folder bisa diakses
  try {
    const testFile = path.join(UPLOADS_DIR, '.write-test');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log(`[Uploads] ✅ Folder dapat ditulis.`);
  } catch (err) {
    console.error(`[Uploads] ❌ Folder TIDAK dapat ditulis:`, err);
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
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
    limits: { fileSize: 5 * 1024 * 1024 },
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

  // Sajikan file statis dari folder uploads (HARUS sebelum catch-all route)
  app.use(
    '/uploads',
    express.static(UPLOADS_DIR, {
      maxAge: '30d',
      fallthrough: true,
    })
  );

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

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/db-status', async (req: Request, res: Response) => {
    const status = await getDatabaseStatus();
    res.json(status);
  });

  // Endpoint diagnostik untuk memverifikasi folder upload
  app.get('/api/upload-status', (req: Request, res: Response) => {
    try {
      const files = fs.existsSync(UPLOADS_DIR) ? fs.readdirSync(UPLOADS_DIR) : [];
      res.json({
        uploadsDir: UPLOADS_DIR,
        exists: fs.existsSync(UPLOADS_DIR),
        fileCount: files.length,
        recentFiles: files.slice(-10),
        cwd: process.cwd(),
        home: process.env.HOME,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

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

  // Upload endpoint
  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'Tidak ada file yang diunggah.' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      console.log(
        `[Upload Success] File disimpan: ${req.file.path} → URL: ${fileUrl} (${(
          req.file.size / 1024
        ).toFixed(2)} KB)`
      );

      res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        size: req.file.size,
        savedTo: req.file.path,
      });
    } catch (err: any) {
      console.error('[Upload Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
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
  // LISTEN
  // ==========================================================
  if (typeof (global as any).PhusionPassenger !== 'undefined') {
    console.log('[Server] 🚀 Mode Phusion Passenger terdeteksi.');
    app.listen(process.env.PORT as any, () => {
      console.log(`[Server] ✅ Server berjalan melalui Phusion Passenger.`);
    });
  } else {
    app.listen(LOCAL_PORT, () => {
      console.log(`[Server] ✅ Server berjalan di port ${LOCAL_PORT} (mode lokal).`);
    });
  }
}

startServer();