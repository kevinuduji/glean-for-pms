export type SectionFolder = {
  id: string;
  projectId: string; // workspace project ID (e.g. 'br-q4-roadmap')
  name: string;
  order: number;
};

export type Section = {
  id: string;
  projectId: string;
  folderId?: string; // undefined = standalone section
  name: string;
  description?: string;
  order: number;
  createdAt: string;
  isStatic?: boolean;
};
