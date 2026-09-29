export interface GitHubWorkflowRun {
  id: number;
  name: string;
  node_id: string;
  head_branch: string;
  head_sha: string;
  path: string;
  display_title: string;
  run_number: number;
  event: string;
  status: 'completed' | 'in_progress' | 'queued' | 'requested' | 'waiting';
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | 'timed_out' | 'action_required' | null;
  workflow_id: number;
  url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_started_at: string;
  jobs_url: string;
  logs_url: string;
  actor: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  triggering_actor: {
    login: string;
    avatar_url: string;
  };
}

export interface GitHubContentFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

export interface DailyFileMeta extends GitHubContentFile {
  dateStr: string;
  topicSlug: string;
  formattedDate: string;
  parsedTitle?: string;
  language?: string;
}

export interface TopicItem {
  id: string;
  title: string;
  status: 'used' | 'upcoming';
  usedDate?: string;
  order: number;
}

export interface RateLimitState {
  isRateLimited: boolean;
  remaining: number;
  limit: number;
  resetTimestamp: number | null;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalSnippets: number;
  successRate: number;
  remainingTopics: number;
  todayStatus: 'done' | 'pending';
  todayFileName?: string;
  todayDownloadUrl?: string;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}
