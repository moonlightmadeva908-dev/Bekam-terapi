export type CuppingStatus = 'Sudah Bekam' | 'Akan Bekam';

export interface UserProfile {
  userId: string;
  name: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  bannerUrl?: string;
  bannerPosition?: 'top' | 'center' | 'bottom';
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  id: string;
  userId: string;
  name: string;
  address: string;
  phone: string;
  lastCuppingDate: string; // YYYY-MM-DD
  nextCuppingDate: string; // YYYY-MM-DD
  nextCuppingTime?: string; // HH:mm
  status: CuppingStatus;
  complaints?: string;
  cuppingPoints?: string;
  cuppingCount?: number; // Jumlah total sesi bekam yang telah dijalani pasien
  createdAt?: string;
  updatedAt?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export type ActiveTab = 'dashboard' | 'patients' | 'guide' | 'settings' | 'about';

export const SUNNAH_CUPPING_POINTS = [
  { id: 'al-kahil', name: 'Al-Kahil (Punduk / Tengkuk)', desc: 'Punggung atas antara kedua belikat, titik induk untuk 72 macam penyakit' },
  { id: 'al-akhdaain', name: 'Al-Akhda\'ain (Urat Leher)', desc: 'Dua urat di samping kiri & kanan leher, baik untuk pusing, mata, gigi' },
  { id: 'ummu-mughits', name: 'Ummu Mughits (Puncak Kepala)', desc: 'Titik puncak kepala, sangat baik untuk migrain, vertigo, ingatan' },
  { id: 'al-katifain', name: 'Al-Katifain (Kedua Bahu)', desc: 'Bahu kanan dan kiri, untuk pegal, asam urat, kolesterol' },
  { id: 'al-warik', name: 'Al-Warik (Pinggang)', desc: 'Area pinggang/ginjal, untuk sakit pinggang, nyeri saraf kejepit' },
  { id: 'al-qathan', name: 'Al-Qathan (Punggung Bawah)', desc: 'Antara punggung bawah dan tulang ekor' },
  { id: 'fakhdain', name: 'Al-Fakhdain (Kedua Paha)', desc: 'Paha bagian belakang' },
  { id: 'saqain', name: 'As-Saqain (Kedua Betis)', desc: 'Betis bagian belakang, memperlancar peredaran darah kaki' },
];
