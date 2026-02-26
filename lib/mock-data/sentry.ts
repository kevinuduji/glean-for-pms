export type SentryError = {
  id: string;
  name: string;
  message: string;
  occurrences: number;
  usersAffected: number;
  firstSeen: string;
  lastSeen: string;
  service: string;
  severity: 'critical' | 'error' | 'warning';
};

export type ErrorTimeSeries = { date: string; count: number };

const validationErrorDates: ErrorTimeSeries[] = [
  ...Array.from({length: 30}, (_, i) => {
    const d = new Date('2023-10-01');
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().split('T')[0], count: (i * 3 + 7) % 4 };
  }),
  ...Array.from({length: 3}, (_, i) => {
    const d = new Date('2023-11-01');
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().split('T')[0], count: (i * 5 + 2) % 5 };
  }),
  ...Array.from({length: 26}, (_, i) => {
    const d = new Date('2023-11-04');
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().split('T')[0], count: Math.round(85 + ((i * 7 + 11) % 31)) };
  }),
];

const paymentErrorDates: ErrorTimeSeries[] = [
  ...Array.from({length: 35}, (_, i) => {
    const d = new Date('2023-10-27');
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().split('T')[0], count: (i * 2 + 3) % 3 };
  }),
  ...Array.from({length: 7}, (_, i) => {
    const d = new Date('2023-12-01');
    d.setDate(d.getDate() + i);
    return { date: d.toISOString().split('T')[0], count: Math.round(170 + ((i * 13 + 17) % 41)) };
  }),
];

export const sentryErrors: SentryError[] = [
  {
    id: 'err-001',
    name: 'ValidationError',
    message: "Invalid email format: '+' aliases not permitted",
    occurrences: 2847,
    usersAffected: 1923,
    firstSeen: '2023-11-04T08:14:23Z',
    lastSeen: '2023-11-29T23:58:12Z',
    service: 'onboarding-service',
    severity: 'error',
  },
  {
    id: 'err-002',
    name: 'PaymentGatewayTimeoutError',
    message: 'Payment gateway did not respond within 8000ms',
    occurrences: 1203,
    usersAffected: 847,
    firstSeen: '2023-12-01T14:23:47Z',
    lastSeen: '2023-12-07T22:01:09Z',
    service: 'payments-service',
    severity: 'critical',
  },
  {
    id: 'err-003',
    name: 'TypeError',
    message: "Cannot read properties of undefined (reading 'plan')",
    occurrences: 412,
    usersAffected: 318,
    firstSeen: '2023-10-15T11:22:04Z',
    lastSeen: '2023-11-28T17:44:21Z',
    service: 'billing-service',
    severity: 'error',
  },
  {
    id: 'err-004',
    name: 'ChunkLoadError',
    message: 'Loading chunk 47 failed (missing: /static/chunks/47.js)',
    occurrences: 891,
    usersAffected: 654,
    firstSeen: '2023-10-02T09:11:31Z',
    lastSeen: '2023-11-30T16:22:54Z',
    service: 'frontend',
    severity: 'warning',
  },
  {
    id: 'err-005',
    name: 'DatabaseConnectionError',
    message: 'Max connection pool size exceeded',
    occurrences: 67,
    usersAffected: 0,
    firstSeen: '2023-11-18T03:44:12Z',
    lastSeen: '2023-11-28T05:12:33Z',
    service: 'reports-service',
    severity: 'critical',
  },
];

export const validationErrorTimeSeries: ErrorTimeSeries[] = validationErrorDates;
export const paymentErrorTimeSeries: ErrorTimeSeries[] = paymentErrorDates;
