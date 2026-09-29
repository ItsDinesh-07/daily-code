import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  InputAdornment,
  Chip,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import LibraryBooksIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import { DailyFileMeta } from '../../types';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  dailyFiles: DailyFileMeta[];
  onSelectSnippet?: (file: DailyFileMeta) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  dailyFiles,
  onSelectSnippet,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) {
      setQuery('');
    }
  }, [open]);

  const navItems = [
    { label: 'Overview Page', path: '/', icon: <DashboardIcon fontSize="small" />, category: 'Navigation' },
    { label: 'Runs & Workflow History', path: '/runs', icon: <HistoryIcon fontSize="small" />, category: 'Navigation' },
    { label: 'Daily Code Library', path: '/library', icon: <LibraryBooksIcon fontSize="small" />, category: 'Navigation' },
    { label: 'Topics & Progress', path: '/topics', icon: <CategoryIcon fontSize="small" />, category: 'Navigation' },
    { label: 'Dashboard Settings', path: '/settings', icon: <SettingsIcon fontSize="small" />, category: 'Navigation' },
  ];

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const filteredSnippets = dailyFiles
    .filter(
      (f) =>
        f.parsedTitle?.toLowerCase().includes(query.toLowerCase()) ||
        f.dateStr.includes(query) ||
        f.topicSlug.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const handleSelectNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSelectFile = (file: DailyFileMeta) => {
    navigate('/library');
    if (onSelectSnippet) {
      onSelectSnippet(file);
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          backgroundColor: theme.palette.mode === 'dark' ? '#0d111a' : '#ffffff',
          borderRadius: 16,
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogContent style={{ padding: 16 }}>
        <TextField
          autoFocus
          fullWidth
          placeholder="Type a command or search code snippets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="ESC" size="small" style={{ fontSize: '0.65rem', height: 20 }} />
              </InputAdornment>
            ),
            style: {
              borderRadius: 12,
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
            },
          }}
        />

        <Box style={{ marginTop: 12, maxHeight: 360, overflowY: 'auto' }}>
          {filteredNav.length > 0 && (
            <Box style={{ marginBottom: 12 }}>
              <Typography variant="caption" color="text.secondary" style={{ padding: '0 8px', fontWeight: 700 }}>
                PAGES & NAVIGATION
              </Typography>
              <List disablePadding>
                {filteredNav.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelectNav(item.path)}
                      style={{ borderRadius: 10, margin: '2px 0' }}
                    >
                      <ListItemIcon style={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {filteredSnippets.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" style={{ padding: '0 8px', fontWeight: 700 }}>
                DAILY CODE SNIPPETS
              </Typography>
              <List disablePadding>
                {filteredSnippets.map((file) => (
                  <ListItem key={file.sha} disablePadding>
                    <ListItemButton
                      onClick={() => handleSelectFile(file)}
                      style={{ borderRadius: 10, margin: '2px 0' }}
                    >
                      <ListItemIcon style={{ minWidth: 32, color: '#10b981' }}>
                        <CodeIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={file.parsedTitle}
                        secondary={file.dateStr}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                      />
                      <Chip label={file.language} size="small" style={{ fontSize: '0.65rem', height: 18 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {filteredNav.length === 0 && filteredSnippets.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" style={{ padding: 24 }}>
              No matching commands or snippets found.
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
