import { VideoProject, ScriptSection, PlatformKey, PlatformPublishStatus } from '../types';

export const SECTION_PRESETS = [
  { title: 'Hook', description: '0-5s attention grabber' },
  { title: 'Introduction', description: 'Topic overview & viewer expectations' },
  { title: 'Main Point #1', description: 'Core demonstration or key insight' },
  { title: 'Main Point #2', description: 'Secondary step or deep dive' },
  { title: 'B-Roll / Visuals', description: 'Cutaways, B-roll, screen capture' },
  { title: 'Call to Action', description: 'Subscribe, comments, description links' },
  { title: 'Outro', description: 'Conclusion & next video teaser' },
];

export const PLATFORM_METADATA: Record<PlatformKey, { name: string; color: string; bgColor: string; urlHint: string }> = {
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.12)',
    urlHint: 'youtube.com/upload',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.12)',
    urlHint: 'linkedin.com/feed',
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bgColor: 'rgba(24, 119, 242, 0.12)',
    urlHint: 'facebook.com',
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    bgColor: 'rgba(228, 64, 95, 0.12)',
    urlHint: 'instagram.com',
  },
  tiktok: {
    name: 'TikTok',
    color: '#00F2FE',
    bgColor: 'rgba(0, 242, 254, 0.12)',
    urlHint: 'tiktok.com/upload',
  },
};

export function createDefaultPublishingStatus(): Record<PlatformKey, PlatformPublishStatus> {
  return {
    youtube: { published: false },
    linkedin: { published: false },
    facebook: { published: false },
    instagram: { published: false },
    tiktok: { published: false },
  };
}

export function createNewSection(title: string = 'New Section', content: string = '', order: number = 0): ScriptSection {
  return {
    id: `sec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    order,
    title,
    content,
    filmed: false,
    inserted: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export function createNewProject(title: string): VideoProject {
  const now = Date.now();
  return {
    id: `proj_${now}_${Math.random().toString(36).substring(2, 7)}`,
    title: title.trim() || 'Untitled Video Project',
    status: 'active',
    createdAt: now,
    updatedAt: now,
    sections: [],
    publishing: createDefaultPublishingStatus(),
    targetPlatforms: ['youtube', 'linkedin', 'facebook', 'instagram', 'tiktok'],
  };
}

export const SAMPLE_PROJECTS: VideoProject[] = [
  {
    id: 'demo_proj_1',
    title: 'Top 5 Productivity Hacks for Creators',
    description: 'A punchy video breaking down automated workflows and time-saving editing tricks.',
    status: 'active',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 3600000,
    targetPlatforms: ['youtube', 'linkedin', 'facebook', 'instagram', 'tiktok'],
    publishing: {
      youtube: { published: false },
      linkedin: { published: false },
      facebook: { published: false },
      instagram: { published: false },
      tiktok: { published: false },
    },
    sections: [
      {
        id: 'demo_sec_1',
        order: 0,
        title: 'Hook',
        content: 'Most creators spend 80% of their time on tasks that can be completely automated in 5 minutes.',
        filmed: true,
        inserted: true,
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'demo_sec_2',
        order: 1,
        title: 'Introduction',
        content: 'Today I am breaking down 5 battle-tested workflow tweaks that will double your editing speed.',
        filmed: true,
        inserted: true,
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 2,
      },
      {
        id: 'demo_sec_3',
        order: 2,
        title: 'Main Point #1 — Batch Recording',
        content: 'Record all A-roll in one lighting setup before touching any B-roll or graphics.',
        filmed: true,
        inserted: false,
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000,
      },
      {
        id: 'demo_sec_4',
        order: 3,
        title: 'Main Point #2 — Keyboard Macros',
        content: 'Show screen recording of ripple delete and custom J/K/L navigation bindings.',
        filmed: false,
        inserted: false,
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 3,
      },
      {
        id: 'demo_sec_5',
        order: 4,
        title: 'Call to Action & Outro',
        content: 'Drop your favorite editing shortcut in the comments, and download the free cheat sheet below!',
        filmed: false,
        inserted: false,
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 3,
      },
    ],
  },
  {
    id: 'demo_proj_2',
    title: 'How I Built My Dream Desk Setup for $500',
    description: 'Budget-friendly minimalist studio tour showing cable management and soft lighting.',
    status: 'completed',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now() - 86400000 * 2,
    completedAt: Date.now() - 86400000 * 2,
    targetPlatforms: ['youtube', 'linkedin', 'facebook', 'instagram', 'tiktok'],
    publishing: {
      youtube: { published: true, publishedAt: Date.now() - 86400000 * 2 },
      linkedin: { published: true, publishedAt: Date.now() - 86400000 * 2 },
      facebook: { published: true, publishedAt: Date.now() - 86400000 * 2 },
      instagram: { published: true, publishedAt: Date.now() - 86400000 * 2 },
      tiktok: { published: true, publishedAt: Date.now() - 86400000 * 2 },
    },
    sections: [
      {
        id: 'demo2_sec_1',
        order: 0,
        title: 'Hook',
        content: 'You do NOT need a $5,000 budget to get professional-looking video lighting.',
        filmed: true,
        inserted: true,
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 5,
      },
      {
        id: 'demo2_sec_2',
        order: 1,
        title: 'Desk & Mounts',
        content: 'IKEA tabletop with adjustable legs and dual monitor gas springs.',
        filmed: true,
        inserted: true,
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 5,
      },
      {
        id: 'demo2_sec_3',
        order: 2,
        title: 'Key Light & Diffusion',
        content: 'Softbox bounce technique against the white wall.',
        filmed: true,
        inserted: true,
        createdAt: Date.now() - 86400000 * 10,
        updatedAt: Date.now() - 86400000 * 5,
      },
    ],
  },
];
