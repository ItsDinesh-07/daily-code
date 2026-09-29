import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';

import { CountUpNumber } from '../components/common/CountUpNumber';
import { StatusChip } from '../components/common/StatusChip';
import { formatIST, formatRelativeTime } from '../utils/date';
import { DailyFileMeta, GitHubWorkflowRun, HeatmapDay, StreakStats } from '../types';

interface OverviewProps {
  streakStats: StreakStats;
  heroStatus: 'healthy' | 'running' | 'failed' | 'idle';
  heroMessage: string;
  latestRun?: GitHubWorkflowRun;
  countdown: any;
  heatmapData: HeatmapDay[];
  workflowRuns: GitHubWorkflowRun[];
  recentFiles: DailyFileMeta[];
  onSelectSnippet: (file: DailyFileMeta) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  streakStats,
  heroStatus,
  heroMessage,
  latestRun,
  countdown,
  heatmapData,
  workflowRuns,
  recentFiles,
  onSelectSnippet,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  // Prepare data for last 20 runs chart
  const runChartData = workflowRuns.slice(0, 20).reverse().map((r) => {
    const start = new Date(r.created_at).getTime();
    const end = new Date(r.updated_at).getTime();
    const durationSec = Math.max(1, Math.round((end - start) / 1000));

    return {
      name: `#${r.run_number}`,
      date: formatIST(r.created_at, 'MMM dd'),
      success: r.conclusion === 'success' ? 1 : 0,
      failure: r.conclusion === 'failure' ? 1 : 0,
      skipped: r.conclusion === 'skipped' || r.conclusion === 'cancelled' ? 1 : 0,
      duration: durationSec,
    };
  });

  // Heatmap colors for custom gradient
  const heatmapColors = ['#131a2a', '#064e3b', '#047857', '#10b981', '#06b6d4'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Grid container spacing={3}>
        {/* 1. HERO STATUS & COUNTDOWN CARD */}
        <Grid item xs={12} md={7}>
          <Card
            style={{
              position: 'relative',
              overflow: 'hidden',
              background:
                theme.palette.mode === 'dark'
                  ? 'radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.08) 0%, rgba(14, 19, 31, 0.95) 70%)'
                  : 'radial-gradient(circle at 10% 10%, rgba(16, 185, 129, 0.05) 0%, #ffffff 70%)',
            }}
          >
            <CardContent style={{ padding: 24 }}>
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Box style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Box
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: heroStatus === 'failed' ? '#ef4444' : '#10b981',
                      boxShadow: `0 0 16px ${heroStatus === 'failed' ? '#ef4444' : '#10b981'}`,
                    }}
                  />
                  <Typography variant="h6" style={{ fontWeight: 800 }}>
                    {heroMessage}
                  </Typography>
                </Box>
                {latestRun && <StatusChip status={latestRun.status} conclusion={latestRun.conclusion} />}
              </Box>

              <Grid container spacing={2} style={{ marginTop: 8 }}>
                <Grid item xs={12} sm={6}>
                  <Box
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                      border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" style={{ fontWeight: 600 }}>
                      LAST WORKFLOW RUN
                    </Typography>
                    <Typography variant="body1" style={{ fontWeight: 700, marginTop: 4 }}>
                      {latestRun ? formatRelativeTime(latestRun.created_at) : 'N/A'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {latestRun ? formatIST(latestRun.created_at) : ''}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box
                    style={{
                      padding: 14,
                      borderRadius: 12,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(6, 182, 212, 0.06)' : 'rgba(6, 182, 212, 0.04)',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <TimerIcon fontSize="small" style={{ color: '#06b6d4' }} />
                      <Typography variant="caption" style={{ fontWeight: 700, color: '#06b6d4' }}>
                        NEXT CRON RUN
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      style={{
                        fontWeight: 800,
                        fontFamily: 'JetBrains Mono, monospace',
                        color: '#22d3ee',
                        marginTop: 2,
                      }}
                    >
                      {countdown.formatted}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {countdown.nextRunLabel}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* 2. TODAY'S COMMIT CARD */}
        <Grid item xs={12} md={5}>
          <Card
            onClick={streakStats.todayStatus === 'done' ? handleConfetti : undefined}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: streakStats.todayStatus === 'done' ? 'pointer' : 'default',
              border: streakStats.todayStatus === 'done' ? '1px solid rgba(16, 185, 129, 0.4)' : undefined,
            }}
          >
            <CardContent style={{ padding: 24 }}>
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary" style={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                  TODAY'S AUTOMATION STATUS
                </Typography>
                <Chip
                  label={streakStats.todayStatus === 'done' ? 'DONE' : 'PENDING'}
                  size="small"
                  style={{
                    fontWeight: 800,
                    backgroundColor: streakStats.todayStatus === 'done' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: streakStats.todayStatus === 'done' ? '#34d399' : '#fbbf24',
                    border: streakStats.todayStatus === 'done' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                  }}
                />
              </Box>

              <Box style={{ marginTop: 20 }}>
                <Typography variant="h5" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {streakStats.todayStatus === 'done' ? 'Snippet Committed 🎉' : 'Awaiting Daily Cron Run'}
                </Typography>
                <Typography variant="body2" color="text.secondary" style={{ marginTop: 6 }}>
                  {streakStats.todayStatus === 'done'
                    ? streakStats.todayFileName || 'Today\'s code snippet has been committed successfully.'
                    : 'The automated generator will pick the next unused topic and commit today\'s snippet automatically.'}
                </Typography>
              </Box>
            </CardContent>

            <Box style={{ padding: '0 24px 20px 24px' }}>
              <Button
                onClick={() => navigate('/library')}
                variant="outlined"
                fullWidth
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                style={{ borderRadius: 10, textTransform: 'none' }}
              >
                Browse All Snippets
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* 3. KPI STATS ROW */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {[
              {
                title: 'CURRENT STREAK',
                value: streakStats.currentStreak,
                suffix: ' days',
                icon: <LocalFireDepartmentIcon style={{ color: '#f97316' }} />,
                accent: '#f97316',
              },
              {
                title: 'LONGEST STREAK',
                value: streakStats.longestStreak,
                suffix: ' days',
                icon: <EmojiEventsIcon style={{ color: '#eab308' }} />,
                accent: '#eab308',
              },
              {
                title: 'TOTAL SNIPPETS',
                value: streakStats.totalSnippets,
                icon: <CodeIcon style={{ color: '#10b981' }} />,
                accent: '#10b981',
              },
              {
                title: 'SUCCESS RATE',
                value: streakStats.successRate,
                suffix: '%',
                icon: <CheckCircleOutlineIcon style={{ color: '#06b6d4' }} />,
                accent: '#06b6d4',
              },
              {
                title: 'REMAINING TOPICS',
                value: streakStats.remainingTopics,
                icon: <CategoryIcon style={{ color: '#a855f7' }} />,
                accent: '#a855f7',
              },
            ].map((kpi) => (
              <Grid item xs={12} sm={6} md={2.4} key={kpi.title}>
                <Card style={{ height: '100%' }}>
                  <CardContent style={{ padding: 18 }}>
                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <Typography variant="caption" color="text.secondary" style={{ fontWeight: 700 }}>
                        {kpi.title}
                      </Typography>
                      {kpi.icon}
                    </Box>
                    <CountUpNumber
                      value={kpi.value}
                      suffix={kpi.suffix || ''}
                      variant="h4"
                      style={{ fontWeight: 800, color: kpi.accent }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* 4. 12-MONTH CONTRIBUTION HEATMAP */}
        <Grid item xs={12}>
          <Card>
            <CardContent style={{ padding: 24 }}>
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  12-Month Contribution Heatmap
                </Typography>
                <Box style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Typography variant="caption" color="text.secondary">
                    Less
                  </Typography>
                  {heatmapColors.map((color, i) => (
                    <Box key={i} style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color }} />
                  ))}
                  <Typography variant="caption" color="text.secondary">
                    More
                  </Typography>
                </Box>
              </Box>

              {/* Heatmap Grid rendering */}
              <Box style={{ overflowX: 'auto', paddingBottom: 8 }}>
                <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(53, 12px)', gap: 4, width: 'max-content' }}>
                  {heatmapData.map((day) => (
                    <Tooltip key={day.date} title={`${day.date}: ${day.count} snippet(s)`}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '3px',
                          backgroundColor: heatmapColors[day.level],
                          transition: 'transform 0.15s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.3)',
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 5. WORKFLOW RUN HISTORY CHART */}
        <Grid item xs={12} md={7}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: 24 }}>
              <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 16 }}>
                Recent Workflow Execution History (Last 20 Runs)
              </Typography>
              <Box style={{ height: 260, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={runChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis yAxisId="left" stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#06b6d4" fontSize={11} unit="s" />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: 12,
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: '#f8fafc',
                      }}
                    />
                    <Bar yAxisId="left" dataKey="success" name="Success" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar yAxisId="left" dataKey="failure" name="Failure" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                    <Bar yAxisId="left" dataKey="skipped" name="Skipped" fill="#64748b" radius={[4, 4, 0, 0]} stackId="a" />
                    <Line yAxisId="right" type="monotone" dataKey="duration" name="Duration (s)" stroke="#06b6d4" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* 6. RECENT SNIPPETS CARDS */}
        <Grid item xs={12} md={5}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: 24 }}>
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  Recent Daily Snippets
                </Typography>
                <Button size="small" onClick={() => navigate('/library')} style={{ fontSize: '0.75rem' }}>
                  View All
                </Button>
              </Box>

              <Grid container spacing={1.5}>
                {recentFiles.slice(0, 4).map((file) => (
                  <Grid item xs={12} key={file.sha}>
                    <Box
                      onClick={() => onSelectSnippet(file)}
                      sx={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)',
                        border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.06)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s ease',

                        '&:hover': {
                          borderColor: '#10b981',
                          backgroundColor: 'rgba(16, 185, 129, 0.06)',
                        },
                      }}
                    >
                      <Box style={{ overflow: 'hidden', paddingRight: 8 }}>
                        <Typography variant="body2" style={{ fontWeight: 700 }} noWrap>
                          {file.parsedTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {file.dateStr}
                        </Typography>
                      </Box>
                      <Chip label={file.language} size="small" style={{ fontSize: '0.65rem', height: 20 }} />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};
