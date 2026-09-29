import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import DeleteIcon from '@mui/icons-material/Delete';
import StorageIcon from '@mui/icons-material/Storage';
import TuneIcon from '@mui/icons-material/Tune';
import { CONFIG } from '../config';
import { RateLimitState } from '../types';

interface SettingsProps {
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  autoRefreshInterval: number;
  onSetAutoRefreshInterval: (interval: number) => void;
  onClearCache: () => void;
  rateLimitState: RateLimitState;
}

export const Settings: React.FC<SettingsProps> = ({
  themeMode,
  onToggleTheme,
  autoRefreshInterval,
  onSetAutoRefreshInterval,
  onClearCache,
  rateLimitState,
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Box style={{ marginBottom: 24 }}>
        <Typography variant="h4" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Dashboard Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ marginTop: 4 }}>
          Manage visual preferences, rate-limit cache, and repository connection details.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Visual & Polling Preferences */}
        <Grid item xs={12} md={6}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: 24 }}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <TuneIcon style={{ color: '#10b981' }} />
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  Preferences
                </Typography>
              </Box>

              <Box style={{ marginBottom: 20 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={themeMode === 'dark'}
                      onChange={onToggleTheme}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      Dark Mode Theme
                    </Typography>
                  }
                />
                <Typography variant="caption" color="text.secondary" style={{ display: 'block', marginLeft: 48 }}>
                  High-contrast dark dashboard inspired by Linear and Vercel.
                </Typography>
              </Box>

              <Divider style={{ margin: '20px 0' }} />

              <Box>
                <Typography variant="body1" style={{ fontWeight: 600, marginBottom: 8 }}>
                  Auto-Refresh Polling Interval
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel>Polling Frequency</InputLabel>
                  <Select
                    value={autoRefreshInterval}
                    label="Polling Frequency"
                    onChange={(e) => onSetAutoRefreshInterval(Number(e.target.value))}
                  >
                    {CONFIG.autoRefreshIntervals.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary" style={{ display: 'block', marginTop: 8 }}>
                  Automatically re-fetches GitHub workflow runs and files in the background.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cache & Rate Limit Management */}
        <Grid item xs={12} md={6}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: 24 }}>
              <Box style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <StorageIcon style={{ color: '#06b6d4' }} />
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  Cache & API Limits
                </Typography>
              </Box>

              <Box style={{ padding: 14, borderRadius: 12, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)', marginBottom: 20 }}>
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body2" style={{ fontWeight: 600 }}>
                    GitHub API Rate Limit:
                  </Typography>
                  <Chip
                    label={`${rateLimitState.remaining} / ${rateLimitState.limit} remaining`}
                    size="small"
                    color={rateLimitState.remaining < 10 ? 'error' : 'success'}
                    style={{ fontWeight: 700 }}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary" style={{ display: 'block', marginTop: 8 }}>
                  Unauthenticated IP rate limit is 60 requests/hour. Responses are cached locally to prevent hitting limit thresholds.
                </Typography>
              </Box>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={onClearCache}
                style={{ borderRadius: 10 }}
              >
                Clear Local Storage Cache
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Target Repository Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ padding: 24 }}>
              <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 16 }}>
                Repository & Automation Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">GitHub Owner:</Typography>
                  <Typography variant="body2" style={{ fontWeight: 700 }}>{CONFIG.owner}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Repository Name:</Typography>
                  <Typography variant="body2" style={{ fontWeight: 700 }}>{CONFIG.repo}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Default Branch:</Typography>
                  <Typography variant="body2" style={{ fontWeight: 700 }}>{CONFIG.defaultBranch}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Target Timezone:</Typography>
                  <Typography variant="body2" style={{ fontWeight: 700 }}>{CONFIG.timezoneLabel}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};
