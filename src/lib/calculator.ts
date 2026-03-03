import { Drug, Patient, DoseResult } from '@/types/medical';

export function calculateDose(drug: Drug, patient: Patient): DoseResult {
  const steps: string[] = [];
  const alerts: string[] = [];
  const ageInYears = patient.ageUnit === 'months' ? patient.age / 12 : patient.age;
  const isPediatric = ageInYears < 18;

  // Select dose range
  const doseInfo = isPediatric && drug.pediatricDose ? drug.pediatricDose : drug.adultDose;
  steps.push(`Patient: ${patient.weight}kg, ${isPediatric ? 'Pediatric' : 'Adult'}`);
  steps.push(`Base dose: ${doseInfo.min}–${doseInfo.max} ${doseInfo.unit}/${doseInfo.per}`);

  // Calculate raw dose
  let minDose = doseInfo.min * patient.weight;
  let maxDose = doseInfo.max * patient.weight;
  steps.push(`Raw dose: ${minDose.toFixed(2)}–${maxDose.toFixed(2)} ${doseInfo.unit}`);

  // Renal adjustment
  const renalFactor = drug.renalAdjustment[patient.renalFunction];
  const renalAdjusted = renalFactor !== 1;
  if (renalAdjusted) {
    if (renalFactor === 0) {
      alerts.push(`⛔ CONTRAINDICATED in ${patient.renalFunction} renal impairment`);
    } else {
      minDose *= renalFactor;
      maxDose *= renalFactor;
      steps.push(`Renal adjustment (${patient.renalFunction}): ×${renalFactor} → ${minDose.toFixed(2)}–${maxDose.toFixed(2)} ${doseInfo.unit}`);
    }
  }

  // Liver adjustment
  const liverFactor = drug.liverAdjustment[patient.liverDisease];
  const liverAdjusted = liverFactor !== 1;
  if (liverAdjusted) {
    if (liverFactor === 0) {
      alerts.push(`⛔ CONTRAINDICATED in ${patient.liverDisease} liver disease`);
    } else {
      minDose *= liverFactor;
      maxDose *= liverFactor;
      steps.push(`Liver adjustment (${patient.liverDisease}): ×${liverFactor} → ${minDose.toFixed(2)}–${maxDose.toFixed(2)} ${doseInfo.unit}`);
    }
  }

  // Max dose check
  const maxDoseExceeded = maxDose > drug.maxDose.value;
  if (maxDoseExceeded) {
    alerts.push(`⚠️ Max dose exceeded. Capped at ${drug.maxDose.value} ${drug.maxDose.unit}`);
    maxDose = Math.min(maxDose, drug.maxDose.value);
    minDose = Math.min(minDose, drug.maxDose.value);
    steps.push(`Max dose cap applied: ${drug.maxDose.value} ${drug.maxDose.unit}`);
  }

  const recommendedDose = Number(((minDose + maxDose) / 2).toFixed(2));
  steps.push(`Recommended dose: ${recommendedDose} ${doseInfo.unit}`);

  // Pediatric alerts
  if (isPediatric) {
    alerts.push('👶 Pediatric dosing applied');
    if (ageInYears < 1) alerts.push('⚠️ Neonatal patient – use extreme caution');
  }

  // Age alerts
  if (ageInYears > 65) {
    alerts.push('👴 Elderly patient – consider dose reduction');
  }

  // Infusion calculation
  let infusionRate: { min: number; max: number; unit: string } | undefined;
  if (drug.isInfusion && drug.infusionRange && drug.concentration) {
    const { infusionRange, concentration } = drug;
    const concPerMl = concentration.amount / concentration.volume;

    if (infusionRange.unit.includes('/kg/')) {
      // Convert mcg to mg if infusion is in mcg but concentration is in mg
      const unitFactor = infusionRange.unit.startsWith('mcg') && concentration.amountUnit === 'mg' ? 1000 : 1;
      // Only multiply by 60 to convert to /hr if the rate is per minute (/kg/min)
      const timeConversion = infusionRange.unit.includes('/min') ? 60 : 1;
      const minRate = (infusionRange.min * patient.weight * timeConversion) / (concPerMl * unitFactor);
      const maxRate = (infusionRange.max * patient.weight * timeConversion) / (concPerMl * unitFactor);
      infusionRate = { min: Number(minRate.toFixed(2)), max: Number(maxRate.toFixed(2)), unit: 'ml/hr' };
      steps.push(`Infusion: ${infusionRange.min}–${infusionRange.max} ${infusionRange.unit}`);
      steps.push(`→ ${infusionRate.min}–${infusionRate.max} ml/hr (conc: ${concPerMl} ${concentration.amountUnit}/ml)`);
    } else {
      infusionRate = { min: infusionRange.min, max: infusionRange.max, unit: infusionRange.unit };
      steps.push(`Infusion: ${infusionRange.min}–${infusionRange.max} ${infusionRange.unit}`);
    }
  }

  // Clinical notes
  const notes: string[] = [];
  if (drug.emergencyNotes) notes.push(drug.emergencyNotes);
  notes.push(`Route: ${drug.route} | Onset: ${drug.onset} | Duration: ${drug.duration}`);
  notes.push(`Reference: ${drug.reference}`);

  return {
    drugName: drug.name,
    recommendedDose,
    doseRange: { min: Number(minDose.toFixed(2)), max: Number(maxDose.toFixed(2)) },
    unit: doseInfo.unit,
    infusionRate,
    alerts,
    contraindications: drug.contraindications,
    renalAdjustmentApplied: renalAdjusted,
    liverAdjustmentApplied: liverAdjusted,
    renalFactor,
    liverFactor,
    isPediatric,
    maxDoseExceeded,
    calculationSteps: steps,
    clinicalNotes: notes.join('\n'),
  };
}
