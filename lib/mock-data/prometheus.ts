export type LatencyPoint = { timestamp: string; p50: number; p95: number; p99: number };

export const paymentsLatency: LatencyPoint[] = [
  ...Array.from({length: 48}, (_, i) => {
    const d = new Date('2023-11-29T00:00:00Z');
    d.setHours(d.getHours() + i);
    return {
      timestamp: d.toISOString(),
      p50: 180 + ((i * 7 + 11) % 41),
      p95: 340 + ((i * 11 + 17) % 61),
      p99: 520 + ((i * 13 + 23) % 81),
    };
  }),
  ...Array.from({length: 48}, (_, i) => {
    const d = new Date('2023-12-01T00:00:00Z');
    d.setHours(d.getHours() + i);
    const isSpikeZone = i >= 14 && i <= 47;
    return {
      timestamp: d.toISOString(),
      p50: isSpikeZone ? 4200 + ((i * 17 + 13) % 801) : 185 + ((i * 5 + 9) % 36),
      p95: isSpikeZone ? 8100 + ((i * 19 + 23) % 1201) : 345 + ((i * 7 + 11) % 56),
      p99: isSpikeZone ? 11200 + ((i * 23 + 31) % 1801) : 530 + ((i * 11 + 17) % 71),
    };
  }),
];

export const serviceHealth = [
  { service: 'api-gateway', status: 'healthy', uptime: 99.98, p95Latency: 142 },
  { service: 'auth-service', status: 'healthy', uptime: 99.99, p95Latency: 89 },
  { service: 'onboarding-service', status: 'degraded', uptime: 98.1, p95Latency: 920 },
  { service: 'payments-service', status: 'critical', uptime: 94.3, p95Latency: 8100 },
  { service: 'reports-service', status: 'healthy', uptime: 99.7, p95Latency: 380 },
  { service: 'notifications-service', status: 'healthy', uptime: 99.95, p95Latency: 210 },
];
