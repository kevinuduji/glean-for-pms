export type StripeRevenueData = {
  month: string;
  revenue: number;
  churn: number;
};

export const stripeRevenue: StripeRevenueData[] = [
  { month: "Sep", revenue: 84000, churn: 2.1 },
  { month: "Oct", revenue: 92000, churn: 1.9 },
  { month: "Nov", revenue: 105000, churn: 1.7 },
  { month: "Dec", revenue: 118000, churn: 2.2 },
  { month: "Jan", revenue: 132000, churn: 1.8 },
  { month: "Feb", revenue: 145000, churn: 1.5 },
];

export const stripeSubscriptionTiers = [
  { name: "Starter", users: 1240, price: 49 },
  { name: "Professional", users: 840, price: 99 },
  { name: "Enterprise", users: 112, price: 499 },
];

export const stripeRecentCharges = [
  { id: "ch_3O4n...", amount: 99.0, customer: "Acme Corp", status: "succeeded", date: "2m ago" },
  { id: "ch_3O4m...", amount: 49.0, customer: "Starlight Inc", status: "succeeded", date: "15m ago" },
  { id: "ch_3O4l...", amount: 499.0, customer: "Globex", status: "failed", date: "1h ago" },
  { id: "ch_3O4k...", amount: 99.0, customer: "Initech", status: "succeeded", date: "3h ago" },
];
