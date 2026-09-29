import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Drawer,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LaunchIcon from '@mui/icons-material/Launch';
import CodeIcon from '@mui/icons-material/Code';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import { fetchFileContent } from '../api/github';
import { DailyFileMeta } from '../types';

interface LibraryProps {
  dailyFiles: DailyFileMeta[];
  selectedSnippet: DailyFileMeta | null;
  onSelectSnippet: (file: DailyFileMeta | null) => void;
}

export const Library: React.FC<LibraryProps> = ({
  dailyFiles,
  selectedSnippet,
  onSelectSnippet,
}) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingContent, setLoadingContent] = useState(false);
  const [copyToastOpen, setCopyToastOpen] = useState(false);

  // Load content when selectedSnippet changes
  useEffect(() => {
    if (selectedSnippet) {
      setLoadingContent(true);
      fetchFileContent(selectedSnippet.download_url, selectedSnippet.sha)
        .then((text) => setFileContent(text))
        .catch((err) => setFileContent(`Failed to load file content: ${err.message}`))
        .finally(() => setLoadingContent(false));
    } else {
      setFileContent('');
    }
  }, [selectedSnippet]);

  const filteredFiles = dailyFiles.filter(
    (file) =>
      file.parsedTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.dateStr.includes(searchQuery) ||
      file.topicSlug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyCode = () => {
    if (fileContent) {
      navigator.clipboard.writeText(fileContent);
      setCopyToastOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Box style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Box>
          <Typography variant="h4" style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Daily Snippet Library
          </Typography>
          <Typography variant="body2" color="text.secondary" style={{ marginTop: 4 }}>
            Browse, search, and preview every generated code example.
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val)}
          size="small"
        >
          <ToggleButton value="grid">
            <ViewModuleIcon fontSize="small" />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewListIcon fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Search Header */}
      <Card style={{ marginBottom: 24 }}>
        <CardContent style={{ padding: 16 }}>
          <TextField
            fullWidth
            placeholder="Search by topic title, language, or date (YYYY-MM-DD)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              style: { borderRadius: 10 },
            }}
          />
        </CardContent>
      </Card>

      {/* Grid or List of Snippet Cards */}
      {viewMode === 'grid' ? (
        <Grid container spacing={2.5}>
          {filteredFiles.map((file) => (
            <Grid item xs={12} sm={6} md={4} key={file.sha}>
              <Card
                onClick={() => onSelectSnippet(file)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',

                  '&:hover': {
                    borderColor: '#10b981',
                    transform: 'translateY(-3px)',
                  },
                }}
              >
                <CardContent style={{ padding: 20 }}>
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Chip label={file.language} size="small" style={{ fontSize: '0.7rem', fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary" style={{ fontWeight: 600 }}>
                      {file.dateStr}
                    </Typography>
                  </Box>

                  <Typography variant="h6" style={{ fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3 }}>
                    {file.parsedTitle}
                  </Typography>

                  <Typography variant="caption" color="text.secondary" style={{ display: 'block', marginTop: 8 }}>
                    File: {file.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={1.5}>
          {filteredFiles.map((file) => (
            <Grid item xs={12} key={file.sha}>
              <Card
                onClick={() => onSelectSnippet(file)}
                sx={{
                  cursor: 'pointer',
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',

                  '&:hover': {
                    borderColor: '#10b981',
                  },
                }}
              >
                <Box style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <CodeIcon style={{ color: '#10b981' }} />
                  <Box>
                    <Typography variant="body1" style={{ fontWeight: 700 }}>
                      {file.parsedTitle}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.name}
                    </Typography>
                  </Box>
                </Box>

                <Box style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Typography variant="caption" color="text.secondary">
                    {file.dateStr}
                  </Typography>
                  <Chip label={file.language} size="small" style={{ fontSize: '0.7rem' }} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snippet Markdown Detail Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selectedSnippet)}
        onClose={() => onSelectSnippet(null)}
        PaperProps={{
          style: {
            width: '100%',
            maxWidth: 680,
            backgroundColor: theme.palette.mode === 'dark' ? '#0d111a' : '#ffffff',
            borderLeft: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            padding: 24,
          },
        }}
      >
        {selectedSnippet && (
          <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Drawer Header */}
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)' }}>
              <Box>
                <Typography variant="h6" style={{ fontWeight: 800 }}>
                  {selectedSnippet.parsedTitle}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedSnippet.dateStr} — {selectedSnippet.name}
                </Typography>
              </Box>

              <IconButton onClick={() => onSelectSnippet(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Actions Bar */}
            <Box style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={handleCopyCode}
                style={{ borderRadius: 8 }}
              >
                Copy Markdown
              </Button>

              <Button
                component="a"
                href={selectedSnippet.html_url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                size="small"
                startIcon={<LaunchIcon fontSize="small" />}
                style={{ borderRadius: 8 }}
              >
                Open on GitHub
              </Button>
            </Box>

            {/* Markdown Content Container */}
            <Box style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 0' }}>
              {loadingContent ? (
                <Typography color="text.secondary">Loading markdown content...</Typography>
              ) : (
                <Box
                  className="markdown-body"
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    color: theme.palette.text.primary,
                  }}
                >
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {fileContent}
                  </ReactMarkdown>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Drawer>

      <Snackbar
        open={copyToastOpen}
        autoHideDuration={3000}
        onClose={() => setCopyToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" style={{ borderRadius: 10 }}>
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </motion.div>
  );
};
