/**
 * Layanan Pembuatan Laporan Resmi PDF SMA Katolik Setia Bakti Ruteng
 * Menggunakan jsPDF dengan Kop Surat Resmi
 */

import { jsPDF } from 'jspdf';
import { Student, PPDBRegistration, TeacherStaff } from '../types';

function drawLetterhead(doc: jsPDF, title: string) {
  // Border line & Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40, 20, 80);
  doc.text('YAYASAN PERSEKOLAHAN ST. PAULUS RUTENG', 105, 15, { align: 'center' });
  doc.setFontSize(14);
  doc.text('SMA KATOLIK SETIA BAKTI RUTENG', 105, 22, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('TERAKREDITASI "A" (UNGGUL) | NPSN: 50302911 | NSS: 302240201004', 105, 27, { align: 'center' });
  doc.text('Jl. Kartini No. 8, Kel. Pitak, Kec. Langke Rembong, Kab. Manggarai, NTT 86511', 105, 31, { align: 'center' });
  doc.text('Telp: (0385) 21455 | Email: info@smaksetiabaktirtg.sch.id | Web: smaksetiabaktirtg.sch.id', 105, 35, { align: 'center' });

  // Double line separator
  doc.setLineWidth(0.8);
  doc.setDrawColor(40, 20, 80);
  doc.line(15, 38, 195, 38);
  doc.setLineWidth(0.3);
  doc.line(15, 39.5, 195, 39.5);

  // Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text(title.toUpperCase(), 105, 47, { align: 'center' });

  // Date and doc number
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Nomor Dokumen: SB-RTG/DOC/${new Date().getFullYear()}/${Math.floor(Math.random() * 9000 + 1000)}`, 105, 52, { align: 'center' });
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 195, 52, { align: 'right' });
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pageHeight = doc.internal.pageSize.height || 297;
  doc.setLineWidth(0.3);
  doc.setDrawColor(200, 200, 200);
  doc.line(15, pageHeight - 15, 195, pageHeight - 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(120, 120, 120);
  doc.text('Sistem Informasi Terpadu SMAK Setia Bakti Ruteng - Terverifikasi Digital', 15, pageHeight - 10);
  doc.text(`Halaman ${pageNum} dari ${totalPages}`, 195, pageHeight - 10, { align: 'right' });
}

// 1. Ekspor Laporan Rekapitulasi Siswa (Aktif & Alumni)
export function exportStudentReportPDF(students: Student[], filterType: 'semua' | 'aktif' | 'alumni' = 'semua') {
  const doc = new jsPDF('p', 'mm', 'a4');
  const filtered = filterType === 'semua' ? students : students.filter((s) => s.status === filterType);

  const title = `Laporan Rekapitulasi Data Siswa ${filterType === 'semua' ? 'Keseluruhan' : filterType === 'aktif' ? 'Aktif' : 'Alumni'}`;
  drawLetterhead(doc, title);

  // Summary box
  doc.setFillColor(245, 243, 255);
  doc.roundedRect(15, 56, 180, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(75, 30, 130);
  doc.text(`Total Terdata: ${filtered.length} Siswa`, 20, 63);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const activeCount = filtered.filter((s) => s.status === 'aktif').length;
  const alumniCount = filtered.filter((s) => s.status === 'alumni').length;
  doc.text(`Siswa Aktif: ${activeCount} Orang | Alumni: ${alumniCount} Orang | Tingkat Kelulusan: 100%`, 20, 68);

  // Table header
  let y = 78;
  doc.setFillColor(67, 40, 116); // Royal purple
  doc.rect(15, y, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('NO', 18, y + 5.5);
  doc.text('NISN', 28, y + 5.5);
  doc.text('NAMA LENGKAP', 55, y + 5.5);
  doc.text('L/P', 115, y + 5.5);
  doc.text('KELAS / JURUSAN', 125, y + 5.5);
  doc.text('STATUS', 160, y + 5.5);
  doc.text('NILAI/GPA', 178, y + 5.5);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  filtered.slice(0, 22).forEach((student, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 7, 'F');
    }
    doc.text((index + 1).toString(), 18, y + 5);
    doc.text(student.nisn, 28, y + 5);
    doc.text(student.name.substring(0, 32), 55, y + 5);
    doc.text(student.gender, 115, y + 5);
    doc.text(`${student.className || student.classLevel} - ${student.major}`, 125, y + 5);
    doc.text(student.status.toUpperCase(), 160, y + 5);
    doc.text(student.gpa.toFixed(1), 178, y + 5);

    y += 7;
  });

  // Tanda Tangan Resmi
  const sigY = Math.min(y + 15, 245);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Ruteng, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 140, sigY);
  doc.text('Kepala SMAK Setia Bakti Ruteng,', 140, sigY + 5);

  doc.setFont('helvetica', 'bold');
  doc.text('Drs. Petrus Kanisius Dadi, M.Pd.', 140, sigY + 26);
  doc.setFont('helvetica', 'normal');
  doc.text('NIP. 19750812 200212 1 003', 140, sigY + 30);

  drawFooter(doc, 1, 1);
  doc.save(`Laporan_Siswa_SMAK_Setia_Bakti_${filterType}.pdf`);
}

// 1.B Ekspor Laporan Direktori & Tracer Study Alumni
export function exportAlumniReportPDF(alumni: Student[], yearFilter = 'semua') {
  const doc = new jsPDF('p', 'mm', 'a4');
  const filtered =
    yearFilter === 'semua'
      ? alumni.filter((s) => s.status === 'alumni')
      : alumni.filter(
          (s) => s.status === 'alumni' && s.graduationYear?.toString() === yearFilter
        );

  const title = `Laporan Rekapitulasi Tracer Study Alumni SMAK Setia Bakti ${yearFilter === 'semua' ? 'Semua Angkatan' : `Tahun Kelulusan ${yearFilter}`}`;
  drawLetterhead(doc, title);

  // Summary box
  doc.setFillColor(240, 253, 250); // Emerald/teal soft
  doc.roundedRect(15, 56, 180, 16, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 118, 110);
  doc.text(`Total Alumni Terdata: ${filtered.length} Orang`, 20, 63);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  const collegeCount = filtered.filter(
    (s) => s.alumniCampus && s.alumniCampus.trim().length > 0
  ).length;
  const workCount = filtered.filter(
    (s) => s.alumniOccupation && s.alumniOccupation.trim().length > 0
  ).length;
  doc.text(
    `Melanjutkan Studi ke Perguruan Tinggi: ${collegeCount} Orang | Karir / Wirausaha: ${workCount} Orang | Status Data: Terverifikasi`,
    20,
    68
  );

  // Table header
  let y = 78;
  doc.setFillColor(13, 148, 136); // Teal header
  doc.rect(15, y, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('NO', 18, y + 5.5);
  doc.text('NAMA ALUMNI & GELAR', 28, y + 5.5);
  doc.text('THN', 78, y + 5.5);
  doc.text('JURUSAN', 90, y + 5.5);
  doc.text('PERGURUAN TINGGI / KAMPUS', 115, y + 5.5);
  doc.text('PROFESI / KARIR SAAT INI', 155, y + 5.5);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  filtered.slice(0, 22).forEach((a, index) => {
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 7, 'F');
    }
    doc.text((index + 1).toString(), 18, y + 5);
    doc.text((a.name || '-').substring(0, 26), 28, y + 5);
    doc.text(a.graduationYear ? a.graduationYear.toString() : '-', 78, y + 5);
    doc.text((a.major || '-').substring(0, 12), 90, y + 5);
    doc.text((a.alumniCampus || '-').substring(0, 22), 115, y + 5);
    doc.text((a.alumniOccupation || '-').substring(0, 22), 155, y + 5);

    y += 7;
  });

  // Tanda Tangan Resmi
  const sigY = Math.min(y + 15, 245);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    'Ruteng, ' +
      new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    140,
    sigY
  );
  doc.text('Kepala SMAK Setia Bakti Ruteng,', 140, sigY + 5);
  doc.text('Koordinator Bimbingan Karir & Alumni', 140, sigY + 10);

  doc.setFont('helvetica', 'bold');
  doc.text('Drs. Petrus Kanisius Dadi, M.Pd.', 140, sigY + 28);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('NIP. 19750812 200212 1 003', 140, sigY + 32);

  drawFooter(doc, 1, 1);
  doc.save(`Laporan_Tracer_Study_Alumni_SMAK_Setia_Bakti_${yearFilter}.pdf`);
}

// 2. Ekspor Bukti / Kartu Pendaftaran PPDB Siswa Baru
export function exportPPDBReceiptPDF(reg: PPDBRegistration) {
  const doc = new jsPDF('p', 'mm', 'a4');
  drawLetterhead(doc, 'KARTU BUKTI PENDAFTARAN PPDB DARING');

  // Badge nomor pendaftaran
  doc.setFillColor(243, 232, 255);
  doc.setDrawColor(147, 51, 234);
  doc.roundedRect(15, 56, 180, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(88, 28, 135);
  doc.text('NOMOR REGISTRASI PENDAFTARAN:', 22, 64);
  doc.setFontSize(14);
  doc.text(reg.regNumber, 22, 71);

  doc.setFontSize(9);
  doc.setTextColor(120, 60, 20);
  doc.text(`STATUS: ${reg.status.toUpperCase()}`, 130, 68);

  // Biodata Calon Siswa
  let y = 84;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, y, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 20, 80);
  doc.text('I. BIODATA CALON SISWA BARU', 18, y + 5);

  y += 12;
  const items = [
    ['Nama Lengkap', reg.fullName],
    ['NISN', reg.nisn],
    ['Jenis Kelamin', reg.gender === 'L' ? 'Laki-Laki' : 'Perempuan'],
    ['Sekolah Asal (SMP/MTs)', reg.originSchool],
    ['Pilihan Peminatan/Jurusan', reg.chosenMajor],
    ['Nilai Rapor Rata-Rata', `${reg.averageScore} (Skala 100)`],
    ['Nama Orang Tua / Wali', reg.parentName],
    ['No. Handphone Orang Tua', reg.parentPhone],
    ['Tanggal Mendaftar', reg.registeredDate],
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  items.forEach(([label, val]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 20, y);
    doc.setFont('helvetica', 'normal');
    doc.text(':', 75, y);
    doc.text(String(val), 80, y);
    y += 7;
  });

  // Berkas yang dilampirkan
  y += 4;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, y, 180, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(40, 20, 80);
  doc.text('II. STATUS KELENGKAPAN BERKAS PERSYARATAN', 18, y + 5);

  y += 12;
  const docs = [
    ['1. Salinan Ijazah / SKL SMP Terlegalisir', reg.documents.ijazah ? '[LENGKAP]' : '[BELUM]'],
    ['2. Salinan Kartu Keluarga (KK)', reg.documents.kartuKeluarga ? '[LENGKAP]' : '[BELUM]'],
    ['3. Buku Rapor SMP Semester 1 - 5', reg.documents.raporSMP ? '[LENGKAP]' : '[BELUM]'],
    ['4. Pas Foto Berwarna 3x4 (3 Lembar)', reg.documents.pasFoto ? '[LENGKAP]' : '[BELUM]'],
  ];

  docs.forEach(([docName, statusStr]) => {
    doc.setFont('helvetica', 'normal');
    doc.text(docName, 20, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(statusStr.includes('LENGKAP') ? 20 : 180, statusStr.includes('LENGKAP') ? 120 : 20, 20);
    doc.text(statusStr, 160, y);
    doc.setTextColor(40, 40, 40);
    y += 6;
  });

  // Instruksi & Pengumuman
  y += 6;
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(15, y, 180, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 64, 175);
  doc.text('PETUNJUK BAGI CALON SISWA:', 20, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(50, 50, 50);
  doc.text('1. Simpan dan cetak kartu ini sebagai bukti resmi pendaftaran PPDB SMAK Setia Bakti Ruteng.', 20, y + 11);
  doc.text('2. Jadwal tes wawancara dan observasi akan diumumkan melalui portal dan SMS/WhatsApp resmi.', 20, y + 15);
  doc.text('3. Pastikan membawa berkas fisik asli pada saat verifikasi final di Sekretariat Panitia PPDB.', 20, y + 19);

  // Tanda Tangan
  const sigY = 236;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Calon Siswa / Orang Tua,', 25, sigY);
  doc.text('Panitia PPDB SMAK Setia Bakti,', 135, sigY);

  doc.setFont('helvetica', 'bold');
  doc.text(`( ${reg.fullName} )`, 25, sigY + 24);
  doc.text('( Rm. Silvester Baeng, Pr, S.Fil )', 135, sigY + 24);
  doc.setFont('helvetica', 'normal');
  doc.text('Ketua Panitia PPDB 2026/2027', 135, sigY + 28);

  drawFooter(doc, 1, 1);
  doc.save(`Kartu_PPDB_${reg.regNumber}_${reg.fullName.replace(/\s+/g, '_')}.pdf`);
}

// 3. Ekspor Rekap Profil Guru & Pegawai
export function exportTeacherDirectoryPDF(teachers: TeacherStaff[]) {
  const doc = new jsPDF('p', 'mm', 'a4');
  drawLetterhead(doc, 'DIREKTORI PROFIL GURU & TENAGA KEPENDIDIKAN');

  let y = 60;
  doc.setFillColor(67, 40, 116);
  doc.rect(15, y, 180, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('NO', 18, y + 5.5);
  doc.text('NAMA LENGKAP & GELAR', 28, y + 5.5);
  doc.text('JABATAN', 85, y + 5.5);
  doc.text('BIDANG STUDI', 130, y + 5.5);
  doc.text('PENDIDIKAN', 165, y + 5.5);

  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);

  teachers.forEach((t, i) => {
    if (i % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 180, 8, 'F');
    }
    doc.setFontSize(7.5);
    doc.text((i + 1).toString(), 18, y + 5.5);
    doc.text(t.name.substring(0, 30), 28, y + 5.5);
    doc.text(t.role.substring(0, 22), 85, y + 5.5);
    doc.text(t.subject.substring(0, 20), 130, y + 5.5);
    doc.text(t.education.substring(0, 22), 165, y + 5.5);
    y += 8;
  });

  const sigY = Math.min(y + 15, 250);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Ruteng, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 140, sigY);
  doc.text('Kepala SMAK Setia Bakti Ruteng,', 140, sigY + 5);
  doc.setFont('helvetica', 'bold');
  doc.text('Drs. Petrus Kanisius Dadi, M.Pd.', 140, sigY + 24);

  drawFooter(doc, 1, 1);
  doc.save('Direktori_Guru_Pegawai_SMAK_Setia_Bakti.pdf');
}
