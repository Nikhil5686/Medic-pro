import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePatientStore } from '@/hooks/usePatientStore';
import { Patient, ASAStatus, RenalFunction, LiverDisease, Gender } from '@/types/medical';
import { toast } from 'sonner';

export default function PatientInput() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { patients, addPatient, updatePatient, deletePatient } = usePatientStore();
  const existing = editId ? patients.find(p => p.id === editId) : undefined;

  const [form, setForm] = useState({
    name: existing?.name || '',
    age: existing?.age?.toString() || '',
    ageUnit: existing?.ageUnit || 'years' as 'years' | 'months',
    weight: existing?.weight?.toString() || '',
    height: existing?.height?.toString() || '',
    gender: existing?.gender || 'male' as Gender,
    asaStatus: existing?.asaStatus || 'II' as ASAStatus,
    diagnosis: existing?.diagnosis || '',
    renalFunction: existing?.renalFunction || 'normal' as RenalFunction,
    liverDisease: existing?.liverDisease || 'none' as LiverDisease,
  });

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    if (!form.age || !form.weight || !form.height) {
      toast.error('Please fill in age, weight, and height');
      return;
    }
    const data = {
      name: form.name,
      age: Number(form.age),
      ageUnit: form.ageUnit as 'years' | 'months',
      weight: Number(form.weight),
      height: Number(form.height),
      gender: form.gender,
      asaStatus: form.asaStatus,
      diagnosis: form.diagnosis,
      renalFunction: form.renalFunction,
      liverDisease: form.liverDisease,
    };
    if (editId) {
      updatePatient(editId, data);
      toast.success('Patient updated');
    } else {
      const p = addPatient(data);
      toast.success('Patient saved');
      navigate(`/calculator?patientId=${p.id}`);
      return;
    }
    navigate(-1);
  };

  const handleDelete = () => {
    if (editId) {
      deletePatient(editId);
      toast.success('Patient deleted');
      navigate('/patients');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></button>
        <h1 className="text-base font-semibold text-foreground">{editId ? 'Edit Patient' : 'New Patient'}</h1>
      </header>

      <div className="mx-auto max-w-lg space-y-4 p-4">
        <div className="space-y-1">
          <Label>Patient Name (optional)</Label>
          <Input placeholder="e.g. Patient #1" value={form.name} onChange={e => update('name', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Age *</Label>
            <Input type="number" placeholder="Age" value={form.age} onChange={e => update('age', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Unit</Label>
            <Select value={form.ageUnit} onValueChange={v => update('ageUnit', v)}>
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
            <Label>Weight (kg) *</Label>
            <Input type="number" placeholder="kg" value={form.weight} onChange={e => update('weight', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Height (cm) *</Label>
            <Input type="number" placeholder="cm" value={form.height} onChange={e => update('height', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label>Gender</Label>
            <Select value={form.gender} onValueChange={v => update('gender', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>ASA Status</Label>
            <Select value={form.asaStatus} onValueChange={v => update('asaStatus', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(['I','II','III','IV','V','VI'] as ASAStatus[]).map(s => (
                  <SelectItem key={s} value={s}>ASA {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Diagnosis</Label>
          <Input placeholder="e.g. Appendectomy" value={form.diagnosis} onChange={e => update('diagnosis', e.target.value)} />
        </div>

        <div className="space-y-1">
          <Label>Renal Function</Label>
          <Select value={form.renalFunction} onValueChange={v => update('renalFunction', v)}>
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
          <Select value={form.liverDisease} onValueChange={v => update('liverDisease', v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(['none','mild','moderate','severe'] as LiverDisease[]).map(l => (
                <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Save className="h-4 w-4" /> {editId ? 'Update' : 'Save & Calculate'}
          </Button>
          {editId && (
            <Button variant="destructive" onClick={handleDelete} className="gap-2">
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
