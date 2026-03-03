import { Home, Calculator, Syringe, Heart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/calculator', icon: Calculator, label: 'Calculator' },
  { path: '/drugs', icon: Syringe, label: 'Drugs' },
  { path: '/emergency', icon: Heart, label: 'Emergency' },
  { path: '/patients', icon: User, label: 'Patients' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card safe-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                active
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-primary' : ''}`} />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
