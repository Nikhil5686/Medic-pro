import { describe, it, expect } from 'vitest';
import { calculateDose } from '@/lib/calculator';
import { drugs } from '@/data/drugs';
import { Patient } from '@/types/medical';

// ─── Helpers ────────────────────────────────────────────────────────────────

function makePatient(overrides: Partial<Patient> = {}): Patient {
  return {
    id: 'test-patient',
    age: 40,
    ageUnit: 'years',
    weight: 70,
    height: 170,
    gender: 'male',
    asaStatus: 'II',
    diagnosis: 'Test',
    renalFunction: 'normal',
    liverDisease: 'none',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function getDrug(id: string) {
  const drug = drugs.find((d) => d.id === id);
  if (!drug) throw new Error(`Drug not found: ${id}`);
  return drug;
}

// ─── Basic dose calculation ──────────────────────────────────────────────────

describe('calculateDose – basic adult doses', () => {
  it('calculates propofol dose for 70 kg adult', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ weight: 70 }));
    // Adult dose: 1.5–2.5 mg/kg → 105–175 mg, recommended = 140
    expect(result.doseRange.min).toBe(105);
    expect(result.doseRange.max).toBe(175);
    expect(result.recommendedDose).toBe(140);
    expect(result.unit).toBe('mg');
    expect(result.isPediatric).toBe(false);
  });

  it('calculates ketamine dose for 50 kg adult', () => {
    const result = calculateDose(getDrug('ketamine'), makePatient({ weight: 50 }));
    // 1–2 mg/kg → 50–100 mg
    expect(result.doseRange.min).toBe(50);
    expect(result.doseRange.max).toBe(100);
    expect(result.recommendedDose).toBe(75);
  });

  it('calculates fentanyl dose for 80 kg adult', () => {
    const result = calculateDose(getDrug('fentanyl'), makePatient({ weight: 80 }));
    // 1–3 mcg/kg → 80–240 mcg (capped at max 250 mcg)
    expect(result.doseRange.min).toBe(80);
    expect(result.doseRange.max).toBe(240);
    expect(result.unit).toBe('mcg');
  });
});

// ─── Pediatric dosing ───────────────────────────────────────────────────────

describe('calculateDose – pediatric dosing', () => {
  it('uses pediatric dose for patient under 18', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ age: 8, weight: 25 }));
    // Pediatric dose: 2.5–3.5 mg/kg → 62.5–87.5 mg
    expect(result.isPediatric).toBe(true);
    expect(result.doseRange.min).toBe(62.5);
    expect(result.doseRange.max).toBe(87.5);
  });

  it('includes pediatric alert for children', () => {
    const result = calculateDose(getDrug('ketamine'), makePatient({ age: 5, weight: 20 }));
    expect(result.alerts.some((a) => a.includes('Pediatric'))).toBe(true);
  });

  it('includes neonatal warning for age < 1 year', () => {
    const result = calculateDose(
      getDrug('ketamine'),
      makePatient({ age: 6, ageUnit: 'months', weight: 7 })
    );
    expect(result.alerts.some((a) => a.toLowerCase().includes('neonatal'))).toBe(true);
  });
});

// ─── Renal adjustment ───────────────────────────────────────────────────────

describe('calculateDose – renal adjustments', () => {
  it('applies renal adjustment for fentanyl in severe impairment', () => {
    const normal = calculateDose(getDrug('fentanyl'), makePatient({ weight: 70, renalFunction: 'normal' }));
    const severe = calculateDose(getDrug('fentanyl'), makePatient({ weight: 70, renalFunction: 'severe' }));
    // Fentanyl renalDefault: severe = 0.5
    expect(severe.doseRange.max).toBeCloseTo(normal.doseRange.max * 0.5, 1);
    expect(severe.renalAdjustmentApplied).toBe(true);
    expect(severe.renalFactor).toBe(0.5);
  });

  it('marks ketorolac as CONTRAINDICATED in severe renal failure', () => {
    const result = calculateDose(
      getDrug('ketorolac'),
      makePatient({ weight: 70, renalFunction: 'severe' })
    );
    expect(result.alerts.some((a) => a.includes('CONTRAINDICATED'))).toBe(true);
  });

  it('does not apply adjustment when renal function is normal', () => {
    const result = calculateDose(getDrug('fentanyl'), makePatient({ weight: 70 }));
    expect(result.renalAdjustmentApplied).toBe(false);
    expect(result.renalFactor).toBe(1);
  });
});

// ─── Liver adjustment ───────────────────────────────────────────────────────

describe('calculateDose – liver adjustments', () => {
  it('applies liver adjustment for propofol in moderate liver disease', () => {
    const normal = calculateDose(getDrug('propofol'), makePatient({ weight: 70, liverDisease: 'none' }));
    const moderate = calculateDose(getDrug('propofol'), makePatient({ weight: 70, liverDisease: 'moderate' }));
    // Propofol liver: moderate = 0.8
    expect(moderate.doseRange.max).toBeCloseTo(normal.doseRange.max * 0.8, 1);
    expect(moderate.liverAdjustmentApplied).toBe(true);
    expect(moderate.liverFactor).toBe(0.8);
  });
});

// ─── Max dose cap ───────────────────────────────────────────────────────────

describe('calculateDose – max dose cap', () => {
  it('caps propofol at max dose 300 mg for very heavy patient', () => {
    // 150 kg patient: 1.5–2.5 mg/kg = 225–375 mg → max capped at 300
    const result = calculateDose(getDrug('propofol'), makePatient({ weight: 150 }));
    expect(result.doseRange.max).toBeLessThanOrEqual(300);
    expect(result.maxDoseExceeded).toBe(true);
    expect(result.alerts.some((a) => a.includes('Max dose'))).toBe(true);
  });

  it('does not cap propofol for normal weight patient', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ weight: 70 }));
    expect(result.maxDoseExceeded).toBe(false);
  });
});

// ─── Infusion rate (BUG FIX) ────────────────────────────────────────────────

describe('calculateDose – infusion rate calculation', () => {
  it('correctly calculates rocuronium infusion rate (mcg/kg/min → ml/hr)', () => {
    // rocuronium: 5–12 mcg/kg/min, conc = 50mg/5ml = 10 mg/ml = 10,000 mcg/ml, patient 70kg
    // minRate = 5 * 70 * 60 / (10000) = 21000 / 10000 = 2.1 ml/hr
    // maxRate = 12 * 70 * 60 / (10000) = 50400 / 10000 = 5.04 ml/hr
    const result = calculateDose(getDrug('rocuronium'), makePatient({ weight: 70 }));
    expect(result.infusionRate).toBeDefined();
    expect(result.infusionRate!.min).toBeCloseTo(2.1, 1);
    expect(result.infusionRate!.max).toBeCloseTo(5.04, 1);
    expect(result.infusionRate!.unit).toBe('ml/hr');
  });

  it('correctly calculates fentanyl infusion rate (mcg/kg/hr → ml/hr) — bug fix', () => {
    // fentanyl: 0.5–3 mcg/kg/hr, conc = 100mcg/2ml = 50 mcg/ml, patient 70 kg
    // ** /hr rate: do NOT multiply by 60 **
    // minRate = 0.5 * 70 / 50 = 35 / 50 = 0.7 ml/hr
    // maxRate = 3 * 70 / 50 = 210 / 50 = 4.2 ml/hr
    const result = calculateDose(getDrug('fentanyl'), makePatient({ weight: 70 }));
    expect(result.infusionRate).toBeDefined();
    expect(result.infusionRate!.min).toBeCloseTo(0.7, 1);
    expect(result.infusionRate!.max).toBeCloseTo(4.2, 1);
    expect(result.infusionRate!.unit).toBe('ml/hr');
  });

  it('correctly calculates dexmedetomidine infusion rate (mcg/kg/hr → ml/hr) — bug fix', () => {
    // dexmedeto: 0.2–0.7 mcg/kg/hr, conc = 200mcg/50ml = 4 mcg/ml, 70 kg
    // minRate = 0.2 * 70 / 4 = 3.5 ml/hr
    // maxRate = 0.7 * 70 / 4 = 12.25 ml/hr
    const result = calculateDose(getDrug('dexmedetomidine'), makePatient({ weight: 70 }));
    expect(result.infusionRate).toBeDefined();
    expect(result.infusionRate!.min).toBeCloseTo(3.5, 1);
    expect(result.infusionRate!.max).toBeCloseTo(12.25, 1);
  });

  it('morphine infusion uses flat rate (mg/hr) with no kg conversion', () => {
    // morphine infusionRange: 1–5 mg/hr (no /kg/), returned as-is
    const result = calculateDose(getDrug('morphine'), makePatient({ weight: 70 }));
    expect(result.infusionRate).toBeDefined();
    expect(result.infusionRate!.min).toBe(1);
    expect(result.infusionRate!.max).toBe(5);
    expect(result.infusionRate!.unit).toBe('mg/hr');
  });
});

// ─── Elderly alert ──────────────────────────────────────────────────────────

describe('calculateDose – alerts', () => {
  it('adds elderly alert for patient over 65', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ age: 75, weight: 65 }));
    expect(result.alerts.some((a) => a.includes('Elderly'))).toBe(true);
  });

  it('does not add elderly alert for middle-aged patient', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ age: 40, weight: 70 }));
    expect(result.alerts.some((a) => a.includes('Elderly'))).toBe(false);
  });
});

// ─── Clinical notes ─────────────────────────────────────────────────────────

describe('calculateDose – clinical notes', () => {
  it('includes route, onset, duration in clinical notes', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ weight: 70 }));
    expect(result.clinicalNotes).toContain('Route:');
    expect(result.clinicalNotes).toContain('Onset:');
    expect(result.clinicalNotes).toContain('Duration:');
  });

  it('includes calculation steps', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ weight: 70 }));
    expect(result.calculationSteps.length).toBeGreaterThan(0);
  });

  it('includes contraindications from drug definition', () => {
    const result = calculateDose(getDrug('propofol'), makePatient({ weight: 70 }));
    expect(result.contraindications).toContain('Egg/soy allergy');
  });
});
