import { VideoProject, ProgressBreakdown, PlatformKey } from '../types';

export const ALL_PLATFORMS: PlatformKey[] = ['youtube', 'linkedin', 'facebook', 'instagram', 'tiktok'];

export interface ProgressWeights {
  filmingWeight: number;    // 0.40 (40%)
  editingWeight: number;    // 0.40 (40%)
  publishingWeight: number; // 0.20 (20%)
}

export const DEFAULT_WEIGHTS: ProgressWeights = {
  filmingWeight: 0.40,
  editingWeight: 0.40,
  publishingWeight: 0.20,
};

/**
 * Calculates a balanced progress breakdown for a video project.
 * Structured with modular weights so that many script sections don't
 * disproportionately overwhelm publishing milestones.
 */
export function calculateProjectProgress(
  project: VideoProject,
  weights: ProgressWeights = DEFAULT_WEIGHTS
): ProgressBreakdown {
  const sections = project.sections || [];
  const totalSections = sections.length;

  const filmedCount = sections.filter(s => s.filmed).length;
  const insertedCount = sections.filter(s => s.inserted).length;

  const targetPlatforms = project.targetPlatforms && project.targetPlatforms.length > 0
    ? project.targetPlatforms
    : ALL_PLATFORMS;
  const targetPlatformCount = targetPlatforms.length;

  const publishedCount = targetPlatforms.filter(
    platform => project.publishing && project.publishing[platform]?.published
  ).length;

  const allFilmed = totalSections > 0 && filmedCount === totalSections;
  const allInserted = totalSections > 0 && insertedCount === totalSections;
  const allPublished = targetPlatformCount > 0 && publishedCount === targetPlatformCount;

  const filmingScore = totalSections > 0 ? (filmedCount / totalSections) * 100 : 0;
  const editingScore = totalSections > 0 ? (insertedCount / totalSections) * 100 : 0;
  const publishingScore = targetPlatformCount > 0 ? (publishedCount / targetPlatformCount) * 100 : 0;

  let overallProgress = 0;
  if (totalSections === 0) {
    overallProgress = Math.round(publishingScore * weights.publishingWeight);
  } else {
    overallProgress = Math.round(
      (filmingScore * weights.filmingWeight) +
      (editingScore * weights.editingWeight) +
      (publishingScore * weights.publishingWeight)
    );
  }

  overallProgress = Math.min(100, Math.max(0, overallProgress));

  // If every task is done, ensure exactly 100%
  const isFullyComplete = totalSections > 0 && allFilmed && allInserted && allPublished;
  if (isFullyComplete) {
    overallProgress = 100;
  }

  return {
    totalSections,
    filmedCount,
    filmingScore: Math.round(filmingScore),
    insertedCount,
    editingScore: Math.round(editingScore),
    publishedCount,
    targetPlatformCount,
    publishingScore: Math.round(publishingScore),
    overallProgress,
    allFilmed,
    allInserted,
    allPublished,
    isFullyComplete,
  };
}
