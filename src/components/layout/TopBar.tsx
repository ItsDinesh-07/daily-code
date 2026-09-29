import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Tooltip,
  Button,
  useTheme,
  useMediaQuery,
  Chip,
  Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { CONFIG } from '../../config';
import { RateLimitState } from '../../types';

interface TopBarProps {
  onOpenMobileSidebar: () => void;
  onOpenCmdK: () => void;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  agentStatus: 'healthy' | 'running' | 'failed' | 'idle';
  agentMessage: string;
  rateLimitState: RateLimitState;
  isCached: boolean;
  onRefresh: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenMobileSidebar,
  onOpenCmdK,
  themeMode,
  onToggleTheme,
  agentStatus,
  agentMessage,
  rateLimitState,
  isCached,
  onRefresh,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Pulse color based on status
  let pulseColor = '#10b981'; // Green
  let statusText = 'Agent Healthy';
  if (agentStatus === 'running') {
    pulseColor = '#06b6d4'; // Cyan
    statusText = 'Workflow Executing';
  } else if (agentStatus === 'failed') {
    pulseColor = '#ef4444'; // Red
    statusText = 'Last Run Failed';
  }

  return (
    <Box
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(7, 9, 14, 0.85)' : 'rgba(248, 250, 252, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Left side: Mobile Menu Button & Status Indicator */}
      <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {isMobile && (
          <IconButton size="small" onClick={onOpenMobileSidebar}>
            <MenuIcon fontSize="small" />
          </IconButton>
        )}

        {/* Live Pulse Indicator Badge */}
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 10px',
            borderRadius: 20,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: pulseColor,
              boxShadow: `0 0 10px ${pulseColor}`,
              position: 'relative',
            }}
          />
          <Typography variant="caption" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>
            {statusText}
          </Typography>
        </Box>

        {/* Cached Data Warning Banner if Rate Limited */}
        {(rateLimitState.isRateLimited || isCached) && (
          <Tooltip title="Using local cached snapshot to respect GitHub API rate limits (60 req/hr).">
            <Chip
              icon={<WarningAmberIcon fontSize="small" />}
              label="Cached Data"
              size="small"
              color="warning"
              variant="outlined"
              style={{ height: 24, fontSize: '0.7rem' }}
            />
          </Tooltip>
        )}
      </Box>

      {/* Right side: Search, Theme Toggle, GitHub Links */}
      <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Command Palette Trigger */}
        <Button
          onClick={onOpenCmdK}
          variant="outlined"
          size="small"
          startIcon={<SearchIcon fontSize="small" />}
          style={{
            borderRadius: 10,
            padding: '4px 12px',
            textTransform: 'none',
            fontSize: '0.8rem',
            color: theme.palette.text.secondary,
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
            height: 36,
          }}
        >
          {!isMobile && 'Search commands...'}
          <Box
            component="span"
            style={{
              marginLeft: 8,
              padding: '1px 6px',
              borderRadius: 4,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
              fontSize: '0.68rem',
              fontWeight: 700,
            }}
          >
            ⌘K
          </Box>
        </Button>

        {/* Manual Data Refresh Button */}
        <Tooltip title="Refresh Data">
          <IconButton size="small" onClick={onRefresh}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} mode`}>
          <IconButton size="small" onClick={onToggleTheme}>
            {themeMode === 'dark' ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Open Actions Page */}
        {!isMobile && (
          <Button
            component="a"
            href={CONFIG.actionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="small"
            endIcon={<LaunchIcon fontSize="small" />}
            style={{
              height: 36,
              fontSize: '0.78rem',
              borderRadius: 10,
              borderColor: 'rgba(16, 185, 129, 0.3)',
              color: '#10b981',
            }}
          >
            Actions
          </Button>
        )}

        {/* Open Repository */}
        <Tooltip title="View GitHub Repository">
          <IconButton
            component="a"
            href={CONFIG.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
          >
            <GitHubIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};
