import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle2, Copy, Bookmark, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { drugs } from '@/data/drugs';
import { usePatientStore } from '@/hooks/usePatientStore';
import { calculateDose } from '@/lib/calculator';
import { Patient, RenalFunction, LiverDisease } from '@/types/medical';
import { toast } from 'sonner';
import DisclaimerBanner from '@/components/DisclaimerBanner';

export default function CalculatorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const drugId = searchParams.get('drugId');
  const patientId = searchParams.get('patientId');
  const { patients } = usePatientStore();
  const existingPatient = patientId ? patients.find(p => p.id === patientId) : undefined;

  const [selectedDrug, setSelectedDrug] = useState(drugId || '');
  const [weight, setWeight] = useState(existingPatient?.weight?.toString() || '');
  const [age, setAge] = useState(existingPatient?.age?.toString() || '');
  const [ageUnit, setAgeUnit] = useState<'years' | 'months'>(existingPatient?.ageUnit || 'years');
  const [renal, setRenal] = useState<RenalFunction>(existingPatient?.renalFunction || 'normal');
  const [liver, setLiver] = useState<LiverDisease>(existingPatient?.liverDisease || 'none');
  const [showSteps, setShowSteps] = useState(false);

  const drug = drugs.find(d => d.id === selectedDrug);

  const result = useMemo(() => {
    if (!drug || !weight || !age) return null;
    const patient: Patient = {
      id: 'temp', age: Number(age), ageUnit, weight: Number(weight), height: 170,
      gender: 'male', asaStatus: 'II', diagnosis: '', renalFunction: renal, liverDisease: liver, createdAt: ''
    };
    return calculateDose(drug, patient);
  }, [drug, weight, age, ageUnit, renal, liver]);

  const copyResult = () => {
    if (!result) return;
    const text = `${result.drugName}: ${result.recommendedDose} ${result.unit}\nRange: ${result.doseRange.min}–${result.doseRange.max} ${result.unit}${result.infusionRate ? `\nInfusion: ${result.infusionRate.min}–${result.infusionRate.max} ${result.infusionRate.unit}` : ''}\n${result.alerts.join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-base font-semibold text-foreground">Dose Calculator</h1>
      </header>

      <div className="mx-auto max-w-lg space-y-4 p-4">
        {/* Drug selection */}
        <div className="space-y-1">
          <Label>Select Drug</Label>
          <Select value={selectedDrug} onValueChange={setSelectedDrug}>
            <SelectTrigger><SelectValue placeholder="Choose a drug..." /></SelectTrigger>
            <SelectContent>
              {drugs.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectedDrug && (
            <Button variant="outline" size="sm" className="mt-1" onClick={() => navigate('/drugs')}>
              Browse Drug Database
            </Button>
          )}
        </div>

        {/* Patient params */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label>Weight (kg)</Label>
            <Input type="number" placeholder="kg" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Age</Label>
            <Input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Unit</Label>
            <Select value={ageUnit} onValueChange={v => setAgeUnit(v as 'years' | 'months')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="years">Years</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Renal Function</Label>
            <Select value={renal} onValueChange={v => setRenal(v as RenalFunction)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['normal','mild','moderate','severe','dialysis'] as RenalFunction[]).map(r => (
                  <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Liver Disease</Label>
            <Select value={liver} onValueChange={v => setLiver(v as LiverDisease)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['none','mild','moderate','severe'] as LiverDisease[]).map(l => (
                  <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {existingPatient && (
          <p className="text-xs text-muted-foreground">Using patient: {existingPatient.name || `#${existingPatient.id.slice(0, 6)}`}</p>
        )}

        {/* RESULT */}
        {result && (
          <div className="space-y-3 pt-2">
            {/* Main result */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <h2 className="text-sm font-semibold text-primary">{result.drugName}</h2>
              <div className="text-3xl font-bold text-foreground">
                {result.recommendedDose} <span className="text-lg font-medium text-muted-foreground">{result.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Range: {result.doseRange.min}–{result.doseRange.max} {result.unit}
              </p>
              {result.infusionRate && (
                <div className="rounded-lg bg-info/10 border border-info/20 px-3 py-2">
                  <p className="text-xs font-medium text-info">Infusion Rate</p>
                  <p className="text-sm font-semibold text-foreground">
                    {result.infusionRate.min}–{result.infusionRate.max} {result.infusionRate.unit}
                  </p>
                </div>
              )}
            </div>

            {/* Alerts */}
            {result.alerts.length > 0 && (
              <div className="space-y-2">
                {result.alerts.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-2 rounded-lg px-3 py-2 text-sm ${
                    alert.includes('⛔') || alert.includes('⚠️')
                      ? 'bg-emergency/10 border border-emergency/20 text-emergency'
                      : 'bg-warning/10 border border-warning/20 text-warning'
                  }`}>
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Adjustments */}
            {(result.renalAdjustmentApplied || result.liverAdjustmentApplied) && (
              <div className="flex gap-2 flex-wrap">
                {result.renalAdjustmentApplied && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Renal ×{result.renalFactor}
                  </span>
                )}
                {result.liverAdjustmentApplied && (
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    Liver ×{result.liverFactor}
                  </span>
                )}
              </div>
            )}

            {/* Contraindications */}
            {result.contraindications.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-3 space-y-1">
                <h3 className="text-xs font-semibold text-foreground">Contraindications</h3>
                {result.contraindications.map((c, i) => (
                  <p key={i} className="text-xs text-muted-foreground">• {c}</p>
                ))}
              </div>
            )}

            {/* Calculation steps */}
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
            >
              <span className="text-xs font-medium text-foreground">Calculation Steps</span>
              {showSteps ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {showSteps && (
              <div className="rounded-lg border border-border bg-muted p-3 space-y-1">
                {result.calculationSteps.map((step, i) => (
                  <p key={i} className="text-xs text-muted-foreground font-mono">{i + 1}. {step}</p>
                ))}
              </div>
            )}

            {/* Clinical notes */}
            <div className="rounded-xl border border-border bg-card p-3 space-y-1">
              <h3 className="text-xs font-semibold text-foreground">Clinical Notes</h3>
              {result.clinicalNotes.split('\n').map((line, i) => (
                <p key={i} className="text-xs text-muted-foreground">{line}</p>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={copyResult} variant="outline" size="sm" className="gap-1.5">
                <Copy className="h-3.5 w-3.5" /> Copy
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('PDF export coming soon')}>
                <FileText className="h-3.5 w-3.5" /> PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info('Saved to patient')}>
                <Bookmark className="h-3.5 w-3.5" /> Save
              </Button>
            </div>

            <DisclaimerBanner />
          </div>
        )}
      </div>
    </div>
  );
}
