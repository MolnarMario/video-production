import { VideoProject, AppDataExport, ValidationResult, PlatformKey, ScriptSection } from '../types';
import { ALL_PLATFORMS } from '../utils/progressCalculator';
import { createDefaultPublishingStatus } from '../utils/defaults';

export const backupService = {
  /**
   * Generates a downloadable JSON file containing all projects and metadata.
   */
  exportData(projects: VideoProject[]): void {
    const exportPayload: AppDataExport = {
      version: 1,
      exportedAt: new Date().toISOString(),
      app: 'video-production-tracker',
      projects,
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `video-production-tracker-backup-${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Validates and sanitizes imported JSON data.
   */
  validateImportData(jsonContent: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitizedProjects: VideoProject[] = [];

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonContent);
    } catch {
      return {
        isValid: false,
        projects: [],
        errors: ['Invalid JSON file format. Could not parse file.'],
        warnings: [],
      };
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        isValid: false,
        projects: [],
        errors: ['The uploaded file does not contain a valid JSON object or array.'],
        warnings: [],
      };
    }

    let projectArray: unknown[] = [];
    if (Array.isArray(parsed)) {
      projectArray = parsed;
      warnings.push('Bare array format detected. Standardizing schema.');
    } else {
      const payload = parsed as Partial<AppDataExport>;
      if (Array.isArray(payload.projects)) {
        projectArray = payload.projects;
      } else {
        return {
          isValid: false,
          projects: [],
          errors: ['No "projects" array found in the uploaded backup file.'],
          warnings: [],
        };
      }
    }

    if (projectArray.length === 0) {
      warnings.push('The backup file contains 0 projects.');
    }

    projectArray.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        warnings.push(`Project at index #${index} is not an object. Skipped.`);
        return;
      }

      const p = item as Record<string, unknown>;
      const projectId = typeof p.id === 'string' && p.id.trim()
        ? p.id.trim()
        : `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      const title = typeof p.title === 'string' && p.title.trim()
        ? p.title.trim()
        : `Imported Project #${index + 1}`;

      const status: 'active' | 'completed' | 'scrapped' =
        p.status === 'completed' || p.status === 'scrapped' || p.status === 'active'
          ? p.status
          : 'active';

      const createdAt = typeof p.createdAt === 'number' ? p.createdAt : Date.now();
      const updatedAt = typeof p.updatedAt === 'number' ? p.updatedAt : Date.now();

      // Validate sections
      const sanitizedSections: ScriptSection[] = [];
      if (Array.isArray(p.sections)) {
        p.sections.forEach((secItem, secIdx) => {
          if (secItem && typeof secItem === 'object') {
            const sec = secItem as Record<string, unknown>;
            sanitizedSections.push({
              id: typeof sec.id === 'string' && sec.id.trim()
                ? sec.id.trim()
                : `sec_${Date.now()}_${secIdx}`,
              order: typeof sec.order === 'number' ? sec.order : secIdx,
              title: typeof sec.title === 'string' ? sec.title : `Section ${secIdx + 1}`,
              content: typeof sec.content === 'string' ? sec.content : '',
              filmed: Boolean(sec.filmed),
              inserted: Boolean(sec.inserted),
              createdAt: typeof sec.createdAt === 'number' ? sec.createdAt : Date.now(),
              updatedAt: typeof sec.updatedAt === 'number' ? sec.updatedAt : Date.now(),
            });
          }
        });
      }

      sanitizedSections.sort((a, b) => a.order - b.order);

      // Validate publishing
      const defaultPub = createDefaultPublishingStatus();
      if (p.publishing && typeof p.publishing === 'object') {
        const rawPub = p.publishing as Record<string, unknown>;
        ALL_PLATFORMS.forEach((plat: PlatformKey) => {
          if (rawPub[plat] && typeof rawPub[plat] === 'object') {
            const platObj = rawPub[plat] as Record<string, unknown>;
            defaultPub[plat] = {
              published: Boolean(platObj.published),
              publishedAt: typeof platObj.publishedAt === 'number' ? platObj.publishedAt : undefined,
            };
          }
        });
      }

      sanitizedProjects.push({
        id: projectId,
        title,
        description: typeof p.description === 'string' ? p.description : undefined,
        status,
        createdAt,
        updatedAt,
        completedAt: typeof p.completedAt === 'number' ? p.completedAt : undefined,
        scrappedAt: typeof p.scrappedAt === 'number' ? p.scrappedAt : undefined,
        sections: sanitizedSections,
        publishing: defaultPub,
        targetPlatforms: Array.isArray(p.targetPlatforms)
          ? (p.targetPlatforms.filter((x): x is PlatformKey => ALL_PLATFORMS.includes(x as PlatformKey)))
          : ALL_PLATFORMS,
        targetDate: typeof p.targetDate === 'string' ? p.targetDate : undefined,
        category: typeof p.category === 'string' ? p.category : undefined,
      });
    });

    return {
      isValid: errors.length === 0,
      projects: sanitizedProjects,
      errors,
      warnings,
    };
  },
};
