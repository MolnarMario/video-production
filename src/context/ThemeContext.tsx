import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark';
export type FontFamily =
  | 'jetbrains-mono'
  | 'barlow-condensed'
  | 'fraunces'
  | 'courier-prime'
  | 'cinzel'
  | 'architects-daughter';

export interface FontOption {
  id: FontFamily;
  name: string;
  fontFamily: string;
  genre: string;
  tagline: string;
  description: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    fontFamily: "'JetBrains Mono', monospace",
    genre: '⌨️ Developer Monospace',
    tagline: 'Precision Studio Terminal',
    description: 'Clean monospaced developer font. Fixed-width character alignment perfect for teleprompters & cue notes.',
  },
  {
    id: 'barlow-condensed',
    name: 'Barlow Condensed',
    fontFamily: "'Barlow Condensed', sans-serif",
    genre: '🎬 Cinematic Poster',
    tagline: 'Tall, High-Density Title Cards',
    description: 'Compact condensed letterforms reminiscent of cinematic movie credits and YouTube thumbnail titles.',
  },
  {
    id: 'fraunces',
    name: 'Fraunces Serif',
    fontFamily: "'Fraunces', Georgia, serif",
    genre: '🖋️ Classic Editorial',
    tagline: 'Literary Narrative & Warmth',
    description: 'Rich, high-contrast serif with soft curves, giving your workspace a published book / film script feel.',
  },
  {
    id: 'courier-prime',
    name: 'Courier Prime',
    fontFamily: "'Courier Prime', Courier, monospace",
    genre: '🎞️ Hollywood Screenplay',
    tagline: 'Industry-Standard Script Typewriter',
    description: 'The exact typeface used in professional film screenplays. Authentic mechanical typewriter character.',
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    fontFamily: "'Cinzel', Georgia, serif",
    genre: '🏛️ Cinematic Roman',
    tagline: 'Epic Movie Titles & Engraved Proportions',
    description: 'Inspired by classical Roman inscriptions. Imparts dramatic weight, authority, and cinematic prestige.',
  },
  {
    id: 'architects-daughter',
    name: 'Architects Daughter',
    fontFamily: "'Architects Daughter', cursive, sans-serif",
    genre: '✏️ Storyboard & Scribble',
    tagline: "Director's Hand-Sketched Notes",
    description: 'Casual, artistic handwritten flow with distinct creative flair. Feels like a live production sketchpad.',
  },
];

export interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  font: FontFamily;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setFont: (font: FontFamily) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem('video_tracker_theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch (e) {
    console.error('Error reading theme from localStorage:', e);
  }
  return 'dark';
}

function getInitialFont(): FontFamily {
  if (typeof window === 'undefined') return 'jetbrains-mono';
  try {
    const saved = localStorage.getItem('video_tracker_font') as FontFamily;
    if (FONT_OPTIONS.some(f => f.id === saved)) {
      return saved;
    }
  } catch (e) {
    console.error('Error reading font:', e);
  }
  return 'jetbrains-mono';
}

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const body = document.body;

  if (theme === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
    if (body) {
      body.classList.add('dark');
      body.classList.remove('light');
    }
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
    if (body) {
      body.classList.remove('dark');
      body.classList.add('light');
    }
  }

  try {
    localStorage.setItem('video_tracker_theme', theme);
  } catch (e) {
    console.error(e);
  }
}

function applyFont(font: FontFamily) {
  const root = document.documentElement;
  const body = document.body;

  // Remove all font classes
  FONT_OPTIONS.forEach(f => {
    root.classList.remove(`font-theme-${f.id}`);
    if (body) body.classList.remove(`font-theme-${f.id}`);
  });

  // Add active font class
  root.classList.add(`font-theme-${font}`);
  if (body) body.classList.add(`font-theme-${font}`);

  const fontObj = FONT_OPTIONS.find(f => f.id === font) || FONT_OPTIONS[0];
  root.style.setProperty('--font-custom', fontObj.fontFamily);

  try {
    localStorage.setItem('video_tracker_font', font);
  } catch (e) {
    console.error(e);
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [font, setFontState] = useState<FontFamily>(getInitialFont);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    applyFont(font);
  }, [font]);

  const toggleTheme = () => {
    setThemeState(prev => {
      const nextTheme: ThemeMode = prev === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
      return nextTheme;
    });
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const setFont = (newFont: FontFamily) => {
    setFontState(newFont);
    applyFont(newFont);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', font, toggleTheme, setTheme, setFont }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
