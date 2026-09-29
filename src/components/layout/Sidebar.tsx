import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import LibraryBooksIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import CodeIcon from '@mui/icons-material/Code';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  onOpenShortcuts: () => void;
  totalSnippets: number;
  totalRuns: number;
  remainingTopics: number;
}

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: <DashboardIcon /> },
  { path: '/runs', label: 'Runs', icon: <HistoryIcon />, badgeKey: 'runs' },
  { path: '/library', label: 'Library', icon: <LibraryBooksIcon />, badgeKey: 'snippets' },
  { path: '/topics', label: 'Topics', icon: <CategoryIcon />, badgeKey: 'topics' },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
  onOpenShortcuts,
  totalSnippets,
  totalRuns,
  remainingTopics,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const getBadgeValue = (key?: string) => {
    if (key === 'runs') return totalRuns;
    if (key === 'snippets') return totalSnippets;
    if (key === 'topics') return remainingTopics;
    return undefined;
  };

  const drawerContent = (
    <Box
      style={{
        width: collapsed && !isMobile ? 72 : 240,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? '#0a0d14' : '#ffffff',
        borderRight: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowX: 'hidden',
      }}
    >
      {/* Sidebar Header */}
      <Box
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'space-between',
          padding: collapsed && !isMobile ? '0' : '0 16px',
          borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {(!collapsed || isMobile) && (
          <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Box
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#07090e',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <CodeIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" style={{ fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                Daily Code
              </Typography>

              <Typography variant="caption" color="text.secondary" style={{ fontSize: '0.68rem' }}>
                GitHub Monitor
              </Typography>
            </Box>
          </Box>
        )}

        {collapsed && !isMobile && (
          <Box
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#07090e',
            }}
          >
            <CodeIcon fontSize="small" />
          </Box>
        )}

        {!isMobile && (
          <IconButton size="small" onClick={onToggleCollapse} style={{ color: theme.palette.text.secondary }}>
            {collapsed ? <ChevronRightIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>

      {/* Navigation List */}
      <List style={{ padding: '12px 8px', flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          const badgeVal = getBadgeValue(item.badgeKey);

          return (
            <ListItem key={item.path} disablePadding style={{ marginBottom: 4 }}>
              <Tooltip title={collapsed && !isMobile ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) onMobileClose();
                  }}
                  sx={{
                    borderRadius: '10px',
                    minHeight: 44,
                    padding: collapsed && !isMobile ? '0 14px' : '0 12px',
                    justifyContent: collapsed && !isMobile ? 'center' : 'initial',
                    backgroundColor: isActive
                      ? theme.palette.mode === 'dark'
                        ? 'rgba(16, 185, 129, 0.12)'
                        : 'rgba(5, 153, 105, 0.1)'
                      : 'transparent',
                    borderLeft: isActive
                      ? '3px solid #10b981'
                      : '3px solid transparent',
                    color: isActive
                      ? '#10b981'
                      : theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.text.primary,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      marginRight: collapsed && !isMobile ? 0 : 2,
                      justifyContent: 'center',
                      color: isActive ? '#10b981' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {(!collapsed || isMobile) && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        style: {
                          fontWeight: isActive ? 700 : 500,
                          letterSpacing: '-0.01em',
                        },
                      }}
                    />
                  )}

                  {(!collapsed || isMobile) && badgeVal !== undefined && (
                    <Chip
                      label={badgeVal}
                      size="small"
                      style={{
                        height: 20,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                        color: isActive ? '#10b981' : theme.palette.text.secondary,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Footer / Shortcuts Cheat-sheet Button */}
      <Box style={{ padding: 12, borderTop: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)' }}>
        <Tooltip title="Keyboard Shortcuts (?)" placement="right">
          <ListItemButton
            onClick={onOpenShortcuts}
            sx={{
              borderRadius: '10px',
              padding: '8px 12px',
              justifyContent: collapsed && !isMobile ? 'center' : 'initial',
              color: theme.palette.text.secondary,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, marginRight: collapsed && !isMobile ? 0 : 2 }}>
              <KeyboardIcon fontSize="small" />
            </ListItemIcon>
            {(!collapsed || isMobile) && (
              <ListItemText
                primary="Shortcuts"
                primaryTypographyProps={{ variant: 'caption', style: { fontWeight: 600 } }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return drawerContent;
};
