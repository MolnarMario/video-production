export type ProjectStatus = 'active' | 'completed' | 'scrapped';

export type PlatformKey = 'youtube' | 'linkedin' | 'facebook' | 'instagram' | 'tiktok';

export interface ScriptSection {
  id: string;
  order: number;
  title: string;
  content: string;
  filmed: boolean;
  inserted: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface PlatformPublishStatus {
  published: boolean;
  publishedAt?: number;
}

export interface VideoProject {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  scrappedAt?: number;
  sections: ScriptSection[];
  publishing: Record<PlatformKey, PlatformPublishStatus>;
  targetPlatforms: PlatformKey[];
  targetDate?: string;
  category?: string;
}

export interface ProgressBreakdown {
  totalSections: number;
  filmedCount: number;
  filmingScore: number;       // 0 to 100%
  insertedCount: number;
  editingScore: number;       // 0 to 100%
  publishedCount: number;
  targetPlatformCount: number;
  publishingScore: number;    // 0 to 100%
  overallProgress: number;    // 0 to 100%
  allFilmed: boolean;
  allInserted: boolean;
  allPublished: boolean;
  isFullyComplete: boolean;
}

export interface AppDataExport {
  version: number;
  exportedAt: string;
  app: 'video-production-tracker';
  projects: VideoProject[];
}

export interface ValidationResult {
  isValid: boolean;
  projects: VideoProject[];
  errors: string[];
  warnings: string[];
}
