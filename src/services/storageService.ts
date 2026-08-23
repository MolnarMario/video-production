import { VideoProject } from '../types';
import { SAMPLE_PROJECTS } from '../utils/defaults';

const STORAGE_KEY = 'video_production_tracker_projects_v1';
const ACTIVE_PROJECT_KEY = 'video_production_tracker_active_id';

export const storageService = {
  /**
   * Loads all projects from localStorage.
   * If storage is uninitialized, seeds with initial sample projects.
   */
  loadProjects(): VideoProject[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveProjects(SAMPLE_PROJECTS);
        return SAMPLE_PROJECTS;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return SAMPLE_PROJECTS;
    } catch (err) {
      console.error('Failed to parse projects from localStorage:', err);
      return SAMPLE_PROJECTS;
    }
  },

  /**
   * Persists projects array to localStorage.
   */
  saveProjects(projects: VideoProject[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch (err) {
      console.error('Failed to save projects to localStorage:', err);
      return false;
    }
  },

  /**
   * Gets the last viewed project ID.
   */
  getActiveProjectId(): string | null {
    try {
      return localStorage.getItem(ACTIVE_PROJECT_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Sets the last viewed project ID.
   */
  setActiveProjectId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(ACTIVE_PROJECT_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_PROJECT_KEY);
      }
    } catch (err) {
      console.error('Failed to save active project ID:', err);
    }
  },

  /**
   * Clears all project data from localStorage.
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    } catch (err) {
      console.error('Failed to clear storage:', err);
    }
  },
};
