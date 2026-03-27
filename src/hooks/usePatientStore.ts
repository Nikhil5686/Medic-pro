import { useState, useEffect } from 'react';
import { Patient } from '@/types/medical';

const STORAGE_KEY = 'patients';

export function usePatientStore() {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  const addPatient = (p: Omit<Patient, 'id' | 'createdAt'>) => {
    const patient: Patient = { ...p, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setPatients(prev => [patient, ...prev]);
    return patient;
  };

  const updatePatient = (id: string, data: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  return { patients, addPatient, updatePatient, deletePatient };
}
