import { useNavigate } from 'react-router-dom';
import { Calculator, Syringe, Heart, Baby, Wind, Star, Users, AlertCircle } from 'lucide-react';
import DisclaimerBanner from '@/components/DisclaimerBanner';

const cards = [
  { title: 'Drug Dose Calculator', desc: 'Calculate precise doses based on patient parameters', icon: Calculator, path: '/calculator', variant: 'default' as const },
  { title: 'Emergency Drugs', desc: 'Quick access to emergency medications', icon: AlertCircle, path: '/emergency', variant: 'emergency' as const },
  { title: 'Infusion Calculator', desc: 'Convert mcg/kg/min to ml/hr', icon: Syringe, path: '/drugs', variant: 'default' as const },
  { title: 'Pediatric Calculator', desc: 'Age & weight-based pediatric dosing', icon: Baby, path: '/calculator?pediatric=true', variant: 'default' as const },
  { title: 'Drug Reference', desc: 'Browse full drug database', icon: Wind, path: '/drugs', variant: 'default' as const },
  { title: 'Saved Patients', desc: 'Manage patient profiles', icon: Users, path: '/patients', variant: 'default' as const },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="medical-gradient px-4 pb-6 pt-10">
        <div className="mx-auto max-w-lg">
          <div className="flex items-center gap-3 mb-1">
            <img src="/app-icon.png" alt="ACC Dose Calculator" className="h-10 w-10 rounded-xl" />
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">ACC Dose Calculator</h1>
              <p className="text-xs text-primary-foreground/80">Anesthesia & Critical Care</p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 -mt-3 space-y-3">
        <DisclaimerBanner />

        {/* Cards */}
        <div className="grid grid-cols-2 gap-3">
          {cards.map(({ title, desc, icon: Icon, path, variant }) => (
            <button
              key={title}
              onClick={() => navigate(path)}
              className={`card-hover flex flex-col items-start gap-2 rounded-xl border p-4 text-left shadow-sm ${
                variant === 'emergency'
                  ? 'border-emergency/30 bg-emergency/5 emergency-pulse'
                  : 'border-border bg-card'
              }`}
            >
              <div className={`rounded-lg p-2 ${
                variant === 'emergency' ? 'bg-emergency/15 text-emergency' : 'bg-primary/10 text-primary'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className={`text-sm font-semibold ${
                  variant === 'emergency' ? 'text-emergency' : 'text-card-foreground'
                }`}>{title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Quick access */}
        <button
          onClick={() => navigate('/drugs')}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm card-hover"
        >
          <div className="rounded-lg bg-accent p-2">
            <Star className="h-5 w-5 text-accent-foreground" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-card-foreground">Favorites & Recent</h3>
            <p className="text-xs text-muted-foreground">Your frequently used drugs</p>
          </div>
        </button>
      </div>
    </div>
  );
}
