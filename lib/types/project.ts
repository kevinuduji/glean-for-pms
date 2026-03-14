export type Project = {
  id: string;
  name: string;
  color: string;
  icon: string | null; // Lucide icon name, or null → use first letter
  createdAt: string;
  // Discovery & access
  isPublic: boolean;       // true = anyone can join; false = invite code required
  inviteCode?: string;     // required for private projects
  description?: string;   // shown in ProjectBrowser cards
  memberCount?: number;   // shown in ProjectBrowser cards
  isEnterprise?: boolean; // pre-seeded org project (not user-created personal)
};

export const PROJECT_COLORS = [
  'indigo', 'emerald', 'violet', 'rose', 'amber', 'sky', 'orange', 'teal', 'slate',
] as const;

export type ProjectColor = typeof PROJECT_COLORS[number];

export const PROJECT_ICONS = [
  'Smartphone', 'Globe', 'Rocket', 'Building2', 'ShoppingCart', 'Zap', 'Shield',
  'BarChart2', 'Layers', 'Cpu', 'Users', 'Package', 'Target', 'Megaphone',
  'CreditCard', 'Headphones', 'Settings2', 'Store',
] as const;

export type ProjectIcon = typeof PROJECT_ICONS[number];
