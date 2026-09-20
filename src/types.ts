export type UserRole = 'public' | 'admin' | 'guru' | 'siswa' | 'orangtua';

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
  isWaliKelas?: boolean;
  waliClassName?: string; // e.g., 'X-MIPA 1'
  teachingClasses?: string[]; // e.g., ['X-MIPA 1', 'X-MIPA 2', 'XI-MIPA 1']
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
  identifier: string; // NIP, NISN, or Admin username
  token: string;
  email?: string;
  childNisn?: string; // for parent
  className?: string; // for student or wali kelas
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Rohani' | 'Seni & Budaya' | 'Olahraga' | 'Prestasi';
  date: string;
  imageUrl: string;
  description: string;
}

// 1. Bahan Ajar dari Guru Mapel
export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  className: string; // e.g. 'X-MIPA 1'
  teacherName: string;
  teacherNip: string;
  uploadDate: string;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'ZIP';
  fileSize: string;
  downloadUrl: string;
  description: string;
}

// 2. Tugas dari Guru Mapel
export interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  className: string; // e.g. 'X-MIPA 1'
  teacherName: string;
  teacherNip: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  maxScore: number;
}

export type Assignment = StudentAssignment;

// 3. Pengumpulan Tugas Siswa
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  className: string;
  submittedAt: string;
  answerText: string;
  fileName?: string;
  fileSize?: string;
  grade?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  status: 'Menunggu Dinilai' | 'Sudah Dinilai' | 'Perlu Perbaikan' | 'Dinilai';
}

// 4. Catatan Penting Wali Kelas untuk Siswa & Orang Tua
export interface WaliKelasNote {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  className: string;
  teacherName: string;
  date: string;
  category: 'Akademik' | 'Kedisiplinan' | 'Bimbingan Karakter' | 'Apresiasi Prestasi' | 'Konsultasi';
  title: string;
  content: string;
  actionRequired?: string;
}

// 5. Pengajuan Izin / Sakit dari Orang Tua ke Wali Kelas
export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  className: string;
  parentName: string;
  parentPhone: string;
  type: 'Sakit' | 'Izin Urusan Keluarga' | 'Izin Kegiatan Luar' | 'Izin' | 'Lainnya';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  doctorLetterAttached: boolean;
  status: 'Menunggu Persetujuan' | 'Disetujui' | 'Ditolak';
  requestDate: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

// 6. Forum Diskusi Siswa dengan Guru Mapel atau Wali Kelas
export interface ClassDiscussion {
  id: string;
  type: 'mapel' | 'walikelas';
  topic: string;
  subject?: string;
  className: string;
  authorRole: 'guru' | 'siswa' | 'orangtua';
  authorName: string;
  createdAt: string;
  content: string;
  replies: {
    id: string;
    authorRole: 'guru' | 'siswa' | 'orangtua';
    authorName: string;
    createdAt: string;
    content: string;
  }[];
}

export type SubjectDiscussion = ClassDiscussion;
export type DiscussionReply = ClassDiscussion['replies'][number];

// 7. Ekstrakurikuler Siswa
export interface ExtracurricularActivity {
  id: string;
  name: string;
  category: 'Jurnalistik & Literasi' | 'Kepemimpinan' | 'Seni & Musik' | 'Olahraga' | 'Kemanusiaan & PMR' | 'Rohani' | string;
  coach: string;
  schedule: string;
  location: string;
  memberCount?: number;
  membersCount?: number;
  description: string;
  imageUrl?: string;
  icon?: string;
  achievements: string[];
}

export type Extracurricular = ExtracurricularActivity;

// 8. Karya Siswa (Cerpen, Puisi, Liputan Jurnalistik, Seni)
export interface StudentWork {
  id: string;
  title: string;
  type: 'Cerita' | 'Puisi' | 'Jurnalistik' | 'Esai' | 'Karya Seni' | string;
  category?: string;
  studentName: string;
  author?: string;
  studentClass: string;
  authorClass?: string;
  publishDate: string;
  date?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  likes: number;
  reads: number;
  commentsCount: number;
  status: 'Terbit' | 'Draf';
}

// 9. Jurusan & Peminatan (Dikelola Admin Utama)
export interface MajorProgram {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  description: string;
  totalStudents: number;
  curriculumHighlights: string[];
  careerProspects: string[];
  iconName?: string;
}

// 10. Profil Sekolah (Dikelola Admin Utama)
export interface SchoolProfile {
  name: string;
  npsn: string;
  accreditation: string;
  yayasan: string;
  principal: string;
  motto: string;
  vision: string;
  missions: string[];
  history: string;
  address: string;
  phone: string;
  email: string;
}
