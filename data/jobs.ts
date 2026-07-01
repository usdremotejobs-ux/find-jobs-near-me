export type Job = {
  id: string;
  companyId: string;
  title: string;
  team: string;
  category: string;
  experienceLevel: string;
  skills: string[];
  shortDescription: string;
  applyUrl: string;
  postedAt: string;
};

export const jobs: Job[] = [];
