export type MixpanelFunnelStep = { name: string; count: number; conversionRate: number };

export const checkoutFunnel: MixpanelFunnelStep[] = [
  { name: 'Viewed pricing', count: 3240, conversionRate: 100 },
  { name: 'Clicked upgrade', count: 1944, conversionRate: 60 },
  { name: 'Opened checkout', count: 1555, conversionRate: 48 },
  { name: 'Entered payment info', count: 1244, conversionRate: 38 },
  { name: 'Confirmed order', count: 944, conversionRate: 29 },
];

export const ticketPM204 = {
  id: 'PM-204',
  title: 'Advanced Filters — Success Criteria',
  successCriteria: ['25% MAU adoption within 60 days', 'Measurable D30 retention lift among filter users'],
  status: 'met',
  linkedPR: 187,
};
