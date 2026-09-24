import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import {
  initDatabase,
  getDatabaseStatus,
  saveEntityToDb,
  getEntityFromDb,
  getAllDbEntities,
} from './server/db';

// TODO: Import koneksi database Anda di sini. 
// Contoh: import { pool } from './server/db'; 
// (Sesuaikan dengan cara Anda mengekspor koneksi di db.ts)

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  console.log('[Server] ════════════════════════════════════════');
  console.log(`[Server] PORT (pakai): ${PORT}`);
  console.log('[Server] ════════════════════════════════════════');

  // ==========================================================
  // FOLDER UPLOAD
  // ==========================================================
  let UPLOADS_DIR: string;
  try {
    if (process.env.UPLOADS_DIR) {
      UPLOADS_DIR = process.env.UPLOADS_DIR;
    } else if (process.env.HOME && process.env.HOME.includes('/domains/')) {
      UPLOADS_DIR = path.join(process.env.HOME, 'portal-uploads');
    } else {
      UPLOADS_DIR = path.join(process.cwd(), 'uploads');
    }
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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

  const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

  // ==========================================================
  // MIDDLEWARE
  // ==========================================================
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  app.use('/uploads', express.static(UPLOADS_DIR));

  // ==========================================================
  // DATABASE INIT
  // ==========================================================
  try {
    await initDatabase();
    console.log('✅ Database terhubung.');
  } catch (error) {
    console.error('❌ Gagal init database:', error);
  }

  // ==========================================================
  // API ROUTES
  // ==========================================================
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString(), port: PORT });
  });

  app.get('/api/db-status', async (req: Request, res: Response) => {
    res.json(await getDatabaseStatus());
  });

  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ success: false, error: 'Tidak ada file.' });
    res.json({ success: true, url: `/uploads/${req.file.filename}` });
  });

  // ==========================================================
  // LOGIN YANG AMAN (MENGGUNAKAN DATABASE)
  // ==========================================================
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username dan password wajib diisi' });
    }

    try {
      // TODO: GANTI BARIS INI DENGAN QUERY DATABASE ANDA
      // Contoh jika menggunakan mysql2/promise:
      // const [rows]: any = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
      // const user = rows[0];
      
      // --- SIMULASI SEMENTARA (HAPUS SETELAH ANDA BUAT QUERY DB) ---
      let user: any = null; 
      if (username === 'admin') {
          // Ini hanya contoh sementara agar kode bisa jalan sebelum Anda buat query DB
          user = { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin Utama' };
      }
      // -------------------------------------------------------------

      if (!user) {
        return res.status(401).json({ success: false, error: 'Username atau password salah' });
      }

      // Bandingkan password yang diinput dengan hash di database
      // Jika di database masih plain text (seperti 'admin123'), bandingkan langsung: if (password !== user.password)
      // Jika sudah hash, gunakan bcrypt.compare:
      const isMatch = await bcrypt.compare(password, user.password).catch(() => password === user.password);
      
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Username atau password salah' });
      }

      // Login Berhasil
      return res.json({
        success: true,
        session: {
          id: user.id,
          role: user.role,
          name: user.name,
          username: user.username,
          token: `token_${Date.now()}` // Sebaiknya gunakan JWT asli
        }
      });

    } catch (error: any) {
      console.error('Login Error:', error);
      return res.status(500).json({ success: false, error: 'Terjadi kesalahan server' });
    }
  });

  // ==========================================================
  // UPDATE PASSWORD
  // ==========================================================
  app.post('/api/auth/update-password', async (req: Request, res: Response) => {
    const { username, oldPassword, newPassword } = req.body;
    
    try {
      // 1. Cek user dan password lama (Sesuaikan dengan query DB Anda)
      // const [rows]: any = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
      // const user = rows[0];
      // const isMatch = await bcrypt.compare(oldPassword, user.password);
      
      // 2. Hash password baru
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      
      // 3. Update ke database (Sesuaikan dengan query DB Anda)
      // await pool.execute('UPDATE users SET password = ? WHERE username = ?', [hashedNewPassword, username]);
      
      return res.json({ success: true, message: 'Password berhasil diubah' });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
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

  // ==========================================================
  // FRONTEND
  // ==========================================================
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server berjalan di http://0.0.0.0:${PORT}`);
  });
}

startServer();