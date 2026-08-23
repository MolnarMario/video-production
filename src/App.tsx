import React from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <AppLayout />
      </ProjectProvider>
    </ThemeProvider>
  );
}

export default App;
