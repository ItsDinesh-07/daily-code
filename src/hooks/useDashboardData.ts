import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import {
  fetchWorkflowRuns,
  fetchDailyFiles,
  fetchCommits,
  fetchTopicsData,
  getRateLimitState,
  clearDashboardCache,
} from '../api/github';
import { parseDailyFile, computeStreakStats, generateHeatmapData } from '../utils/streak';
import { getNextCronCountdown, CountdownResult } from '../utils/date';
import { GitHubWorkflowRun, GitHubContentFile, RateLimitState, TopicItem } from '../types';

export function useDashboardData(autoRefreshInterval: number = 0) {
  const queryClient = useQueryClient();
  const [countdown, setCountdown] = useState<CountdownResult>(getNextCronCountdown());

  // Timer tick for live countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getNextCronCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch workflow runs
  const runsQuery = useQuery({
    queryKey: ['workflow_runs'],
    queryFn: fetchWorkflowRuns,
    staleTime: 5 * 60 * 1000,
    refetchInterval: autoRefreshInterval > 0 ? autoRefreshInterval : false,
  });

  // Fetch daily files
  const dailyFilesQuery = useQuery({
    queryKey: ['daily_files'],
    queryFn: fetchDailyFiles,
    staleTime: 5 * 60 * 1000,
    refetchInterval: autoRefreshInterval > 0 ? autoRefreshInterval : false,
  });

  // Fetch commits
  const commitsQuery = useQuery({
    queryKey: ['commits'],
    queryFn: fetchCommits,
    staleTime: 5 * 60 * 1000,
    refetchInterval: autoRefreshInterval > 0 ? autoRefreshInterval : false,
  });

  // Fetch topics
  const topicsQuery = useQuery({
    queryKey: ['topics_data'],
    queryFn: fetchTopicsData,
    staleTime: 5 * 60 * 1000,
    refetchInterval: autoRefreshInterval > 0 ? autoRefreshInterval : false,
  });

  const isLoading = runsQuery.isLoading || dailyFilesQuery.isLoading || topicsQuery.isLoading;

  const rateLimitState: RateLimitState = getRateLimitState();
  const isCached =
    (runsQuery.data?.isCached || dailyFilesQuery.data?.isCached || commitsQuery.data?.isCached) ?? false;

  // Process daily files
  const rawFiles: GitHubContentFile[] = dailyFilesQuery.data?.files || [];
  const parsedFiles = rawFiles.map(parseDailyFile).sort((a, b) => b.name.localeCompare(a.name));

  // Process workflow runs
  const runs: GitHubWorkflowRun[] = runsQuery.data?.runs || [];

  // Process topics
  const allTopicsRaw = topicsQuery.data?.topics || [];
  const usedTopicsRaw = topicsQuery.data?.usedTopics || [];

  const topicItems: TopicItem[] = allTopicsRaw.map((t, idx) => {
    const isUsed = usedTopicsRaw.includes(t);
    return {
      id: `topic-${idx}`,
      title: t,
      status: isUsed ? 'used' : 'upcoming',
      order: idx + 1,
    };
  });

  // Compute streak and stats
  const streakStats = computeStreakStats(parsedFiles, runs, allTopicsRaw.length || 60);

  // Compute heatmap
  const heatmapData = generateHeatmapData(parsedFiles);

  // Determine Agent Health Status
  const latestRun = runs[0];
  let agentHealthStatus: 'healthy' | 'running' | 'failed' | 'idle' = 'healthy';
  let agentHealthMessage = 'Agent healthy & operational';

  if (latestRun) {
    if (latestRun.status === 'in_progress' || latestRun.status === 'queued') {
      agentHealthStatus = 'running';
      agentHealthMessage = 'Workflow is executing right now...';
    } else if (latestRun.conclusion === 'failure') {
      agentHealthStatus = 'failed';
      agentHealthMessage = `Last run failed (${latestRun.display_title})`;
    } else if (latestRun.conclusion === 'success') {
      agentHealthStatus = 'healthy';
      agentHealthMessage = 'Agent healthy & operational';
    }
  }

  const handleRefetchAll = () => {
    queryClient.invalidateQueries();
  };

  const handleClearCache = () => {
    clearDashboardCache();
    queryClient.invalidateQueries();
  };

  return {
    isLoading,
    isCached,
    rateLimitState,
    runs,
    dailyFiles: parsedFiles,
    topics: topicItems,
    allTopicsCount: allTopicsRaw.length || 60,
    usedTopicsCount: usedTopicsRaw.length,
    streakStats,
    heatmapData,
    countdown,
    agentHealthStatus,
    agentHealthMessage,
    latestRun,
    refetchAll: handleRefetchAll,
    clearCache: handleClearCache,
  };
}
