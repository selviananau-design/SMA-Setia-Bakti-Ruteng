/**
 * Layanan Template Excel & CSV untuk SMAK Setia Bakti Ruteng
 */

import { Student, TeacherStaff } from '../types';

export function downloadStudentTemplate() {
  const headers = [
    'NISN',
    'NIK',
    'NAMA_LENGKAP',
    'JENIS_KELAMIN(L/P)',
    'TINGKAT(X/XI/XII)',
    'NAMA_KELAS',
    'JURUSAN(MIPA/IPS/Bahasa & Budaya)',
    'STATUS(aktif/alumni)',
    'TAHUN_LULUS',
    'NO_HP_SISWA',
    'NAMA_ORANG_TUA',
    'NO_HP_ORANG_TUA',
    'ALAMAT_LENGKAP',
    'NILAI_RATA_RATA',
  ];

  const sampleRows = [
    [
      '0078129011',
      '5310021405070001',
      'Yohanes Maria Vianney',
      'L',
      'X',
      'X-MIPA 1',
      'MIPA',
      'aktif',
      '',
      '081234567890',
      'Antonius Ngganggu',
      '081398765432',
      'Jl. Ahmad Yani No. 12, Ruteng',
      '88.5',
    ],
    [
      '0067429188',
      '5310025608060002',
      'Maria Goretti Delsi',
      'P',
      'XI',
      'XI-IPS 2',
      'IPS',
      'aktif',
      '',
      '082199887766',
      'Elisabeth Djehadut',
      '082144332211',
      'Kel. Watu, Kec. Langke Rembong',
      '91.2',
    ],
    [
      '0045129933',
      '5310021903040003',
      'Fransiskus Xaverius Jaga',
      'L',
      'XII',
      'XII-MIPA 1',
      'MIPA',
      'alumni',
      '2024',
      '085211223344',
      'Silvester Jaga',
      '085299887766',
      'Jl. Motang Rua No. 45, Ruteng',
      '93.0',
    ],
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Template_Data_Siswa_SMAK_Setia_Bakti.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadTeacherTemplate() {
  const headers = [
    'NIP',
    'NUPTK',
    'NAMA_LENGKAP_GELAR',
    'JABATAN',
    'MATA_PELAJARAN',
    'DIVISI_DEPARTEMEN',
    'PENDIDIKAN_TERAKHIR',
    'EMAIL_RESMI',
    'NO_TELEPON',
  ];

  const sampleRows = [
    [
      '197508122002121003',
      '4356753655200022',
      'Drs. Petrus Kanisius Dadi, M.Pd.',
      'Kepala Sekolah',
      'Fisika Terapan',
      'MIPA',
      'S2 Magister Pendidikan Fisika - UNY',
      'petrus.dadi@smaksetiabakti.sch.id',
      '081238990011',
    ],
    [
      '198304152009032008',
      '8765432190123456',
      'Sr. Maria Anselma, S.Pd., S.Kom.',
      'Wakil Kepala Sekolah Bidang Kurikulum',
      'Informatika & Komputer',
      'MIPA',
      'S1 Pendidikan Komputer & S1 Teologi',
      'sr.anselma@smaksetiabakti.sch.id',
      '081399882233',
    ],
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...sampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Template_Data_Guru_Pegawai_SMAK_Setia_Bakti.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export data Guru & Pegawai ke Excel/CSV sesuai template resmi
export function exportTeachersToExcelTemplate(
  teachers: TeacherStaff[],
  filename = 'Data_Guru_Pegawai_SMAK_Setia_Bakti.csv'
) {
  const headers = [
    'NIP',
    'NUPTK',
    'NAMA_LENGKAP_GELAR',
    'JABATAN',
    'MATA_PELAJARAN',
    'DIVISI_DEPARTEMEN',
    'PENDIDIKAN_TERAKHIR',
    'EMAIL_RESMI',
    'NO_TELEPON',
    'BIO_RINGKAS',
  ];

  const rows = teachers.map((t) => [
    t.nip || '',
    t.nuptk || '',
    t.name || '',
    t.role || 'Guru Tetap',
    t.subject || '',
    t.department || 'MIPA',
    t.education || '',
    t.email || '',
    t.phone || '',
    (t.bio || '').replace(/"/g, '""'),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export data Siswa ke Excel/CSV sesuai template resmi 14+ kolom
export function exportStudentsToExcelTemplate(
  students: Student[],
  statusFilter = 'semua',
  filename = 'Data_Siswa_Lengkap_SMAK_Setia_Bakti.csv'
) {
  const filtered = statusFilter === 'semua' ? students : students.filter((s) => s.status === statusFilter);

  const headers = [
    'NISN',
    'NIK',
    'NAMA_LENGKAP',
    'JENIS_KELAMIN(L/P)',
    'TINGKAT(X/XI/XII)',
    'NAMA_KELAS',
    'JURUSAN(MIPA/IPS/Bahasa & Budaya)',
    'STATUS(aktif/alumni)',
    'TAHUN_LULUS',
    'NO_HP_SISWA',
    'NAMA_ORANG_TUA',
    'NO_HP_ORANG_TUA',
    'ALAMAT_LENGKAP',
    'NILAI_RATA_RATA',
    'KEHADIRAN(%)',
    'STATUS_SPP',
  ];

  const rows = filtered.map((s) => [
    s.nisn || '',
    s.nik || '',
    s.name || '',
    s.gender || 'L',
    s.classLevel || 'X',
    s.className || '',
    s.major || 'MIPA',
    s.status || 'aktif',
    s.graduationYear ? s.graduationYear.toString() : '',
    s.phone || '',
    s.parentName || '',
    s.parentPhone || '',
    (s.address || '').replace(/"/g, '""'),
    s.gpa ? s.gpa.toString() : '0',
    s.attendanceRate ? `${s.attendanceRate}%` : '100%',
    s.tuitionStatus || 'Lunas',
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export data yang ada ke CSV ringkas
export function exportCurrentStudentsToCSV(students: Student[], filename = 'Data_Siswa_SMAK_Setia_Bakti.csv') {
  exportStudentsToExcelTemplate(students, 'semua', filename);
}

export function exportStudentsToCSV(students: Student[], statusFilter = 'semua', filename = 'Data_Siswa_SMAK_Setia_Bakti.csv') {
  exportStudentsToExcelTemplate(students, statusFilter, filename);
}

// Parser Impor Data Guru dari Berkas CSV / Excel Template
export function parseTeachersFromCSV(csvText: string): TeacherStaff[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const results: TeacherStaff[] = [];
  // Baris pertama adalah header, mulai baris kedua
  for (let i = 1; i < lines.length; i++) {
    // Parser sederhana pemisah koma dengan dukungan tanda kutip
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (regex.lastIndex >= lines[i].length) break;
    }

    if (matches.length >= 3 && matches[2]) {
      results.push({
        id: `t-imp-${Date.now()}-${i}`,
        nip: matches[0] || '198501012010011005',
        nuptk: matches[1] || '1234567890123456',
        name: matches[2],
        role: (matches[3] as any) || 'Guru Tetap',
        subject: matches[4] || 'Mata Pelajaran Umum',
        department: (matches[5] as any) || 'MIPA',
        education: matches[6] || 'S1 Pendidikan',
        email: matches[7] || `${matches[2].toLowerCase().replace(/[^a-z]/g, '')}@smaksetiabakti.sch.id`,
        phone: matches[8] || '081234567890',
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80',
        bio: matches[9] || 'Tenaga pendidik profesional SMA Katolik Setia Bakti Ruteng.',
      });
    }
  }
  return results;
}

// Parser Impor Data Siswa dari Berkas CSV / Excel Template
export function parseStudentsFromCSV(csvText: string): Student[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const results: Student[] = [];
  for (let i = 1; i < lines.length; i++) {
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (regex.lastIndex >= lines[i].length) break;
    }

    if (matches.length >= 3 && (matches[0] || matches[2])) {
      const nisn = matches[0] || `00${Date.now().toString().slice(-8)}`;
      const name = matches[2] || `Siswa ${i}`;
      results.push({
        id: `s-imp-${Date.now()}-${i}`,
        nisn,
        nik: matches[1] || '5310021405070001',
        name,
        gender: matches[3] === 'P' ? 'P' : 'L',
        classLevel: (matches[4] as any) || 'X',
        className: matches[5] || 'X-MIPA 1',
        major: (matches[6] as any) || 'MIPA',
        status: matches[7] === 'alumni' ? 'alumni' : 'aktif',
        graduationYear: matches[8] ? parseInt(matches[8]) : undefined,
        phone: matches[9] || '081234567890',
        parentName: matches[10] || 'Orang Tua Siswa',
        parentPhone: matches[11] || '081398765432',
        address: matches[12] || 'Ruteng, Manggarai, Flores, NTT',
        gpa: parseFloat(matches[13]) || 85.0,
        attendanceRate: parseFloat(matches[14]?.replace('%', '')) || 98.0,
        tuitionStatus: (matches[15] as any) || 'Lunas',
        encryptedHash: `ENC-${Date.now()}-${nisn}`,
      });
    }
  }
  return results;
}

// 3. Template & Ekspor Khusus Data Alumni & Tracer Study
export function downloadAlumniTemplate() {
  const headers = [
    'NISN',
    'NIK',
    'NAMA_LENGKAP',
    'JENIS_KELAMIN(L/P)',
    'JURUSAN(MIPA/IPS/Bahasa & Budaya)',
    'TAHUN_LULUS',
    'PERGURUAN_TINGGI_KAMPUS',
    'PROFESI_PEKERJAAN_SAAT_INI',
    'NO_HP_WHATSAPP',
    'EMAIL_ALUMNI',
    'ALAMAT_DOMISILI',
    'NILAI_RATA_RATA_IJAZAH',
  ];

  const exampleRows = [
    [
      '0045129931',
      '5310021903040009',
      'dr. Fransiskus Xaverius Jaga, S.Ked.',
      'L',
      'MIPA',
      '2023',
      'Fakultas Kedokteran - Univ. Udayana / Undana',
      'Dokter Residen RSUD Ben Mboi Ruteng',
      '085211223344',
      'fransiskus.jaga@alumni.smaksetiabakti.sch.id',
      'Jl. Motang Rua No. 45, Ruteng',
      '96.5',
    ],
    [
      '0034129811',
      '5310024407030010',
      'Anastasia Priscilia Dadu, S.T., M.Sc.',
      'P',
      'MIPA',
      '2022',
      'Institut Teknologi Bandung (ITB)',
      'Arsitek & Konsultan Perencana Tata Kota',
      '081399881122',
      'anastasia.dadu@alumni.smaksetiabakti.sch.id',
      'Bandung / Ruteng',
      '95.0',
    ],
    [
      '0023129705',
      '5310020508020011',
      'Kapten Inf. Valensius Ndugu, S.Tr.Han.',
      'L',
      'IPS',
      '2021',
      'Akademi Militer (AKMIL) Magelang',
      'Perwira TNI AD - Kodam IX/Udayana',
      '082144556677',
      'valensius.ndugu@alumni.smaksetiabakti.sch.id',
      'Kupang / Ruteng',
      '92.8',
    ],
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...exampleRows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Template_Data_Alumni_SMAK_Setia_Bakti.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Ekspor Data Alumni ke Excel/CSV Sesuai Template Resmi
export function exportAlumniToExcelTemplate(
  alumniList: Student[],
  yearFilter = 'semua',
  filename = 'Data_Alumni_SMAK_Setia_Bakti.csv'
) {
  const filtered =
    yearFilter === 'semua'
      ? alumniList.filter((s) => s.status === 'alumni')
      : alumniList.filter(
          (s) => s.status === 'alumni' && s.graduationYear?.toString() === yearFilter
        );

  const headers = [
    'NISN',
    'NIK',
    'NAMA_LENGKAP',
    'JENIS_KELAMIN',
    'JURUSAN',
    'TAHUN_LULUS',
    'PERGURUAN_TINGGI_KAMPUS',
    'PROFESI_PEKERJAAN_SAAT_INI',
    'NO_HP_WHATSAPP',
    'NAMA_ORANG_TUA',
    'ALAMAT_DOMISILI',
    'NILAI_RATA_RATA_IJAZAH',
  ];

  const rows = filtered.map((a) => [
    a.nisn || '',
    a.nik || '',
    a.name || '',
    a.gender || 'L',
    a.major || 'MIPA',
    a.graduationYear ? a.graduationYear.toString() : '2023',
    (a.alumniCampus || '').replace(/"/g, '""'),
    (a.alumniOccupation || '').replace(/"/g, '""'),
    a.phone || '',
    a.parentName || '',
    (a.address || '').replace(/"/g, '""'),
    a.gpa ? a.gpa.toString() : '90.0',
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Parser Impor Data Alumni dari Berkas CSV / Excel Template
export function parseAlumniFromCSV(csvText: string): Student[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const results: Student[] = [];
  for (let i = 1; i < lines.length; i++) {
    const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      let val = match[1] || '';
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1).replace(/""/g, '"');
      }
      matches.push(val.trim());
      if (regex.lastIndex >= lines[i].length) break;
    }

    if (matches.length >= 3 && (matches[0] || matches[2])) {
      const nisn = matches[0] || `00${Date.now().toString().slice(-8)}`;
      const name = matches[2] || `Alumni ${i}`;
      const gradYear = matches[5] ? parseInt(matches[5]) : new Date().getFullYear() - 1;
      results.push({
        id: `alumni-imp-${Date.now()}-${i}`,
        nisn,
        nik: matches[1] || '5310021405070001',
        name,
        gender: matches[3] === 'P' ? 'P' : 'L',
        classLevel: 'XII',
        className: `Alumni-${matches[4] || 'MIPA'}`,
        major: (matches[4] as any) || 'MIPA',
        status: 'alumni',
        graduationYear: isNaN(gradYear) ? 2023 : gradYear,
        alumniCampus: matches[6] || 'Perguruan Tinggi Mandiri',
        alumniOccupation: matches[7] || 'Bekerja / Wiraswasta',
        phone: matches[8] || '081234567890',
        parentName: 'Alumni SMAK',
        parentPhone: '081234567890',
        address: matches[10] || 'Ruteng, Flores, NTT',
        gpa: parseFloat(matches[11]) || 90.0,
        attendanceRate: 100,
        tuitionStatus: 'Lunas',
        encryptedHash: `ENC-ALUMNI-${Date.now()}-${nisn}`,
      });
    }
  }
  return results;
}


