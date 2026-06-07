export type ProcedureCategory = 'Robot' | 'Soldadura' | 'Mantenimiento';
export type ProcedureFilter = 'Todos' | ProcedureCategory;

const CHIP_CLASSES: Record<ProcedureCategory, string> = {
  Robot: 'bg-sky-500/25 text-sky-100 border border-sky-400/40',
  Soldadura: 'bg-amber-500/25 text-amber-100 border border-amber-400/40',
  Mantenimiento: 'bg-emerald-500/25 text-emerald-100 border border-emerald-400/40',
};

const FILTER_IDLE: Record<ProcedureFilter, string> = {
  Todos: 'bg-slate-700/70 text-slate-100 border border-slate-500/40',
  Robot: 'bg-sky-500/15 text-sky-100 border border-sky-400/40',
  Soldadura: 'bg-amber-500/15 text-amber-100 border border-amber-400/40',
  Mantenimiento: 'bg-emerald-500/15 text-emerald-100 border border-emerald-400/40',
};

const FILTER_ACTIVE: Record<ProcedureFilter, string> = {
  Todos: 'bg-slate-200 text-ink border border-slate-200',
  Robot: 'bg-sky-400 text-ink border border-sky-300',
  Soldadura: 'bg-amber-400 text-ink border border-amber-300',
  Mantenimiento: 'bg-emerald-400 text-ink border border-emerald-300',
};

export function categoryChipClass(category: ProcedureCategory): string {
  return CHIP_CLASSES[category];
}

export function categoryFilterClass(filter: ProcedureFilter, active: boolean): string {
  return active ? FILTER_ACTIVE[filter] : FILTER_IDLE[filter];
}
