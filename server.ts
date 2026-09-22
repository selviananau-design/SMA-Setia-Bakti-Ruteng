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
  const isPassenger = typeof (global as any).PhusionPassenger !== 'undefined';

  console.log(`[Server] NODE_ENV=${process.env.NODE_ENV}, PASSENGER=${isPassenger}, HOME=${process.env.HOME || 'N/A'}`);

  // Tentukan folder upload dengan aman
  let UPLOADS_DIR: string;
  try {
    if (process.env.UPLOADS_DIR) {
      UPLOADS_DIR = process.env.UPLOADS_DIR;
    } else if (isPassenger && process.env.HOME) {
      UPLOADS_DIR = path.join(process.env.HOME, 'portal-uploads');
    } else {
      UPLOADS_DIR = path.join(process.cwd(), 'uploads');
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    console.log(`[Uploads] Folder: ${UPLOADS_DIR}`);
  } catch (err: any) {
    console.error(`[Uploads] Gagal setup folder: ${err.message}`);
    UPLOADS_DIR = path.join(process.cwd(), 'uploads');
    try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch {}
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  try {
    await initDatabase();
    console.log('✅ Database terhubung.');
  } catch (error) {
    console.error('❌ Gagal init database:', error);
  }

  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.get('/api/db-status', async (req: Request, res: Response) => {
    res.json(await getDatabaseStatus());
  });

  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'Tidak ada file.' });
    res.json({
      success: true,
      url: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
    });
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, role } = req.body;
    const users: Record<string, any> = {
      admin: { id: 'usr-admin-1', role: 'admin', name: 'Admin Utama', identifier: 'admin', email: 'admin@smaksetiabakti.sch.id', token: 'token_admin', nip: '197001011995011001' },
      walikelas: { id: 'usr-wali-1', role: 'wali_kelas', name: 'Wali Kelas', identifier: 'walikelas', nip: '198811202015022004', email: 'wali@smaksetiabakti.sch.id', className: 'X-MIPA 1', token: 'token_wali' },
      gurumapel: { id: 'usr-mapel-1', role: 'guru_mapel', name: 'Guru Mapel', identifier: 'gurumapel', nip: '198504122010011012', email: 'guru@smaksetiabakti.sch.id', subject: 'Biologi', className: 'X-MIPA 1', token: 'token_mapel' },
      '0078129011': { id: 'usr-siswa-1', role: role === 'orangtua' ? 'orangtua' : 'siswa', name: 'Siswa', identifier: '0078129011', className: 'X-MIPA 1', childNisn: '0078129011', token: 'token_siswa' },
    };
    const target = users[username];
    if (target) return res.json({ success: true, session: target });
    return res.json({ success: true, session: { role: role || 'siswa', name: username, identifier: username, token: `token_${Date.now()}` } });
  });

  app.post('/api/auth/update-profile', async (req: Request, res: Response) => {
    try {
      await saveEntityToDb(`profile_${req.body.identifier}`, req.body.profileData);
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/data', async (req: Request, res: Response) => {
    try {
      res.json({ success: true, data: await getAllDbEntities() });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/sync/:entity', async (req: Request, res: Response) => {
    try {
      const result = await saveEntityToDb(req.params.entity, req.body);
      if (result.success) return res.json({ success: true });
      return res.status(500).json({ success: false, error: result.error });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/download-sql', (req: Request, res: Response) => {
    const sqlPath = path.join(process.cwd(), 'hostinger_database.sql');
    if (fs.existsSync(sqlPath)) return res.sendFile(sqlPath);
    res.status(404).json({ error: 'Tidak ditemukan' });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (isPassenger) {
    app.listen(process.env.PORT as any, () => console.log(`✅ Passenger ready.`));
  } else {
    app.listen(LOCAL_PORT, () => console.log(`✅ Server lokal di port ${LOCAL_PORT}.`));
  }
}

startServer();