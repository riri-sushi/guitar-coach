export const PROGRESS_KEY = "guitar-coach:progress:v1";

export type ProgressRecord = {
  completedAt: string;
};

export type ProgressState = {
  steps: Record<string, ProgressRecord>;
  practiceDates: string[];
};

const EMPTY: ProgressState = { steps: {}, practiceDates: [] };

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      steps: parsed.steps ?? {},
      practiceDates: parsed.practiceDates ?? [],
    };
  } catch {
    return EMPTY;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  } catch {
    // quota / privacy mode — ignore
  }
}

export function toggleStep(state: ProgressState, stepId: string): ProgressState {
  const next = { ...state, steps: { ...state.steps } };
  if (next.steps[stepId]) {
    delete next.steps[stepId];
    return next;
  }
  const now = new Date();
  next.steps[stepId] = { completedAt: now.toISOString() };
  const today = formatDate(now);
  if (!next.practiceDates.includes(today)) {
    next.practiceDates = [...next.practiceDates, today].sort();
  }
  return next;
}

export function isCompleted(state: ProgressState, stepId: string): boolean {
  return Boolean(state.steps[stepId]);
}

export function calculateStreak(
  state: ProgressState,
  today: Date = new Date(),
): number {
  if (state.practiceDates.length === 0) return 0;
  const dateSet = new Set(state.practiceDates);
  let streak = 0;
  const cur = new Date(today);
  cur.setHours(0, 0, 0, 0);

  if (!dateSet.has(formatDate(cur))) {
    cur.setDate(cur.getDate() - 1);
  }

  while (dateSet.has(formatDate(cur))) {
    streak += 1;
    cur.setDate(cur.getDate() - 1);
  }
  return streak;
}

export function isPracticedToday(
  state: ProgressState,
  today: Date = new Date(),
): boolean {
  return state.practiceDates.includes(formatDate(today));
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
