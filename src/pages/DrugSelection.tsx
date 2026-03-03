import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Star, ArrowLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { drugs } from '@/data/drugs';
import { categoryLabels, } from '@/data/drugs';
import { DrugCategory } from '@/types/medical';
import { useFavorites } from '@/hooks/useFavorites';

const categories: DrugCategory[] = ['induction', 'muscle_relaxants', 'analgesics', 'sedatives', 'vasopressors', 'emergency'];

export default function DrugSelection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<DrugCategory | 'all'>('all');
  const { isFav, toggle } = useFavorites();

  const filtered = useMemo(() => {
    let list = drugs;
    if (activeCategory !== 'all') list = list.filter(d => d.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.genericName.toLowerCase().includes(q));
    }
    // Sort favorites first
    return [...list].sort((a, b) => (isFav(b.id) ? 1 : 0) - (isFav(a.id) ? 1 : 0));
  }, [search, activeCategory, isFav]);

  const selectDrug = (drugId: string) => {
    const params = new URLSearchParams();
    params.set('drugId', drugId);
    if (patientId) params.set('patientId', patientId);
    navigate(`/calculator?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => navigate(-1)} className="text-muted-foreground"><ArrowLeft className="h-5 w-5" /></button>
          <h1 className="text-base font-semibold text-foreground">Drug Database</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search drugs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </header>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
          }`}
        >All</button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? cat === 'emergency' ? 'bg-emergency text-emergency-foreground' : 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >{categoryLabels[cat]}</button>
        ))}
      </div>

      {/* Drug list */}
      <div className="mx-auto max-w-lg px-4 space-y-2">
        {filtered.map(drug => (
          <div
            key={drug.id}
            className={`flex items-center gap-3 rounded-xl border p-3 shadow-sm card-hover ${
              drug.category === 'emergency' ? 'border-emergency/20 bg-emergency/5' : 'border-border bg-card'
            }`}
          >
            <button onClick={() => toggle(drug.id)} className="shrink-0">
              <Star className={`h-5 w-5 ${isFav(drug.id) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} />
            </button>
            <button onClick={() => selectDrug(drug.id)} className="flex flex-1 items-center justify-between text-left">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">{drug.name}</h3>
                <p className="text-xs text-muted-foreground">{drug.genericName} • {drug.route}</p>
                <p className="text-xs text-muted-foreground">{drug.adultDose.min}–{drug.adultDose.max} {drug.adultDose.unit}/{drug.adultDose.per}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No drugs found</p>
        )}
      </div>
    </div>
  );
}
