import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Patient, CuppingStatus, UserProfile } from '../types';

const INITIAL_DEMO_PATIENTS: Patient[] = [
  {
    id: 'demo-1',
    userId: 'demo_praktisi_bekam',
    name: 'Bpk. Hendra Gunawan',
    address: 'Jl. Melati No. 15, Jakarta Selatan',
    phone: '081298765432',
    lastCuppingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextCuppingDate: new Date().toISOString().split('T')[0], // Hari ini
    nextCuppingTime: '09:30',
    status: 'Akan Bekam',
    complaints: 'Kerap merasa tegang di bagian leher belakang dan migrain ringan sehabis bekerja.',
    cuppingPoints: 'Al-Kahil, Al-Akhda\'ain, Ummu Mughits',
    cuppingCount: 2,
  },
  {
    id: 'demo-2',
    userId: 'demo_praktisi_bekam',
    name: 'Ibu Hj. Siti Nurhaliza',
    address: 'Komplek Permata Hijau Blok C-4',
    phone: '085712345678',
    lastCuppingDate: new Date().toISOString().split('T')[0],
    nextCuppingDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextCuppingTime: '13:00',
    status: 'Sudah Bekam',
    complaints: 'Pegal linu di kedua bahu dan riwayat kolesterol tinggi.',
    cuppingPoints: 'Al-Kahil, Al-Katifain, Al-Warik',
    cuppingCount: 5,
  },
  {
    id: 'demo-3',
    userId: 'demo_praktisi_bekam',
    name: 'Bpk. Rahmat Hidayat',
    address: 'Jl. Sukajadi No. 88, Bandung',
    phone: '081387654321',
    lastCuppingDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextCuppingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextCuppingTime: '15:30',
    status: 'Akan Bekam',
    complaints: 'Sakit pinggang bawah dan kesemutan di area kaki.',
    cuppingPoints: 'Al-Warik, Al-Qathan, As-Saqain',
    cuppingCount: 1,
  },
];

const getLocalDemoPatients = (): Patient[] => {
  const stored = localStorage.getItem('bekam_demo_patients');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  localStorage.setItem('bekam_demo_patients', JSON.stringify(INITIAL_DEMO_PATIENTS));
  return INITIAL_DEMO_PATIENTS;
};

const saveLocalDemoPatients = (list: Patient[]) => {
  localStorage.setItem('bekam_demo_patients', JSON.stringify(list));
};

export const subscribePatients = (
  userId: string,
  onData: (patients: Patient[]) => void,
  onError: (error: Error) => void
) => {
  // If demo mode
  if (userId.startsWith('demo_')) {
    onData(getLocalDemoPatients());
    const interval = setInterval(() => {
      onData(getLocalDemoPatients());
    }, 1000);
    return () => clearInterval(interval);
  }

  const collectionPath = `users/${userId}/patients`;
  const q = query(collection(db, collectionPath), orderBy('nextCuppingDate', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const list: Patient[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          userId: data.userId || userId,
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          lastCuppingDate: data.lastCuppingDate || '',
          nextCuppingDate: data.nextCuppingDate || '',
          nextCuppingTime: data.nextCuppingTime || '',
          status: (data.status as CuppingStatus) || 'Akan Bekam',
          complaints: data.complaints || '',
          cuppingPoints: data.cuppingPoints || '',
          cuppingCount: data.cuppingCount !== undefined ? Number(data.cuppingCount) : 1,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
        };
      });
      onData(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, collectionPath);
      } catch (e: any) {
        onError(e);
      }
    }
  );
};

export const addPatient = async (
  userId: string,
  patientData: Omit<Patient, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  if (userId.startsWith('demo_')) {
    const list = getLocalDemoPatients();
    const id = `demo-${Date.now()}`;
    const newPatient: Patient = {
      ...patientData,
      id,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(newPatient);
    saveLocalDemoPatients(list);
    return id;
  }

  const collectionPath = `users/${userId}/patients`;
  try {
    const docRef = await addDoc(collection(db, collectionPath), {
      ...patientData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, collectionPath);
  }
};

export const updatePatient = async (
  userId: string,
  patientId: string,
  patientData: Partial<Patient>
): Promise<void> => {
  if (userId.startsWith('demo_')) {
    const list = getLocalDemoPatients();
    const index = list.findIndex((p) => p.id === patientId);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        ...patientData,
        updatedAt: new Date().toISOString(),
      };
      saveLocalDemoPatients(list);
    }
    return;
  }

  const docPath = `users/${userId}/patients/${patientId}`;
  try {
    const ref = doc(db, docPath);
    const { id, userId: uId, createdAt, ...updateData } = patientData;
    await updateDoc(ref, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
};

export const deletePatient = async (userId: string, patientId: string): Promise<void> => {
  if (userId.startsWith('demo_')) {
    const list = getLocalDemoPatients().filter((p) => p.id !== patientId);
    saveLocalDemoPatients(list);
    return;
  }

  const docPath = `users/${userId}/patients/${patientId}`;
  try {
    await deleteDoc(doc(db, docPath));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
};

export const togglePatientStatus = async (
  userId: string,
  patientId: string,
  currentStatus: CuppingStatus
): Promise<CuppingStatus> => {
  const newStatus: CuppingStatus = currentStatus === 'Sudah Bekam' ? 'Akan Bekam' : 'Sudah Bekam';
  await updatePatient(userId, patientId, { status: newStatus });
  return newStatus;
};

// Export to JSON
export const exportDataToJSON = async (userId: string, profile: UserProfile | null): Promise<string> => {
  if (userId.startsWith('demo_')) {
    const backupPayload = {
      appName: 'Bekam Jr.',
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      therapistProfile: profile,
      patients: getLocalDemoPatients(),
    };
    return JSON.stringify(backupPayload, null, 2);
  }

  const collectionPath = `users/${userId}/patients`;
  const snap = await getDocs(collection(db, collectionPath));
  const patients = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const backupPayload = {
    appName: 'Bekam Jr.',
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    therapistProfile: profile,
    patients,
  };

  return JSON.stringify(backupPayload, null, 2);
};

// Import from JSON
export const importDataFromJSON = async (
  userId: string,
  jsonString: string
): Promise<{ count: number }> => {
  let parsed: any;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Format file JSON tidak valid.');
  }

  const patients = parsed.patients;
  if (!Array.isArray(patients)) {
    throw new Error('Format data tidak sesuai: tidak ditemukan daftar pasien.');
  }

  if (userId.startsWith('demo_')) {
    const list = getLocalDemoPatients();
    let count = 0;
    for (const item of patients) {
      if (!item.name || !item.phone) continue;
      list.push({
        id: `demo-${Date.now()}-${count}`,
        userId,
        name: item.name,
        address: item.address || '',
        phone: item.phone,
        lastCuppingDate: item.lastCuppingDate || '',
        nextCuppingDate: item.nextCuppingDate || '',
        nextCuppingTime: item.nextCuppingTime || '',
        status: item.status === 'Sudah Bekam' ? 'Sudah Bekam' : 'Akan Bekam',
        complaints: item.complaints || '',
        cuppingPoints: item.cuppingPoints || '',
        cuppingCount: item.cuppingCount ? Number(item.cuppingCount) : 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      count++;
    }
    saveLocalDemoPatients(list);
    return { count };
  }

  const collectionPath = `users/${userId}/patients`;
  const batch = writeBatch(db);
  let count = 0;

  for (const item of patients) {
    if (!item.name || !item.phone) continue;
    const docRef = doc(collection(db, collectionPath));
    batch.set(docRef, {
      userId,
      name: item.name,
      address: item.address || '',
      phone: item.phone,
      lastCuppingDate: item.lastCuppingDate || '',
      nextCuppingDate: item.nextCuppingDate || '',
      nextCuppingTime: item.nextCuppingTime || '',
      status: item.status === 'Sudah Bekam' ? 'Sudah Bekam' : 'Akan Bekam',
      complaints: item.complaints || '',
      cuppingPoints: item.cuppingPoints || '',
      cuppingCount: item.cuppingCount ? Number(item.cuppingCount) : 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }

  await batch.commit();
  return { count };
};
