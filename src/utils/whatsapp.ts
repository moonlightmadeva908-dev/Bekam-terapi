import { Patient, UserProfile } from '../types';

export function formatIndonesianPhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '628' + cleaned.substring(1);
  }
  return cleaned;
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function generateCuppingWhatsAppUrl(
  patient: Patient,
  therapist: UserProfile | null,
  overrideType?: 'post-care' | 'next-reminder'
): string {
  const targetPhone = formatIndonesianPhone(patient.phone);
  const therapistName = therapist?.name || 'Praktisi Bekam';
  const patientAddress = patient.address ? `\n📍 *Alamat Tujuan:* ${patient.address}` : '';

  let message = '';

  // 1. Pesan Pasca-Bekam (Sesuai format persis yang diminta user)
  // Digunakan secara bawaan untuk status "Sudah Bekam"
  if (patient.status === 'Sudah Bekam' && overrideType !== 'next-reminder') {
    const formattedLastDate = formatDateIndo(patient.lastCuppingDate || new Date().toISOString().split('T')[0]);

    message = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh,
Yth. Bpk/Ibu *${patient.name}*,

Alhamdulillah, terima kasih atas kepercayaannya menggunakan layanan kami pada hari ${formattedLastDate}.

🤲 *Doa Kesembuhan:*
Semoga Allah SWT melimpahkan kesembuhan paripurna dan membersihkan segala keluhan/penyakit.
_“Syafakallah / Syafakillah thohurun in syaa Allah.”_

📋 *Saran Perawatan Pasca-Bekam:*
1. Hindari mandi air dingin 2-3 jam ke depan (gunakan air hangat bila perlu).
2. Perbanyak minum air hangat atau air madu untuk rehidrasi.
3. Hindari begadang atau aktivitas fisik yang terlalu berat hari ini.
4. Jaga bekas titik kop bekam tetap bersih dan kering.

Barakallahu fiikum.

*${therapistName}*`;
  } 
  // 2. Pesan Pengingat Jadwal Bekam Selanjutnya (Jika dikirim saat waktu berbekam tiba)
  else if (overrideType === 'next-reminder') {
    const formattedNextDate = formatDateIndo(patient.nextCuppingDate);
    const formattedLastDate = formatDateIndo(patient.lastCuppingDate);

    message = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh,
Yth. Bpk/Ibu *${patient.name}*,

Semoga Bpk/Ibu dan keluarga senantiasa diberikan nikmat sehat wal 'afiat serta perlindungan dari Allah SWT.

Kami ingin mengabarkan bahwa **sudah waktunya berbekam kembali** untuk menjaga kebugaran tubuh, membersihkan racun (detoksifikasi rutin thibbun nabawi), dan mencegah penumpukan kolesterol/asam urat.

🗓️ *Rekomendasi Jadwal Bekam Selanjutnya:*
📅 *Tanggal:* ${formattedNextDate}
🏠 *Layanan:* Bekam Panggilan ke Rumah Anda (Door-to-Door)
${patient.lastCuppingDate ? `📌 *Terakhir Dibekam:* ${formattedLastDate}` : ''}

Rasulullah SAW bersabda:
_“Sesungguhnya sebaik-baik pengobatan yang kalian lakukan adalah berbekam.”_ (HR. Bukhari)

Apakah Bpk/Ibu berkenan untuk kami jadwalkan kunjungan bekam panggilan ke rumah pada tanggal tersebut?

Bila ingin menyesuaikan hari atau tanggal kedatangan kami ke rumah Bpk/Ibu, silakan balas pesan ini.

Terima kasih atas kepercayaannya.
Barakallahu fiikum.
Wassalamu'alaikum Warahmatullahi Wabarakatuh.

*${therapistName}*`;
  } 
  // 3. Status "Akan Bekam" -> Pengingat / Konfirmasi Kunjungan Rumah yang sudah disepakati
  else {
    const appointmentDate = patient.nextCuppingDate || patient.lastCuppingDate;
    const formattedAppointmentDate = formatDateIndo(appointmentDate);
    const arrivalTime = patient.nextCuppingTime ? ` pukul *${patient.nextCuppingTime} WIB*` : ' sesuai waktu yang disepakati';

    message = 
`Assalamu'alaikum Warahmatullahi Wabarakatuh,
Yth. Bpk/Ibu *${patient.name}*,

Mengingatkan kembali jadwal kunjungan bekam yang sudah di sepakati :

📅 *Hari / Tanggal Janji Bekam:* ${formattedAppointmentDate}
⏰ *Estimasi Jam Kedatangan:* ${arrivalTime}
${patientAddress}

🩺 *Persiapan Pasien Sebelum Terapis Tiba di Rumah:*
1. *Puasa Makan Berat:* Sebaiknya tidak makan makanan berat minimal 2 jam sebelum diterapi (perut tidak dalam kondisi kekenyangan).
2. *Kondisi Ruangan:* Mohon siapkan tempat/ruangan yang tenang dan bersih dengan alas kasur/matras ber-sprei bersih.
3. *Kebersihan Diri:* Disunnahkan mandi bersih sebelum sesi bekam dimulai.
4. *Pakaian Longgar:* Kenakan pakaian yang nyaman dan mudah dibuka di bagian punggung.
5. *Niat:* Luruskan niat berikhtiar mencari kesembuhan mengikuti sunnah Rasulullah SAW.

_Catatan: Seluruh perlengkapan bekam kami bawa dalam kondisi steril, kop higienis, dan jarum baru sekali pakai (disposable)._

Mohon konfirmasi kesiapan Bpk/Ibu atau petunjuk patokan rumah dengan membalas pesan ini. Terima kasih.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.
Salam hangat,
*${therapistName}*`;
  }

  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${targetPhone}?text=${encoded}`;
}
