export type TimeSeriesPoint = { date: string; value: number };
export type FunnelStep = { step: string; count: number; dropRate: number };

function generateDates(startDate: string, days: number): string[] {
  const dates = [];
  const start = new Date(startDate);
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

const dates90 = generateDates('2023-09-01', 90);

export const dauTimeSeries: TimeSeriesPoint[] = dates90.map((date, i) => ({
  date,
  value: Math.round(950 + Math.sin(i / 7) * 120 + (((i * 7 + 13) % 17) * 5) - 40),
}));

export const signupFunnelNov: FunnelStep[] = [
  { step: 'Landed on /signup', count: 8420, dropRate: 0 },
  { step: 'Entered email', count: 6736, dropRate: 20 },
  { step: 'Email verified', count: 4446, dropRate: 34 },
  { step: 'Created password', count: 3912, dropRate: 12 },
  { step: 'Profile setup', count: 2303, dropRate: 41 },
  { step: 'Completed onboarding', count: 1935, dropRate: 16 },
];

export const signupFunnelOct: FunnelStep[] = [
  { step: 'Landed on /signup', count: 9100, dropRate: 0 },
  { step: 'Entered email', count: 7553, dropRate: 17 },
  { step: 'Email verified', count: 6920, dropRate: 8 },
  { step: 'Created password', count: 6228, dropRate: 10 },
  { step: 'Profile setup', count: 3661, dropRate: 41 },
  { step: 'Completed onboarding', count: 3076, dropRate: 16 },
];

export const checkoutCompletionSeries: TimeSeriesPoint[] = [
  ...generateDates('2023-11-24', 7).map(date => ({ date, value: 78 })),
  ...generateDates('2023-12-01', 7).map((date, i) => ({ date, value: i === 0 ? 61 : 62 + i })),
];

export const homepageConversionSeries: TimeSeriesPoint[] = [
  ...generateDates('2023-09-01', 43).map((date, i) => ({ date, value: parseFloat((3.1 + ((i * 3 + 7) % 11) * 0.04 - 0.2).toFixed(2)) })),
  ...generateDates('2023-10-14', 47).map((date, i) => ({ date, value: parseFloat((2.8 + ((i * 5 + 3) % 13) * 0.04 - 0.2).toFixed(2)) })),
];

export const featureAdoptionData = {
  advancedFilters: {
    uniqueUsers: 4891,
    percentMAU: 31,
    d30RetentionWithFeature: 67,
    d30RetentionWithout: 43,
    launchDate: '2023-09-22',
    prNumber: 187,
  },
};

export const onboardingFunnel: FunnelStep[] = [
  { step: 'Start onboarding', count: 5200, dropRate: 0 },
  { step: 'Step 1: Email verified', count: 4420, dropRate: 15 },
  { step: 'Step 2: Password set', count: 3980, dropRate: 10 },
  { step: 'Step 3: Profile setup', count: 2347, dropRate: 41 },
  { step: 'Step 4: Team invite', count: 2089, dropRate: 11 },
  { step: 'Step 5: Connect tool', count: 1843, dropRate: 12 },
  { step: 'Step 6: First action', count: 1640, dropRate: 11 },
  { step: 'Onboarding complete', count: 1492, dropRate: 9 },
];
