import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  TextField,
  InputAdornment,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import StarIcon from '@mui/icons-material/Star';
import { TopicItem } from '../types';

interface TopicsProps {
  topics: TopicItem[];
  allTopicsCount: number;
  usedTopicsCount: number;
}

export const Topics: React.FC<TopicsProps> = ({
  topics,
  allTopicsCount,
  usedTopicsCount,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const percentUsed = allTopicsCount > 0 ? Math.round((usedTopicsCount / allTopicsCount) * 100) : 0;

  const usedTopics = topics.filter((t) => t.status === 'used');
  const upcomingTopics = topics.filter((t) => t.status === 'upcoming');

  const filteredUpcoming = upcomingTopics.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Box style={{ marginBottom: 24 }}>
        <Typography variant="h4" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          Topic Pool & Curriculum
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ marginTop: 4 }}>
          Sequential topic progression tracked from topics.txt and used_topics.txt.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Progress Circular Ring Card */}
        <Grid item xs={12} md={4}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: 24, textAlign: 'center' }}>
              <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 20 }}>
                Topic Pool Completion
              </Typography>

              <Box style={{ position: 'relative', display: 'inline-flex', margin: '20px 0' }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={140}
                  thickness={6}
                  style={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)' }}
                />
                <CircularProgress
                  variant="determinate"
                  value={percentUsed}
                  size={140}
                  thickness={6}
                  style={{
                    color: '#10b981',
                    position: 'absolute',
                    left: 0,
                    strokeLinecap: 'round',
                  }}
                />
                <Box
                  style={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h4" style={{ fontWeight: 800, fontFamily: 'JetBrains Mono, monospace' }}>
                    {percentUsed}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Completed
                  </Typography>
                </Box>
              </Box>

              <Box style={{ marginTop: 16 }}>
                <Typography variant="body2" style={{ fontWeight: 600 }}>
                  {usedTopicsCount} Used / {allTopicsCount} Total Topics
                </Typography>
                <Typography variant="caption" color="text.secondary" style={{ display: 'block', marginTop: 4 }}>
                  Cycles automatically reset when all 60 topics are completed.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Topics List */}
        <Grid item xs={12} md={4}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: 24 }}>
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  Upcoming Topics ({upcomingTopics.length})
                </Typography>
              </Box>

              <TextField
                fullWidth
                size="small"
                placeholder="Search upcoming topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 16 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <List disablePadding style={{ maxHeight: 380, overflowY: 'auto' }}>
                {filteredUpcoming.map((topic, idx) => {
                  const isNextUp = idx === 0 && searchQuery === '';
                  return (
                    <ListItem
                      key={topic.id}
                      style={{
                        borderRadius: 10,
                        marginBottom: 6,
                        backgroundColor: isNextUp
                          ? 'rgba(6, 182, 212, 0.12)'
                          : theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.02)'
                          : 'rgba(0, 0, 0, 0.02)',
                        border: isNextUp
                          ? '1px solid rgba(6, 182, 212, 0.4)'
                          : '1px solid transparent',
                      }}
                    >
                      <ListItemIcon style={{ minWidth: 32 }}>
                        {isNextUp ? <StarIcon style={{ color: '#06b6d4' }} /> : <HourglassEmptyIcon fontSize="small" color="action" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={topic.title}
                        primaryTypographyProps={{ variant: 'body2', fontWeight: isNextUp ? 700 : 500 }}
                      />
                      {isNextUp && <Chip label="NEXT UP" size="small" style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#06b6d4', color: '#000' }} />}
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Used Topics List */}
        <Grid item xs={12} md={4}>
          <Card style={{ height: '100%' }}>
            <CardContent style={{ padding: 24 }}>
              <Typography variant="h6" style={{ fontWeight: 700, marginBottom: 16 }}>
                Completed Topics ({usedTopics.length})
              </Typography>

              <List disablePadding style={{ maxHeight: 440, overflowY: 'auto' }}>
                {usedTopics.map((topic) => (
                  <ListItem
                    key={topic.id}
                    style={{
                      borderRadius: 10,
                      marginBottom: 6,
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(16, 185, 129, 0.04)',
                    }}
                  >
                    <ListItemIcon style={{ minWidth: 32 }}>
                      <CheckCircleIcon fontSize="small" style={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={topic.title}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );
};
