import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePatientStore } from '@/hooks/usePatientStore';

export default function Patients() {
  const navigate = useNavigate();
  const { patients } = usePatientStore();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-semibold text-foreground">Saved Patients</h1>
        </div>
        <Button size="sm" onClick={() => navigate('/patient/new')} className="gap-1.5">
          <Plus className="h-4 w-4" /> New
        </Button>
      </header>

      <div className="mx-auto max-w-lg space-y-2 p-4">
        {patients.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <User className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No saved patients yet</p>
            <Button onClick={() => navigate('/patient/new')} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Patient
            </Button>
          </div>
        )}
        {patients.map(p => (
          <button
            key={p.id}
            onClick={() => navigate(`/patient/new?edit=${p.id}`)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-sm card-hover"
          >
            <div>
              <h3 className="text-sm font-semibold text-foreground">{p.name || `Patient #${p.id.slice(0, 6)}`}</h3>
              <p className="text-xs text-muted-foreground">
                {p.age} {p.ageUnit} • {p.weight}kg • {p.gender} • ASA {p.asaStatus}
              </p>
              {p.diagnosis && <p className="text-xs text-muted-foreground">{p.diagnosis}</p>}
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
