import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, ChevronRight } from 'lucide-react';
import { drugs } from '@/data/drugs';

export default function EmergencyDrugs() {
  const navigate = useNavigate();
  const emergencyDrugs = drugs.filter(d => d.category === 'emergency');

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-emergency/20 bg-emergency/5 px-4 py-3">
        <button onClick={() => navigate(-1)} className="text-emergency"><ArrowLeft className="h-5 w-5" /></button>
        <AlertCircle className="h-5 w-5 text-emergency" />
        <h1 className="text-base font-bold text-emergency">Emergency Drugs</h1>
      </header>

      <div className="mx-auto max-w-lg space-y-2 p-4">
        {emergencyDrugs.map(drug => (
          <button
            key={drug.id}
            onClick={() => navigate(`/calculator?drugId=${drug.id}`)}
            className="flex w-full items-center justify-between rounded-xl border border-emergency/15 bg-card p-4 text-left shadow-sm card-hover"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-foreground">{drug.name}</h3>
              <p className="text-xs text-muted-foreground">
                {drug.adultDose.min}–{drug.adultDose.max} {drug.adultDose.unit}/{drug.adultDose.per} | {drug.route}
              </p>
              {drug.emergencyNotes && (
                <p className="text-xs text-emergency font-medium">{drug.emergencyNotes}</p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
