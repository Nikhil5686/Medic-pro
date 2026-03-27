import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, ChevronRight, User, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Patient } from '@/types/medical';

export default function Patients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('patients');
      if (stored) {
        setPatients(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse patients from localStorage', e);
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents navigating to the edit page
    const updatedPatients = patients.filter((p) => p.id !== id);
    setPatients(updatedPatients);
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-base font-semibold text-foreground">Saved Patients</h1>
        </div>
        <Button size="sm" onClick={() => navigate('/patient/new')} className="gap-1.5">
          <Plus className="h-4 w-4" /> New
        </Button>
      </header>

      <div className="mx-auto max-w-lg space-y-2 p-4">
        {patients.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <User className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No saved patients yet</p>
            <Button onClick={() => navigate('/patient/new')} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Patient
            </Button>
          </div>
        ) : (
          patients.map(p => (
            <div key={p.id} className="flex w-full items-stretch gap-2">
              <button
                onClick={() => navigate(`/patient/new?edit=${p.id}`)}
                className="flex flex-1 items-center justify-between rounded-xl border border-border bg-card p-4 text-left shadow-sm card-hover"
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {p.name || `Patient #${p.id.slice(0, 6)}`}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {p.age} {p.ageUnit} • {p.weight}kg
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
              <Button
                variant="destructive"
                className="rounded-xl px-3 h-auto"
                onClick={(e) => handleDelete(p.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
