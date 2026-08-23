import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { VideoProject, ProjectStatus, PlatformKey, ScriptSection } from '../types';
import { storageService } from '../services/storageService';
import { createNewProject, createNewSection, SAMPLE_PROJECTS } from '../utils/defaults';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface ProjectContextType {
  projects: VideoProject[];
  activeProjectId: string | null;
  activeProject: VideoProject | null;
  activeProjects: VideoProject[];
  completedProjects: VideoProject[];
  scrappedProjects: VideoProject[];
  toasts: ToastMessage[];
  showToast: (type: ToastMessage['type'], title: string, message?: string) => void;
  removeToast: (id: string) => void;
  setActiveProjectId: (id: string | null) => void;
  createProject: (title: string) => VideoProject;
  updateProject: (id: string, updates: Partial<VideoProject>) => void;
  deleteProject: (id: string) => void;
  setProjectStatus: (id: string, status: ProjectStatus) => void;
  addSection: (projectId: string, title?: string, content?: string, atIndex?: number) => ScriptSection;
  updateSection: (projectId: string, sectionId: string, updates: Partial<ScriptSection>) => void;
  deleteSection: (projectId: string, sectionId: string) => void;
  reorderSections: (projectId: string, startIndex: number, endIndex: number) => void;
  toggleFilmed: (projectId: string, sectionId: string) => void;
  toggleInserted: (projectId: string, sectionId: string) => void;
  togglePlatformPublished: (projectId: string, platform: PlatformKey) => void;
  importProjects: (importedProjects: VideoProject[], mode: 'replace' | 'merge') => void;
  resetToDefaults: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<VideoProject[]>(() => storageService.loadProjects());
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(() => {
    const savedActive = storageService.getActiveProjectId();
    const initialProjects = storageService.loadProjects();
    if (savedActive && initialProjects.some(p => p.id === savedActive)) {
      return savedActive;
    }
    return initialProjects.length > 0 ? initialProjects[0].id : null;
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    storageService.saveProjects(projects);
  }, [projects]);

  const setActiveProjectId = useCallback((id: string | null) => {
    setActiveProjectIdState(id);
    storageService.setActiveProjectId(id);
  }, []);

  const showToast = useCallback((_type: ToastMessage['type'], _title: string, _message?: string) => {
    // Disabled slide-in toast notifications
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const activeProjects = useMemo(() => projects.filter(p => p.status === 'active'), [projects]);
  const completedProjects = useMemo(() => projects.filter(p => p.status === 'completed'), [projects]);
  const scrappedProjects = useMemo(() => projects.filter(p => p.status === 'scrapped'), [projects]);

  const activeProject = useMemo(() => {
    if (!activeProjectId) return null;
    return projects.find(p => p.id === activeProjectId) || null;
  }, [projects, activeProjectId]);

  const createProject = useCallback((title: string) => {
    const newProj = createNewProject(title);
    setProjects(prev => [newProj, ...prev]);
    setActiveProjectId(newProj.id);
    return newProj;
  }, [setActiveProjectId]);

  const updateProject = useCallback((id: string, updates: Partial<VideoProject>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: Date.now(),
        };
      }
      return p;
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (activeProjectId === id) {
        setActiveProjectId(remaining.length > 0 ? remaining[0].id : null);
      }
      return remaining;
    });
  }, [activeProjectId, setActiveProjectId]);

  const setProjectStatus = useCallback((id: string, status: ProjectStatus) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const now = Date.now();
        const updated: VideoProject = {
          ...p,
          status,
          updatedAt: now,
          completedAt: status === 'completed' ? now : undefined,
          scrappedAt: status === 'scrapped' ? now : undefined,
        };
        return updated;
      }
      return p;
    }));
  }, []);

  const addSection = useCallback((projectId: string, title?: string, content?: string, atIndex?: number) => {
    let createdSec: ScriptSection;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const existing = [...p.sections];
        const newOrder = atIndex !== undefined ? atIndex : existing.length;
        createdSec = createNewSection(title || 'New Section', content || '', newOrder);

        if (atIndex !== undefined) {
          existing.splice(atIndex, 0, createdSec);
        } else {
          existing.push(createdSec);
        }

        const reindexed = existing.map((sec, idx) => ({ ...sec, order: idx }));
        return {
          ...p,
          sections: reindexed,
          updatedAt: Date.now(),
        };
      }
      return p;
    }));

    return createdSec!;
  }, []);

  const updateSection = useCallback((projectId: string, sectionId: string, updates: Partial<ScriptSection>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          sections: p.sections.map(s => {
            if (s.id === sectionId) {
              return { ...s, ...updates, updatedAt: Date.now() };
            }
            return s;
          }),
          updatedAt: Date.now(),
        };
      }
      return p;
    }));
  }, []);

  const deleteSection = useCallback((projectId: string, sectionId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const filtered = p.sections.filter(s => s.id !== sectionId);
        const reindexed = filtered.map((sec, idx) => ({ ...sec, order: idx }));
        return {
          ...p,
          sections: reindexed,
          updatedAt: Date.now(),
        };
      }
      return p;
    }));
  }, []);

  const reorderSections = useCallback((projectId: string, startIndex: number, endIndex: number) => {
    if (startIndex === endIndex) return;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const list = [...p.sections].sort((a, b) => a.order - b.order);
        const [movedItem] = list.splice(startIndex, 1);
        list.splice(endIndex, 0, movedItem);
        const reindexed = list.map((sec, idx) => ({ ...sec, order: idx }));
        return {
          ...p,
          sections: reindexed,
          updatedAt: Date.now(),
        };
      }
      return p;
    }));
  }, []);

  const toggleFilmed = useCallback((projectId: string, sectionId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedSections = p.sections.map(s => {
          if (s.id === sectionId) {
            return {
              ...s,
              filmed: !s.filmed,
              updatedAt: Date.now(),
            };
          }
          return s;
        });

        return { ...p, sections: updatedSections, updatedAt: Date.now() };
      }
      return p;
    }));
  }, []);

  const toggleInserted = useCallback((projectId: string, sectionId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedSections = p.sections.map(s => {
          if (s.id === sectionId) {
            return {
              ...s,
              inserted: !s.inserted,
              updatedAt: Date.now(),
            };
          }
          return s;
        });

        return { ...p, sections: updatedSections, updatedAt: Date.now() };
      }
      return p;
    }));
  }, []);

  const togglePlatformPublished = useCallback((projectId: string, platform: PlatformKey) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const currentPub = p.publishing[platform] || { published: false };
        const nextPublished = !currentPub.published;
        const updatedPublishing = {
          ...p.publishing,
          [platform]: {
            published: nextPublished,
            publishedAt: nextPublished ? Date.now() : undefined,
          },
        };

        return { ...p, publishing: updatedPublishing, updatedAt: Date.now() };
      }
      return p;
    }));
  }, []);

  const importProjects = useCallback((importedProjects: VideoProject[], mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      setProjects(importedProjects);
      setActiveProjectId(importedProjects.length > 0 ? importedProjects[0].id : null);
    } else {
      setProjects(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const nonConflicting = importedProjects.filter(p => !existingIds.has(p.id));
        return [...prev, ...nonConflicting];
      });
    }
  }, [setActiveProjectId]);

  const resetToDefaults = useCallback(() => {
    setProjects(SAMPLE_PROJECTS);
    setActiveProjectId(SAMPLE_PROJECTS[0].id);
  }, [setActiveProjectId]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        activeProject,
        activeProjects,
        completedProjects,
        scrappedProjects,
        toasts,
        showToast,
        removeToast,
        setActiveProjectId,
        createProject,
        updateProject,
        deleteProject,
        setProjectStatus,
        addSection,
        updateSection,
        deleteSection,
        reorderSections,
        toggleFilmed,
        toggleInserted,
        togglePlatformPublished,
        importProjects,
        resetToDefaults,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
