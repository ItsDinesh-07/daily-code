import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline } from '@mui/material';

import { createAppTheme } from './theme';
import { useDashboardData } from './hooks/useDashboardData';
import { MainLayout } from './components/layout/MainLayout';
import { Overview } from './pages/Overview';
import { Runs } from './pages/Runs';
import { Library } from './pages/Library';
import { Topics } from './pages/Topics';
import { Settings } from './pages/Settings';
import { DailyFileMeta } from './types';

const queryClient = new QueryClient();

export const AppContent: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('daily_code_theme_mode') as 'dark' | 'light') || 'dark';
  });

  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0);
  const [selectedSnippet, setSelectedSnippet] = useState<DailyFileMeta | null>(null);

  const dashboard = useDashboardData(autoRefreshInterval);

  const handleToggleTheme = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
    localStorage.setItem('daily_code_theme_mode', nextMode);
  };

  const theme = createAppTheme(themeMode);

  // Set Vite base path for React Router
  const basename = import.meta.env.BASE_URL || '/daily-code/';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={basename}>
        <MainLayout
          themeMode={themeMode}
          onToggleTheme={handleToggleTheme}
          agentStatus={dashboard.agentHealthStatus}
          agentMessage={dashboard.agentHealthMessage}
          rateLimitState={dashboard.rateLimitState}
          isCached={dashboard.isCached}
          onRefresh={dashboard.refetchAll}
          totalSnippets={dashboard.streakStats.totalSnippets}
          totalRuns={dashboard.runs.length}
          remainingTopics={dashboard.streakStats.remainingTopics}
          dailyFiles={dashboard.dailyFiles}
          onSelectSnippet={(file) => setSelectedSnippet(file)}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Overview
                  streakStats={dashboard.streakStats}
                  heroStatus={dashboard.agentHealthStatus}
                  heroMessage={dashboard.agentHealthMessage}
                  latestRun={dashboard.latestRun}
                  countdown={dashboard.countdown}
                  heatmapData={dashboard.heatmapData}
                  workflowRuns={dashboard.runs}
                  recentFiles={dashboard.dailyFiles}
                  onSelectSnippet={(file) => setSelectedSnippet(file)}
                />
              }
            />
            <Route
              path="/runs"
              element={<Runs workflowRuns={dashboard.runs} />}
            />
            <Route
              path="/library"
              element={
                <Library
                  dailyFiles={dashboard.dailyFiles}
                  selectedSnippet={selectedSnippet}
                  onSelectSnippet={(file) => setSelectedSnippet(file)}
                />
              }
            />
            <Route
              path="/topics"
              element={
                <Topics
                  topics={dashboard.topics}
                  allTopicsCount={dashboard.allTopicsCount}
                  usedTopicsCount={dashboard.usedTopicsCount}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Settings
                  themeMode={themeMode}
                  onToggleTheme={handleToggleTheme}
                  autoRefreshInterval={autoRefreshInterval}
                  onSetAutoRefreshInterval={(val) => setAutoRefreshInterval(val)}
                  onClearCache={dashboard.clearCache}
                  rateLimitState={dashboard.rateLimitState}
                />
              }
            />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
};

export default App;
