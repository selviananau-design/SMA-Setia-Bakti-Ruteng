export type UserRole = 'public' | 'admin' | 'guru' | 'orangtua';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  readTime: string;
}

export interface SchoolEvent {
  id: string;
  month: string;
  day: string;
  year: string;
  time: string;
  title: string;
  location: string;
  description: string;
  category: 'Akademik' | 'Keagamaan' | 'Kesiswaan' | 'Ujian' | 'Rapat';
}

export interface Student {
  id: string;
  nisn: string;
  nik: string; // Sensitif - Terenkripsi
  name: string;
  gender: 'L' | 'P';
  classLevel: 'X' | 'XI' | 'XII';
  className: string; // e.g., 'X-MIPA 1'
  major: 'MIPA' | 'IPS' | 'Bahasa & Budaya';
  status: 'aktif' | 'alumni';
  graduationYear?: number;
  phone: string; // Sensitif - Terenkripsi
  parentName: string;
  parentPhone: string; // Sensitif - Terenkripsi
  address: string;
  gpa: number; // Nilai Rata-rata
  attendanceRate: number; // %
  tuitionStatus: 'Lunas' | 'Menunggak' | 'Beasiswa';
  encryptedHash: string;
  alumniOccupation?: string;
  alumniCampus?: string;
}

export interface TeacherStaff {
  id: string;
  nip: string;
  nuptk: string;
  name: string;
  role: 'Kepala Sekolah' | 'Wakil Kepala Sekolah' | 'Guru Tetap' | 'Guru BK' | 'Staf Tata Usaha' | 'Laboran/Pustakawan';
  subject: string;
  department: 'MIPA' | 'IPS & Bahasa' | 'Agama & Budi Pekerti' | 'Kesiswaan & BK' | 'Tata Usaha';
  education: string;
  email: string;
  phone: string;
  bio: string;
  photoUrl: string;
}

export interface PPDBRegistration {
  id: string;
  regNumber: string;
  fullName: string;
  nisn: string;
  originSchool: string;
  chosenMajor: 'MIPA' | 'IPS' | 'Bahasa & Budaya';
  gender: 'L' | 'P';
  parentName: string;
  parentPhone: string;
  parentIncome: string;
  averageScore: number;
  registeredDate: string;
  status: 'Menunggu Verifikasi' | 'Berkas Lengkap' | 'Diterima' | 'Perlu Perbaikan';
  documents: {
    ijazah: boolean;
    kartuKeluarga: boolean;
    raporSMP: boolean;
    pasFoto: boolean;
  };
  notes?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  priority: 'urgent' | 'akademik' | 'info' | 'kegiatan';
  target: 'all' | 'guru' | 'orangtua' | 'siswa';
  isRead: boolean;
  link?: string;
  linkTab?: string;
}

export type NewsArticle = NewsItem;

export interface UserSession {
  role: UserRole;
  name: string;
  identifier: string; // NIP or NISN or Admin username
  token: string;
  email?: string;
  childNisn?: string; // for parent
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Rohani' | 'Seni & Budaya' | 'Olahraga' | 'Prestasi';
  date: string;
  imageUrl: string;
  description: string;
}
