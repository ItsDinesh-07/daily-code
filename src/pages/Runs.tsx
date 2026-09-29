import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Collapse,
  Chip,
  Link,
  useTheme,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LaunchIcon from '@mui/icons-material/Launch';
import FilterListIcon from '@mui/icons-material/FilterList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { StatusChip } from '../components/common/StatusChip';
import { formatIST, formatRelativeTime } from '../utils/date';
import { GitHubWorkflowRun } from '../types';

interface RunsProps {
  workflowRuns: GitHubWorkflowRun[];
}

export const Runs: React.FC<RunsProps> = ({ workflowRuns }) => {
  const theme = useTheme();
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [expandedRunId, setExpandedRunId] = useState<number | null>(null);

  const filteredRuns = workflowRuns.filter((run) => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'success' && run.conclusion !== 'success') return false;
      if (statusFilter === 'failure' && run.conclusion !== 'failure') return false;
      if (statusFilter === 'in_progress' && run.status !== 'in_progress') return false;
    }
    if (eventFilter !== 'all' && run.event !== eventFilter) {
      return false;
    }
    return true;
  });

  const toggleExpand = (id: number) => {
    setExpandedRunId(expandedRunId === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Box style={{ marginBottom: 24 }}>
        <Typography variant="h4" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Workflow Runs
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ marginTop: 4 }}>
          Execution log and history of the Daily Code Generator GitHub Actions workflow.
        </Typography>
      </Box>

      {/* Filters Bar */}
      <Card style={{ marginBottom: 24 }}>
        <CardContent style={{ padding: 16 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                  <MenuItem value="failure">Failure</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Event Trigger</InputLabel>
                <Select
                  value={eventFilter}
                  label="Event Trigger"
                  onChange={(e) => setEventFilter(e.target.value)}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  <MenuItem value="schedule">Schedule (Cron)</MenuItem>
                  <MenuItem value="workflow_dispatch">Manual (Dispatch)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="caption" color="text.secondary" style={{ fontWeight: 600 }}>
                Showing {filteredRuns.length} of {workflowRuns.length} total runs
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Runs Table */}
      <TableContainer
        component={Paper}
        style={{
          borderRadius: 16,
          backgroundColor: theme.palette.mode === 'dark' ? '#0e131f' : '#ffffff',
          border: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 40 }} />
              <TableCell style={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell style={{ fontWeight: 700 }}>Run Title</TableCell>
              <TableCell style={{ fontWeight: 700 }}>Event</TableCell>
              <TableCell style={{ fontWeight: 700 }}>Started</TableCell>
              <TableCell style={{ fontWeight: 700 }}>Duration</TableCell>
              <TableCell style={{ fontWeight: 700 }}>Commit SHA</TableCell>
              <TableCell align="right" style={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRuns.map((run) => {
              const isExpanded = expandedRunId === run.id;
              const start = new Date(run.created_at).getTime();
              const end = new Date(run.updated_at).getTime();
              const durationSec = Math.max(1, Math.round((end - start) / 1000));

              return (
                <React.Fragment key={run.id}>
                  <TableRow hover style={{ cursor: 'pointer' }} onClick={() => toggleExpand(run.id)}>
                    <TableCell>
                      <IconButton size="small">
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={run.status} conclusion={run.conclusion} />
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      #{run.run_number} — {run.display_title || run.name}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={run.event}
                        size="small"
                        variant="outlined"
                        style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title={formatIST(run.created_at)}>
                        <Typography variant="body2">{formatRelativeTime(run.created_at)}</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Box style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {durationSec}s
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {run.head_sha.substring(0, 7)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component="a"
                        href={run.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="small"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <LaunchIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>

                  {/* Expandable Details Row */}
                  <TableRow>
                    <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box style={{ margin: '16px 0', padding: 16, borderRadius: 12, backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)' }}>
                          <Typography variant="subtitle2" style={{ fontWeight: 700, marginBottom: 8 }}>
                            Execution Breakdown & Metadata
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="caption" color="text.secondary">Triggered By:</Typography>
                              <Typography variant="body2" style={{ fontWeight: 600 }}>{run.actor?.login || 'scheduled_cron'}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="caption" color="text.secondary">Branch:</Typography>
                              <Typography variant="body2" style={{ fontWeight: 600 }}>{run.head_branch}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Typography variant="caption" color="text.secondary">Full Commit SHA:</Typography>
                              <Typography variant="body2" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem' }}>{run.head_sha}</Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </motion.div>
  );
};
