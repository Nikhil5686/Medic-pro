import { Drug, DrugCategory } from '@/types/medical';

const renalDefault = { normal: 1, mild: 1, moderate: 0.75, severe: 0.5, dialysis: 0.25 };
const renalNone = { normal: 1, mild: 1, moderate: 1, severe: 1, dialysis: 1 };
const liverDefault = { none: 1, mild: 1, moderate: 0.75, severe: 0.5 };
const liverNone = { none: 1, mild: 1, moderate: 1, severe: 1 };

export const drugs: Drug[] = [
  // INDUCTION AGENTS
  {
    id: 'propofol', name: 'Propofol', genericName: 'Propofol', category: 'induction',
    adultDose: { min: 1.5, max: 2.5, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 2.5, max: 3.5, unit: 'mg', per: 'kg' },
    maxDose: { value: 300, unit: 'mg' },
    route: 'IV', onset: '30-40 sec', duration: '5-10 min',
    contraindications: ['Egg/soy allergy', 'Propofol infusion syndrome risk', 'Severe cardiac dysfunction'],
    renalAdjustment: renalNone, liverAdjustment: { none: 1, mild: 1, moderate: 0.8, severe: 0.6 },
    isInfusion: true, infusionRange: { min: 25, max: 150, unit: 'mcg/kg/min' },
    concentration: { amount: 200, volume: 20, amountUnit: 'mg', volumeUnit: 'ml' },
    reference: 'Miller\'s Anesthesia, 9th Ed', emergencyNotes: 'Reduce dose in elderly/hemodynamically unstable'
  },
  {
    id: 'ketamine', name: 'Ketamine', genericName: 'Ketamine HCl', category: 'induction',
    adultDose: { min: 1, max: 2, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 1, max: 2, unit: 'mg', per: 'kg' },
    maxDose: { value: 200, unit: 'mg' },
    route: 'IV', onset: '30-60 sec', duration: '10-20 min',
    contraindications: ['Severe hypertension', 'Raised ICP (relative)', 'Psychosis', 'Eclampsia'],
    renalAdjustment: renalNone, liverAdjustment: liverDefault,
    isInfusion: false, reference: 'Miller\'s Anesthesia, 9th Ed',
    emergencyNotes: 'Preferred in hemodynamic instability, bronchospasm'
  },
  {
    id: 'etomidate', name: 'Etomidate', genericName: 'Etomidate', category: 'induction',
    adultDose: { min: 0.2, max: 0.4, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.2, max: 0.4, unit: 'mg', per: 'kg' },
    maxDose: { value: 40, unit: 'mg' },
    route: 'IV', onset: '15-30 sec', duration: '5-15 min',
    contraindications: ['Adrenal insufficiency', 'Sepsis (relative)'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: false, reference: 'Miller\'s Anesthesia, 9th Ed',
    emergencyNotes: 'Hemodynamically stable induction agent. Single dose preferred.'
  },
  {
    id: 'thiopental', name: 'Thiopental', genericName: 'Thiopental Sodium', category: 'induction',
    adultDose: { min: 3, max: 5, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 5, max: 7, unit: 'mg', per: 'kg' },
    maxDose: { value: 500, unit: 'mg' },
    route: 'IV', onset: '15-30 sec', duration: '5-10 min',
    contraindications: ['Porphyria', 'Severe asthma', 'Barbiturate allergy'],
    renalAdjustment: renalDefault, liverAdjustment: liverDefault,
    isInfusion: false, reference: 'Stoelting\'s Pharmacology'
  },
  // MUSCLE RELAXANTS
  {
    id: 'succinylcholine', name: 'Succinylcholine', genericName: 'Succinylcholine Chloride', category: 'muscle_relaxants',
    adultDose: { min: 1, max: 1.5, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 1.5, max: 2, unit: 'mg', per: 'kg' },
    maxDose: { value: 150, unit: 'mg' },
    route: 'IV', onset: '30-60 sec', duration: '5-10 min',
    contraindications: ['Hyperkalemia risk', 'Burns >24h', 'Denervation injury', 'Malignant hyperthermia', 'Myopathies'],
    renalAdjustment: { normal: 1, mild: 1, moderate: 1, severe: 0.75, dialysis: 0.5 },
    liverAdjustment: liverDefault,
    isInfusion: false, reference: 'Miller\'s Anesthesia, 9th Ed',
    emergencyNotes: 'RSI drug of choice. Check K+ before use in renal patients.'
  },
  {
    id: 'rocuronium', name: 'Rocuronium', genericName: 'Rocuronium Bromide', category: 'muscle_relaxants',
    adultDose: { min: 0.6, max: 1.2, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.6, max: 1, unit: 'mg', per: 'kg' },
    maxDose: { value: 120, unit: 'mg' },
    route: 'IV', onset: '60-90 sec', duration: '30-60 min',
    contraindications: ['Allergy to rocuronium'],
    renalAdjustment: { normal: 1, mild: 1, moderate: 0.9, severe: 0.8, dialysis: 0.7 },
    liverAdjustment: { none: 1, mild: 1, moderate: 0.85, severe: 0.7 },
    isInfusion: true, infusionRange: { min: 5, max: 12, unit: 'mcg/kg/min' },
    concentration: { amount: 50, volume: 5, amountUnit: 'mg', volumeUnit: 'ml' },
    reference: 'Miller\'s Anesthesia, 9th Ed'
  },
  {
    id: 'atracurium', name: 'Atracurium', genericName: 'Atracurium Besylate', category: 'muscle_relaxants',
    adultDose: { min: 0.4, max: 0.5, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.4, max: 0.5, unit: 'mg', per: 'kg' },
    maxDose: { value: 50, unit: 'mg' },
    route: 'IV', onset: '2-3 min', duration: '20-35 min',
    contraindications: ['Allergy to atracurium'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 4, max: 12, unit: 'mcg/kg/min' },
    concentration: { amount: 50, volume: 5, amountUnit: 'mg', volumeUnit: 'ml' },
    reference: 'Stoelting\'s Pharmacology',
    emergencyNotes: 'Organ-independent elimination (Hofmann degradation). Safe in renal/liver failure.'
  },
  {
    id: 'vecuronium', name: 'Vecuronium', genericName: 'Vecuronium Bromide', category: 'muscle_relaxants',
    adultDose: { min: 0.08, max: 0.1, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.08, max: 0.1, unit: 'mg', per: 'kg' },
    maxDose: { value: 10, unit: 'mg' },
    route: 'IV', onset: '2-3 min', duration: '25-40 min',
    contraindications: ['Allergy to vecuronium'],
    renalAdjustment: { normal: 1, mild: 1, moderate: 0.85, severe: 0.7, dialysis: 0.5 },
    liverAdjustment: { none: 1, mild: 1, moderate: 0.8, severe: 0.6 },
    isInfusion: false, reference: 'Stoelting\'s Pharmacology'
  },
  // ANALGESICS
  {
    id: 'fentanyl', name: 'Fentanyl', genericName: 'Fentanyl Citrate', category: 'analgesics',
    adultDose: { min: 1, max: 3, unit: 'mcg', per: 'kg' },
    pediatricDose: { min: 1, max: 2, unit: 'mcg', per: 'kg' },
    maxDose: { value: 250, unit: 'mcg' },
    route: 'IV', onset: '1-2 min', duration: '30-60 min',
    contraindications: ['Severe respiratory depression', 'MAO inhibitor use'],
    renalAdjustment: renalDefault, liverAdjustment: liverDefault,
    isInfusion: true, infusionRange: { min: 0.5, max: 3, unit: 'mcg/kg/hr' },
    concentration: { amount: 100, volume: 2, amountUnit: 'mcg', volumeUnit: 'ml' },
    reference: 'Miller\'s Anesthesia, 9th Ed'
  },
  {
    id: 'morphine', name: 'Morphine', genericName: 'Morphine Sulfate', category: 'analgesics',
    adultDose: { min: 0.05, max: 0.15, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.05, max: 0.1, unit: 'mg', per: 'kg' },
    maxDose: { value: 15, unit: 'mg' },
    route: 'IV', onset: '3-5 min', duration: '3-5 hours',
    contraindications: ['Severe asthma', 'Raised ICP', 'Biliary colic'],
    renalAdjustment: { normal: 1, mild: 0.75, moderate: 0.5, severe: 0.25, dialysis: 0.25 },
    liverAdjustment: { none: 1, mild: 0.75, moderate: 0.5, severe: 0.25 },
    isInfusion: true, infusionRange: { min: 1, max: 5, unit: 'mg/hr' },
    concentration: { amount: 10, volume: 1, amountUnit: 'mg', volumeUnit: 'ml' },
    reference: 'BNF, NICE Guidelines',
    emergencyNotes: 'Use with extreme caution in renal failure - active metabolites accumulate'
  },
  {
    id: 'remifentanil', name: 'Remifentanil', genericName: 'Remifentanil HCl', category: 'analgesics',
    adultDose: { min: 0.5, max: 1, unit: 'mcg', per: 'kg' },
    maxDose: { value: 100, unit: 'mcg' },
    route: 'IV', onset: '1 min', duration: '5-10 min',
    contraindications: ['Epidural/intrathecal use'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 0.05, max: 0.2, unit: 'mcg/kg/min' },
    concentration: { amount: 1000, volume: 50, amountUnit: 'mcg', volumeUnit: 'ml' },
    reference: 'Miller\'s Anesthesia, 9th Ed',
    emergencyNotes: 'Ester metabolism - safe in organ failure. Requires transition analgesia.'
  },
  {
    id: 'ketorolac', name: 'Ketorolac', genericName: 'Ketorolac Tromethamine', category: 'analgesics',
    adultDose: { min: 0.5, max: 0.5, unit: 'mg', per: 'kg' },
    maxDose: { value: 30, unit: 'mg' },
    route: 'IV', onset: '10-15 min', duration: '4-6 hours',
    contraindications: ['Renal impairment', 'Active bleeding', 'Peptic ulcer', 'Coagulopathy', 'Aspirin allergy'],
    renalAdjustment: { normal: 1, mild: 0.5, moderate: 0, severe: 0, dialysis: 0 },
    liverAdjustment: { none: 1, mild: 0.75, moderate: 0.5, severe: 0 },
    isInfusion: false, reference: 'BNF'
  },
  // SEDATIVES
  {
    id: 'midazolam', name: 'Midazolam', genericName: 'Midazolam HCl', category: 'sedatives',
    adultDose: { min: 0.02, max: 0.05, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.05, max: 0.1, unit: 'mg', per: 'kg' },
    maxDose: { value: 5, unit: 'mg' },
    route: 'IV', onset: '1-3 min', duration: '30-60 min',
    contraindications: ['Severe respiratory depression', 'Myasthenia gravis', 'Acute narrow-angle glaucoma'],
    renalAdjustment: renalDefault, liverAdjustment: liverDefault,
    isInfusion: true, infusionRange: { min: 0.02, max: 0.1, unit: 'mg/kg/hr' },
    concentration: { amount: 5, volume: 1, amountUnit: 'mg', volumeUnit: 'ml' },
    reference: 'Miller\'s Anesthesia, 9th Ed'
  },
  {
    id: 'dexmedetomidine', name: 'Dexmedetomidine', genericName: 'Dexmedetomidine HCl', category: 'sedatives',
    adultDose: { min: 0.5, max: 1, unit: 'mcg', per: 'kg' },
    maxDose: { value: 100, unit: 'mcg' },
    route: 'IV over 10 min', onset: '5-10 min', duration: '1-2 hours',
    contraindications: ['Severe bradycardia', 'Advanced heart block', 'Severe hepatic impairment'],
    renalAdjustment: renalNone, liverAdjustment: { none: 1, mild: 1, moderate: 0.75, severe: 0.5 },
    isInfusion: true, infusionRange: { min: 0.2, max: 0.7, unit: 'mcg/kg/hr' },
    concentration: { amount: 200, volume: 50, amountUnit: 'mcg', volumeUnit: 'ml' },
    reference: 'Miller\'s Anesthesia, 9th Ed',
    emergencyNotes: 'Cooperative sedation. Minimal respiratory depression.'
  },
  // VASOPRESSORS
  {
    id: 'ephedrine', name: 'Ephedrine', genericName: 'Ephedrine HCl', category: 'vasopressors',
    adultDose: { min: 0.1, max: 0.2, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.1, max: 0.3, unit: 'mg', per: 'kg' },
    maxDose: { value: 30, unit: 'mg' },
    route: 'IV bolus', onset: '1-2 min', duration: '10-15 min',
    contraindications: ['Severe hypertension', 'Pheochromocytoma'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: false, reference: 'Miller\'s Anesthesia, 9th Ed',
    emergencyNotes: 'First-line for spinal hypotension. Tachyphylaxis occurs.'
  },
  {
    id: 'phenylephrine', name: 'Phenylephrine', genericName: 'Phenylephrine HCl', category: 'vasopressors',
    adultDose: { min: 1, max: 2, unit: 'mcg', per: 'kg' },
    maxDose: { value: 200, unit: 'mcg' },
    route: 'IV bolus', onset: '30-60 sec', duration: '5-10 min',
    contraindications: ['Severe bradycardia', 'Complete heart block'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 0.1, max: 0.5, unit: 'mcg/kg/min' },
    concentration: { amount: 10000, volume: 250, amountUnit: 'mcg', volumeUnit: 'ml' },
    reference: 'Miller\'s Anesthesia, 9th Ed'
  },
  {
    id: 'norepinephrine', name: 'Norepinephrine', genericName: 'Norepinephrine Bitartrate', category: 'vasopressors',
    adultDose: { min: 0.05, max: 0.1, unit: 'mcg', per: 'kg' },
    maxDose: { value: 10, unit: 'mcg' },
    route: 'IV infusion', onset: '1-2 min', duration: 'Continuous',
    contraindications: ['Peripheral vascular disease (relative)', 'Mesenteric ischemia'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 0.01, max: 0.5, unit: 'mcg/kg/min' },
    concentration: { amount: 4000, volume: 250, amountUnit: 'mcg', volumeUnit: 'ml' },
    reference: 'Surviving Sepsis Campaign 2021',
    emergencyNotes: 'First-line vasopressor in septic shock. Central line preferred.'
  },
  {
    id: 'vasopressin', name: 'Vasopressin', genericName: 'Vasopressin (ADH)', category: 'vasopressors',
    adultDose: { min: 0.01, max: 0.04, unit: 'units', per: 'min (fixed)' },
    maxDose: { value: 0.04, unit: 'units/min' },
    route: 'IV infusion', onset: '1-2 min', duration: 'Continuous',
    contraindications: ['CAD (relative)'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 0.01, max: 0.04, unit: 'units/min' },
    concentration: { amount: 20, volume: 100, amountUnit: 'units', volumeUnit: 'ml' },
    reference: 'Surviving Sepsis Campaign 2021',
    emergencyNotes: 'Adjunct to norepinephrine. Non-catecholamine vasopressor.'
  },
  // EMERGENCY DRUGS
  {
    id: 'epinephrine', name: 'Epinephrine (Adrenaline)', genericName: 'Epinephrine', category: 'emergency',
    adultDose: { min: 10, max: 10, unit: 'mcg', per: 'kg' },
    pediatricDose: { min: 10, max: 10, unit: 'mcg', per: 'kg' },
    maxDose: { value: 1000, unit: 'mcg' },
    route: 'IV', onset: 'Immediate', duration: '3-5 min',
    contraindications: ['None in cardiac arrest'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 0.01, max: 0.5, unit: 'mcg/kg/min' },
    concentration: { amount: 1000, volume: 1, amountUnit: 'mcg', volumeUnit: 'ml' },
    reference: 'AHA ACLS Guidelines 2020',
    emergencyNotes: 'CARDIAC ARREST: 1mg (1:10,000) IV q3-5min. ANAPHYLAXIS: 0.3-0.5mg IM (1:1,000).'
  },
  {
    id: 'atropine', name: 'Atropine', genericName: 'Atropine Sulfate', category: 'emergency',
    adultDose: { min: 10, max: 20, unit: 'mcg', per: 'kg' },
    pediatricDose: { min: 20, max: 20, unit: 'mcg', per: 'kg' },
    maxDose: { value: 3000, unit: 'mcg' },
    route: 'IV', onset: '1-2 min', duration: '30-60 min',
    contraindications: ['Glaucoma (relative)', 'Urinary obstruction'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: false, reference: 'AHA ACLS Guidelines 2020',
    emergencyNotes: 'Bradycardia: 0.5mg IV q3-5min (max 3mg). Min pediatric dose 0.1mg.'
  },
  {
    id: 'amiodarone', name: 'Amiodarone', genericName: 'Amiodarone HCl', category: 'emergency',
    adultDose: { min: 5, max: 5, unit: 'mg', per: 'kg' },
    maxDose: { value: 300, unit: 'mg' },
    route: 'IV over 10-20 min', onset: '5-10 min', duration: '4-8 hours',
    contraindications: ['Thyroid disease', 'Iodine allergy', 'Severe sinus node disease'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 0.5, max: 1, unit: 'mg/min' },
    concentration: { amount: 150, volume: 3, amountUnit: 'mg', volumeUnit: 'ml' },
    reference: 'AHA ACLS Guidelines 2020',
    emergencyNotes: 'VF/pVT: 300mg IV bolus, then 150mg. Stable VT: 150mg over 10 min.'
  },
  {
    id: 'adenosine', name: 'Adenosine', genericName: 'Adenosine', category: 'emergency',
    adultDose: { min: 0.1, max: 0.1, unit: 'mg', per: 'kg' },
    maxDose: { value: 12, unit: 'mg' },
    route: 'Rapid IV push', onset: '10-20 sec', duration: '10-30 sec',
    contraindications: ['2nd/3rd degree heart block', 'Sick sinus syndrome', 'Severe asthma'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: false, reference: 'AHA ACLS Guidelines 2020',
    emergencyNotes: 'SVT: 6mg rapid IV push, then 12mg x2 if needed. Must use rapid flush.'
  },
  {
    id: 'naloxone', name: 'Naloxone', genericName: 'Naloxone HCl', category: 'emergency',
    adultDose: { min: 1, max: 5, unit: 'mcg', per: 'kg' },
    pediatricDose: { min: 5, max: 10, unit: 'mcg', per: 'kg' },
    maxDose: { value: 400, unit: 'mcg' },
    route: 'IV', onset: '1-2 min', duration: '30-60 min',
    contraindications: ['None in emergency'],
    renalAdjustment: renalNone, liverAdjustment: liverNone,
    isInfusion: true, infusionRange: { min: 2.5, max: 10, unit: 'mcg/kg/hr' },
    concentration: { amount: 400, volume: 1, amountUnit: 'mcg', volumeUnit: 'ml' },
    reference: 'AHA ACLS Guidelines',
    emergencyNotes: 'Titrate in small doses to avoid acute withdrawal. Duration < most opioids.'
  },
  {
    id: 'flumazenil', name: 'Flumazenil', genericName: 'Flumazenil', category: 'emergency',
    adultDose: { min: 3, max: 5, unit: 'mcg', per: 'kg' },
    maxDose: { value: 1000, unit: 'mcg' },
    route: 'IV over 15 sec', onset: '1-2 min', duration: '45-90 min',
    contraindications: ['Chronic benzodiazepine use', 'Seizure disorder', 'TCA overdose'],
    renalAdjustment: renalNone, liverAdjustment: liverDefault,
    isInfusion: false, reference: 'Toxicology guidelines',
    emergencyNotes: 'Risk of seizures. Titrate 0.2mg q1min. Max total 3-5mg.'
  },
  {
    id: 'sugammadex', name: 'Sugammadex', genericName: 'Sugammadex Sodium', category: 'emergency',
    adultDose: { min: 2, max: 4, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 2, max: 4, unit: 'mg', per: 'kg' },
    maxDose: { value: 500, unit: 'mg' },
    route: 'IV bolus', onset: '1-3 min', duration: 'N/A',
    contraindications: ['Severe renal impairment (GFR <30)', 'Allergy to sugammadex'],
    renalAdjustment: { normal: 1, mild: 1, moderate: 1, severe: 0, dialysis: 0 },
    liverAdjustment: liverNone,
    isInfusion: false, reference: 'Bridion prescribing information',
    emergencyNotes: 'Immediate reversal: 16 mg/kg. Routine reversal: 2-4 mg/kg based on TOF.'
  },
  {
    id: 'neostigmine', name: 'Neostigmine', genericName: 'Neostigmine Methylsulfate', category: 'emergency',
    adultDose: { min: 0.04, max: 0.07, unit: 'mg', per: 'kg' },
    pediatricDose: { min: 0.04, max: 0.07, unit: 'mg', per: 'kg' },
    maxDose: { value: 5, unit: 'mg' },
    route: 'IV', onset: '5-10 min', duration: '40-60 min',
    contraindications: ['Mechanical GI/GU obstruction', 'Peritonitis'],
    renalAdjustment: { normal: 1, mild: 1, moderate: 0.75, severe: 0.5, dialysis: 0.5 },
    liverAdjustment: liverNone,
    isInfusion: false, reference: 'Stoelting\'s Pharmacology',
    emergencyNotes: 'Always co-administer with glycopyrrolate (0.2mg per 1mg neostigmine) or atropine.'
  },
];

export const categoryLabels: Record<DrugCategory, string> = {
  induction: 'Induction Agents',
  muscle_relaxants: 'Muscle Relaxants',
  analgesics: 'Analgesics',
  sedatives: 'Sedatives',
  vasopressors: 'Vasopressors',
  emergency: 'Emergency Drugs',
};
