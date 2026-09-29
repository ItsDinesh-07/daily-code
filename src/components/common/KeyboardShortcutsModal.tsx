import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  IconButton,
  Grid,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardIcon from '@mui/icons-material/Keyboard';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useTheme();

  const shortcuts = [
    { key: 'G then O', label: 'Go to Overview' },
    { key: 'G then R', label: 'Go to Runs' },
    { key: 'G then L', label: 'Go to Library' },
    { key: 'G then T', label: 'Go to Topics' },
    { key: 'G then S', label: 'Go to Settings' },
    { key: '⌘K / Ctrl+K', label: 'Open Command Palette' },
    { key: '/', label: 'Focus Search Bar' },
    { key: '?', label: 'Open Keyboard Shortcuts' },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        style: {
          backgroundColor: theme.palette.mode === 'dark' ? '#0d111a' : '#ffffff',
          borderRadius: 16,
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <DialogTitle
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 8,
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KeyboardIcon style={{ color: '#10b981' }} />
          <Typography variant="h6" style={{ fontWeight: 700 }}>
            Keyboard Shortcuts
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent style={{ paddingTop: 8 }}>
        <Grid container spacing={1.5}>
          {shortcuts.map((sc) => (
            <Grid item xs={12} key={sc.key}>
              <Box
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 10,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                  border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {sc.label}
                </Typography>
                <Box
                  component="span"
                  style={{
                    padding: '2px 8px',
                    borderRadius: 6,
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {sc.key}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
