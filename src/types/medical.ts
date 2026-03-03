export type RenalFunction = 'normal' | 'mild' | 'moderate' | 'severe' | 'dialysis';
export type LiverDisease = 'none' | 'mild' | 'moderate' | 'severe';
export type ASAStatus = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
export type Gender = 'male' | 'female';

export interface Patient {
  id: string;
  name?: string;
  age: number;
  ageUnit: 'years' | 'months';
  weight: number;
  height: number;
  gender: Gender;
  asaStatus: ASAStatus;
  diagnosis: string;
  renalFunction: RenalFunction;
  liverDisease: LiverDisease;
  createdAt: string;
}

export type DrugCategory =
  | 'induction'
  | 'muscle_relaxants'
  | 'analgesics'
  | 'sedatives'
  | 'vasopressors'
  | 'emergency';

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  category: DrugCategory;
  adultDose: { min: number; max: number; unit: string; per: string };
  pediatricDose?: { min: number; max: number; unit: string; per: string };
  maxDose: { value: number; unit: string };
  route: string;
  onset: string;
  duration: string;
  contraindications: string[];
  renalAdjustment: Record<RenalFunction, number>; // multiplier
  liverAdjustment: Record<LiverDisease, number>; // multiplier
  isInfusion: boolean;
  infusionRange?: { min: number; max: number; unit: string };
  concentration?: { amount: number; volume: number; amountUnit: string; volumeUnit: string };
  emergencyNotes?: string;
  reference: string;
}

export interface DoseResult {
  drugName: string;
  recommendedDose: number;
  doseRange: { min: number; max: number };
  unit: string;
  infusionRate?: { min: number; max: number; unit: string };
  alerts: string[];
  contraindications: string[];
  renalAdjustmentApplied: boolean;
  liverAdjustmentApplied: boolean;
  renalFactor: number;
  liverFactor: number;
  isPediatric: boolean;
  maxDoseExceeded: boolean;
  calculationSteps: string[];
  clinicalNotes: string;
}
