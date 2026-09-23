export type UserRole = 'public' | 'admin' | 'guru' | 'guru_mapel' | 'wali_kelas' | 'siswa' | 'orangtua';

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
  nik: string;
  name: string;
  gender: 'L' | 'P';
  classLevel: 'X' | 'XI' | 'XII';
  className: string;
  major: 'MIPA' | 'IPS' | 'Bahasa & Budaya';
  status: 'aktif' | 'alumni';
  graduationYear?: number;
  phone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  gpa: number;
  attendanceRate: number;
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
  waliClassName?: string;
  teachingClasses?: string[];
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
  id?: string;
  role: UserRole;
  name: string;
  identifier: string;
  nip?: string;
  token: string;
  email?: string;
  childNisn?: string;
  className?: string;
  subject?: string;
  teacherType?: 'guru_mapel' | 'wali_kelas';
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Akademik' | 'Rohani' | 'Seni & Budaya' | 'Olahraga' | 'Prestasi';
  date: string;
  imageUrl: string;
  description: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacherName: string;
  teacherNip: string;
  uploadDate: string;
  fileType: 'PDF' | 'DOCX' | 'PPTX' | 'VIDEO' | 'ZIP';
  fileSize: string;
  downloadUrl: string;
  description: string;
}

export type TeacherAdminCategory =
  | 'Bundel Administrasi Lengkap (CP, ATP hingga RPM)'
  | 'Modul Ajar / RPP Merdeka'
  | 'Program Tahunan (Prota)'
  | 'Program Semester (Promes)'
  | 'Alur Tujuan Pembelajaran (ATP)'
  | 'KKTP / Kriteria Ketuntasan'
  | 'Jurnal Mengajar Harian'
  | 'Kisi-kisi & Asesmen Sumatif'
  | 'Buku Kerja Guru'
  | 'Silabus & Modul Suplemen';

export interface TeacherAdministrationDoc {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherNip: string;
  subject: string;
  targetClass: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  category: TeacherAdminCategory;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  fileType: 'PDF' | 'DOCX' | 'XLSX' | 'ZIP';
  uploadedAt: string;
  status: 'Menunggu Verifikasi' | 'Disetujui' | 'Perlu Perbaikan';
  verifiedBy?: string;
  verifiedAt?: string;
  feedbackNotes?: string;
  supervisionScore?: number;
  score?: number;
  bundleComponents?: string[];
}

export type TeacherAdminDocument = TeacherAdministrationDoc;

export interface SubjectAttendanceItem {
  studentId: string;
  studentName: string;
  studentNisn: string;
  nisn?: string;
  status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';
  notes?: string;
}

export interface SubjectAttendanceSession {
  id: string;
  subject: string;
  className: string;
  teacherName: string;
  teacherNip: string;
  teacherId?: string;
  meetingNumber: number;
  date: string;
  timeSlot?: string;
  topic: string;
  attendanceList: SubjectAttendanceItem[];
  items?: SubjectAttendanceItem[];
  summary: {
    total: number;
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
    percentage: number;
  };
  presentCount?: number;
  sickCount?: number;
  permitCount?: number;
  absentCount?: number;
  attendanceRate?: number;
  createdAt: string;
}

export interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  className: string;
  teacherName: string;
  teacherNip: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  maxScore: number;
}

export type Assignment = StudentAssignment;

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

// ==========================================================
// 10. Profil Sekolah (Dikelola Admin Utama)
// ==========================================================
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
  logoUrl?: string;
  heroImageUrl?: string;
  principalPhotoUrl?: string;
  // ==========================================================
  // FIELD BARU: Foto yang dapat diubah dari Admin Panel
  // ==========================================================
  historyPhotoUrl?: string;        // Foto di tab "Sejarah & Identitas"
  historyPhotoCaption?: string;    // Keterangan foto sejarah
  facilityPhotos?: {
    id: string;
    title: string;
    desc: string;
    img: string;
    tag: string;
  }[];                             // Foto-foto di tab "Fasilitas"
}

export interface AdminSidebarConfig {
  logoType: 'icon' | 'image';
  logoUrl?: string;
  presetIcon?: 'graduation' | 'cross' | 'book' | 'shield' | 'award';
  logoShape?: 'rounded' | 'circle' | 'square';
  title: string;
  subtitle: string;
  tagline?: string;
  adminRoleLabel?: string;
  statusBadgeText?: string;
  themeAccent?: 'indigo' | 'blue' | 'purple' | 'emerald' | 'amber';
}

export interface HeroSlide {
  id: string;
  url: string;
  title: string;
  caption?: string;
}

export interface QuickFeatureCard {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'briefcase' | 'plane' | 'user' | 'book' | 'award' | 'grad';
  targetTab: string;
}

export interface QuickStatItem {
  id: string;
  value: string;
  label: string;
  sublabel: string;
  iconType: 'users' | 'book' | 'grad' | 'award';
}

export interface WhyChooseUsPillar {
  id: string;
  title: string;
  desc: string;
  iconType: 'lightbulb' | 'globe' | 'compass' | 'heart' | 'book' | 'award';
}

export interface HomepageWelcomeSection {
  enabled: boolean;
  badge: string;
  title: string;
  quote: string;
  principalName: string;
  principalRole: string;
  principalPhotoUrl?: string;
}

export interface HomepageConfig {
  heroEyebrow: string;
  heroHeadline: string;
  heroHeadlineHighlight?: string;
  heroSubtitle: string;
  heroCtaText: string;
  heroCtaTab: string;
  heroSlides: HeroSlide[];

  featureCards: QuickFeatureCard[];

  quickStats: QuickStatItem[];

  welcomeSection: HomepageWelcomeSection;

  whyChooseUs: {
    eyebrow: string;
    title: string;
    description: string;
    ctaText: string;
    ctaTab: string;
    pillars: WhyChooseUsPillar[];
  };

  announcementBar: {
    enabled: boolean;
    badgeText: string;
    message: string;
    linkText?: string;
    targetTab?: string;
  };
}