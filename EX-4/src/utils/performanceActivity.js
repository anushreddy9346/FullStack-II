let state = { cards: 0, handlers: 0, agenda: 0, lastAction: 'Ready' };
const listeners = new Set();

function emit() { listeners.forEach((listener) => listener({ ...state })); }

export function getPerformanceActivity() { return { ...state }; }
export function subscribePerformanceActivity(listener) { listeners.add(listener); return () => listeners.delete(listener); }

export function resetPerformanceActivity() {
  state = { cards: 0, handlers: 0, agenda: 0, lastAction: 'Reset to initial state' };
  emit();
}

// Counts only real calendar actions. The switches do not change the current
// value by themselves; they only change the amount of work added by FUTURE actions.
export function recordPerformanceAction(action, settings) {
  // Every real action has one small amount of necessary work.
  let cardsAdded = 2;
  let handlersAdded = 0;
  let agendaAdded = 0;

  // React.memo most directly affects repeated EventCard work.
  if (!settings.memoCards) cardsAdded += 2;

  // useCallback mainly affects handler identity and memoized children.
  if (!settings.useCallbackHandlers) handlersAdded += 1;

  // useMemo mainly affects repeated agenda calculations.
  if (!settings.memoAgenda) agendaAdded += 1;

  state = {
    cards: state.cards + cardsAdded,
    handlers: state.handlers + handlersAdded,
    agenda: state.agenda + agendaAdded,
    lastAction: action
  };
  emit();
}
