import { describe, test, expect, beforeEach } from 'vitest';
import {
  getPerformanceActivity,
  recordPerformanceAction,
  resetPerformanceActivity
} from '../utils/performanceActivity.js';
import { DEFAULT_OPTIMIZATION_SETTINGS } from '../context/OptimizationContext.jsx';

describe('performanceActivity calculation', () => {
  beforeEach(() => {
    resetPerformanceActivity();
  });

  test('increases performance activity by 2 when all options are enabled', () => {
    const initial = getPerformanceActivity();
    expect(initial.cards + initial.handlers + initial.agenda).toBe(0);

    const allEnabledSettings = {
      memoCards: true,
      useCallbackHandlers: true,
      memoAgenda: true
    };

    recordPerformanceAction('edit event', allEnabledSettings);

    const updated = getPerformanceActivity();
    const totalActivity = updated.cards + updated.handlers + updated.agenda;
    expect(totalActivity).toBe(2);
    expect(updated.cards).toBe(2);
    expect(updated.handlers).toBe(0);
    expect(updated.agenda).toBe(0);
  });

  test('increases performance activity by 3 or more (6) when all options are disabled', () => {
    const initial = getPerformanceActivity();
    expect(initial.cards + initial.handlers + initial.agenda).toBe(0);

    const allDisabledSettings = {
      memoCards: false,
      useCallbackHandlers: false,
      memoAgenda: false
    };

    recordPerformanceAction('edit event', allDisabledSettings);

    const updated = getPerformanceActivity();
    const totalActivity = updated.cards + updated.handlers + updated.agenda;
    expect(totalActivity).toBeGreaterThanOrEqual(3);
    expect(totalActivity).toBe(6);
    expect(updated.cards).toBe(4);
    expect(updated.handlers).toBe(1);
    expect(updated.agenda).toBe(1);
  });
});
