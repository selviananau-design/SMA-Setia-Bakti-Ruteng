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

// Export data yang ada ke CSV
export function exportCurrentStudentsToCSV(students: Student[], filename = 'Data_Siswa_SMAK_Setia_Bakti.csv') {
  const headers = ['NISN', 'NAMA', 'GENDER', 'KELAS', 'JURUSAN', 'STATUS', 'GPA', 'KEHADIRAN'];
  const rows = students.map((s) => [
    s.nisn,
    s.name,
    s.gender,
    s.className,
    s.major,
    s.status,
    s.gpa.toString(),
    `${s.attendanceRate}%`,
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

export function exportStudentsToCSV(students: Student[], statusFilter = 'semua', filename = 'Data_Siswa_SMAK_Setia_Bakti.csv') {
  const filtered = statusFilter === 'semua' ? students : students.filter((s) => s.status === statusFilter);
  exportCurrentStudentsToCSV(filtered, filename);
}

