-- ==============================================================================
-- DATABASE SCHEMA & SEED DATA: SMA KATOLIK SETIA BAKTI RUTENG
-- PANDUAN IMPORT HOSTINGER (hPanel / cPanel -> phpMyAdmin):
-- 1. Buat database baru di Hostinger (misal: u123456789_smakdb)
-- 2. Buat user database & password, berikan ALL PRIVILEGES
-- 3. Buka phpMyAdmin -> Pilih database tersebut -> Tab "Import"
-- 4. Pilih file ini (hostinger_database.sql) lalu klik "Go" / "Kirim"
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- ------------------------------------------------------------------------------
-- 1. TABEL: users (Akun Pengguna: Admin, Guru Mapel, Wali Kelas, Siswa, Orang Tua)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `username` VARCHAR(64) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'wali_kelas', 'guru_mapel', 'siswa', 'orangtua') NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `nip` VARCHAR(64) DEFAULT NULL,
  `nisn` VARCHAR(32) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(32) DEFAULT NULL,
  `class_name` VARCHAR(50) DEFAULT NULL,
  `subject` VARCHAR(100) DEFAULT NULL,
  `avatar` TEXT DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `name`, `nip`, `nisn`, `email`, `phone`, `class_name`, `subject`, `bio`, `address`) VALUES
('usr-admin-1', 'admin', 'admin123', 'admin', 'Drs. Petrus Kanisius Dadi (Admin Utama)', '197001011995011001', NULL, 'admin@smaksetiabakti.sch.id', '081238990112', NULL, NULL, 'Kepala Sekolah SMA Katolik Setia Bakti Ruteng, melayani pendidikan berkarakter Kristiani sejak 1995.', 'Jl. Komodo No. 1, Ruteng, Manggarai, NTT'),
('usr-wali-1', 'walikelas', 'wali123', 'wali_kelas', 'Theresia Imelda Ndua, S.Pd., M.Si.', '198811202015022004', NULL, 'theresia.ndua@smaksetiabakti.sch.id', '081339102834', 'X-MIPA 1', 'Fisika Terapan & Astronomi', 'Wali Kelas X-MIPA 1. Komitmen membina kedisiplinan dan capaian akademik peserta didik.', 'Ruteng, Manggarai, NTT'),
('usr-mapel-1', 'gurumapel', 'mapel123', 'guru_mapel', 'Drs. Fransiskus Xaverius, M.Pd.', '198504122010011012', NULL, 'fransiskus.xaverius@smaksetiabakti.sch.id', '082145890231', 'X-MIPA 1', 'Biologi & Bioteknologi', 'Guru Biologi & Pembina Tim Olimpiade Sains Nasional (OSN) Kebumian & Hayati.', 'Karot, Ruteng, NTT'),
('usr-siswa-1', '0078129011', 'siswa123', 'siswa', 'Yohanes Maria Vianney Ndau', NULL, '0078129011', 'yohanes.ndau@siswa.smak.sch.id', '082237890123', 'X-MIPA 1', NULL, 'Siswa Kelas X-MIPA 1, Ketua Divisi Penelitian Sains OSIS.', 'Jl. Kartini, Ruteng'),
('usr-ortu-1', 'ortu_0078129011', 'ortu123', 'orangtua', 'Bpk. Antonius Ngganggu', NULL, '0078129011', 'anton.ngganggu@gmail.com', '081338712399', 'X-MIPA 1', NULL, 'Wali/Orang Tua dari Yohanes Maria Vianney Ndau.', 'Jl. Kartini No. 14, Ruteng');

-- ------------------------------------------------------------------------------
-- 2. TABEL: students (Data Induk Peserta Didik)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `students` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `nisn` VARCHAR(32) NOT NULL UNIQUE,
  `nis` VARCHAR(32) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `gender` ENUM('L', 'P') NOT NULL,
  `class_name` VARCHAR(50) NOT NULL,
  `major` VARCHAR(100) NOT NULL,
  `gpa` DECIMAL(4,2) DEFAULT '0.00',
  `attendance_rate` INT DEFAULT 100,
  `status` VARCHAR(50) DEFAULT 'Aktif',
  `phone` VARCHAR(32) DEFAULT NULL,
  `parent_phone` VARCHAR(32) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABEL: teachers (Dewan Guru & Tenaga Kependidikan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `teachers` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `nip` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `status` VARCHAR(50) DEFAULT 'PNS / Yayasan',
  `email` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(32) DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `education` VARCHAR(150) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABEL: news (Warta & Berita Sekolah)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `news` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `author` VARCHAR(100) NOT NULL,
  `published_date` DATE NOT NULL,
  `cover_image` TEXT DEFAULT NULL,
  `views` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABEL: events (Agenda & Kalender Pendidikan)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `date` VARCHAR(100) NOT NULL,
  `time` VARCHAR(100) DEFAULT NULL,
  `location` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'Akademik',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABEL: ppdb_registrations (Pendaftaran Calon Siswa Baru Online)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ppdb_registrations` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `registration_number` VARCHAR(64) NOT NULL UNIQUE,
  `student_name` VARCHAR(150) NOT NULL,
  `nisn` VARCHAR(32) NOT NULL,
  `gender` ENUM('L', 'P') NOT NULL,
  `origin_school` VARCHAR(150) NOT NULL,
  `chosen_major` VARCHAR(100) NOT NULL,
  `average_score` DECIMAL(4,2) DEFAULT '0.00',
  `status` ENUM('Menunggu Verifikasi', 'Lolos Berkas', 'Lolos Seleksi', 'Ditolak') DEFAULT 'Menunggu Verifikasi',
  `parent_phone` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABEL: teacher_admin_docs (Administrasi Guru Mapel: CP s/d RPM 1 File PDF)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `teacher_admin_docs` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `teacher_id` VARCHAR(64) NOT NULL,
  `teacher_name` VARCHAR(150) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `target_class` VARCHAR(50) NOT NULL,
  `category` VARCHAR(150) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `academic_year` VARCHAR(32) NOT NULL,
  `semester` ENUM('Ganjil', 'Genap') NOT NULL,
  `file_url` TEXT NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(32) DEFAULT NULL,
  `file_type` VARCHAR(16) DEFAULT 'PDF',
  `bundle_components` JSON DEFAULT NULL,
  `uploaded_at` VARCHAR(64) NOT NULL,
  `status` ENUM('Menunggu Verifikasi', 'Disetujui', 'Perlu Perbaikan') DEFAULT 'Menunggu Verifikasi',
  `supervision_score` INT DEFAULT NULL,
  `verifier_notes` TEXT DEFAULT NULL,
  `verified_by` VARCHAR(150) DEFAULT NULL,
  `verified_at` VARCHAR(64) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 8. TABEL: study_materials (Bahan Ajar & Modul Belajar Digital)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `study_materials` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `subject` VARCHAR(100) NOT NULL,
  `target_class` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_size` VARCHAR(32) DEFAULT NULL,
  `file_url` TEXT NOT NULL,
  `author_teacher` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 9. TABEL: assignments & submissions (Tugas & Pengumpulan Siswa)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `assignments` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `subject` VARCHAR(100) NOT NULL,
  `target_class` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `instruction` TEXT NOT NULL,
  `deadline` VARCHAR(64) NOT NULL,
  `teacher_name` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `assignment_submissions` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `assignment_id` VARCHAR(64) NOT NULL,
  `student_nisn` VARCHAR(32) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `class_name` VARCHAR(50) NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `submitted_at` VARCHAR(64) NOT NULL,
  `score` INT DEFAULT NULL,
  `feedback` TEXT DEFAULT NULL,
  `status` ENUM('Terkirim', 'Dinilai', 'Perlu Revisi') DEFAULT 'Terkirim',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 10. TABEL: wali_notes & leave_requests (Interaksi Wali Kelas & Orang Tua)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `wali_notes` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `class_name` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `date` VARCHAR(64) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `leave_requests` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `student_nisn` VARCHAR(32) NOT NULL,
  `student_name` VARCHAR(150) NOT NULL,
  `class_name` VARCHAR(50) NOT NULL,
  `type` ENUM('Sakit', 'Izin Keluarga', 'Lainnya') NOT NULL,
  `start_date` VARCHAR(32) NOT NULL,
  `end_date` VARCHAR(32) NOT NULL,
  `reason` TEXT NOT NULL,
  `parent_phone` VARCHAR(32) NOT NULL,
  `status` ENUM('Menunggu Persetujuan', 'Disetujui', 'Ditolak') DEFAULT 'Menunggu Persetujuan',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 11. TABEL: app_settings (Pengaturan Identitas & Profil Sekolah)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `app_settings` (
  `setting_key` VARCHAR(100) NOT NULL PRIMARY KEY,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
