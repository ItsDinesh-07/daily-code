import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CommandPalette } from '../common/CommandPalette';
import { KeyboardShortcutsModal } from '../common/KeyboardShortcutsModal';
import { DailyFileMeta, RateLimitState } from '../../types';

interface MainLayoutProps {
  children: React.ReactNode;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  agentStatus: 'healthy' | 'running' | 'failed' | 'idle';
  agentMessage: string;
  rateLimitState: RateLimitState;
  isCached: boolean;
  onRefresh: () => void;
  totalSnippets: number;
  totalRuns: number;
  remainingTopics: number;
  dailyFiles: DailyFileMeta[];
  onSelectSnippet?: (file: DailyFileMeta) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  themeMode,
  onToggleTheme,
  agentStatus,
  agentMessage,
  rateLimitState,
  isCached,
  onRefresh,
  totalSnippets,
  totalRuns,
  remainingTopics,
  dailyFiles,
  onSelectSnippet,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cmdKOpen, setCmdKOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Global keydown handler for shortcuts
  useEffect(() => {
    let lastKey = '';
    let lastKeyTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      // Cmd+K / Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdKOpen((prev) => !prev);
        return;
      }

      // ? for shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
        return;
      }

      // Sequential 'G' then route key
      const now = Date.now();
      if (e.key.toLowerCase() === 'g') {
        lastKey = 'g';
        lastKeyTime = now;
        return;
      }

      if (lastKey === 'g' && now - lastKeyTime < 1000) {
        const k = e.key.toLowerCase();
        if (k === 'o') navigate('/');
        else if (k === 'r') navigate('/runs');
        else if (k === 'l') navigate('/library');
        else if (k === 't') navigate('/topics');
        else if (k === 's') navigate('/settings');
        lastKey = '';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <Box style={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Left Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        totalSnippets={totalSnippets}
        totalRuns={totalRuns}
        remainingTopics={remainingTopics}
      />

      {/* Main Content Area */}
      <Box style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCmdK={() => setCmdKOpen(true)}
          themeMode={themeMode}
          onToggleTheme={onToggleTheme}
          agentStatus={agentStatus}
          agentMessage={agentMessage}
          rateLimitState={rateLimitState}
          isCached={isCached}
          onRefresh={onRefresh}
        />

        {/* Route Page Container */}
        <Box
          component="main"
          style={{
            flexGrow: 1,
            padding: isMobile ? '16px' : '24px 32px',
            maxWidth: 1400,
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Command Palette Modal */}
      <CommandPalette
        open={cmdKOpen}
        onClose={() => setCmdKOpen(false)}
        dailyFiles={dailyFiles}
        onSelectSnippet={onSelectSnippet}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </Box>
  );
};
