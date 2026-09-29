import { CONFIG } from '../config';
import { GitHubWorkflowRun, GitHubContentFile, RateLimitState, GitHubCommit } from '../types';

interface FetchResult<T> {
  data: T;
  isCached: boolean;
  rateLimit: RateLimitState;
}

let globalRateLimitState: RateLimitState = {
  isRateLimited: false,
  remaining: 60,
  limit: 60,
  resetTimestamp: null,
};

export const getRateLimitState = (): RateLimitState => globalRateLimitState;

function updateRateLimitHeaders(headers: Headers): void {
  const remaining = headers.get('x-ratelimit-remaining');
  const limit = headers.get('x-ratelimit-limit');
  const reset = headers.get('x-ratelimit-reset');

  if (remaining !== null) {
    const rem = parseInt(remaining, 10);
    globalRateLimitState.remaining = rem;
    globalRateLimitState.isRateLimited = rem === 0;
  }
  if (limit !== null) {
    globalRateLimitState.limit = parseInt(limit, 10);
  }
  if (reset !== null) {
    globalRateLimitState.resetTimestamp = parseInt(reset, 10) * 1000;
  }
}

function getCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(CONFIG.cacheStorageKeyPrefix + key);
    if (!item) return null;
    const parsed = JSON.parse(item);
    return parsed.data as T;
  } catch (e) {
    console.warn(`Failed to read cache for key ${key}:`, e);
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const item = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CONFIG.cacheStorageKeyPrefix + key, JSON.stringify(item));
  } catch (e) {
    console.warn(`Failed to write cache for key ${key}:`, e);
  }
}

export async function fetchWithCache<T>(url: string, cacheKey: string): Promise<FetchResult<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });

    updateRateLimitHeaders(response.headers);

    if (response.status === 403 || response.status === 429) {
      globalRateLimitState.isRateLimited = true;
      const cached = getCache<T>(cacheKey);
      if (cached !== null) {
        return { data: cached, isCached: true, rateLimit: globalRateLimitState };
      }
      throw new Error(`GitHub API rate limit exceeded (${response.status}) and no cache available.`);
    }

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    setCache<T>(cacheKey, data);
    return { data, isCached: false, rateLimit: globalRateLimitState };
  } catch (err) {
    const cached = getCache<T>(cacheKey);
    if (cached !== null) {
      return { data: cached, isCached: true, rateLimit: globalRateLimitState };
    }
    throw err;
  }
}

export async function fetchRawText(url: string, cacheKey: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Raw fetch failed with status ${response.status}`);
    }
    const text = await response.text();
    setCache<string>(cacheKey, text);
    return text;
  } catch (err) {
    const cached = getCache<string>(cacheKey);
    if (cached !== null) {
      return cached;
    }
    throw err;
  }
}

export async function fetchWorkflowRuns(): Promise<{ runs: GitHubWorkflowRun[]; isCached: boolean }> {
  const result = await fetchWithCache<{ workflow_runs: GitHubWorkflowRun[] }>(
    CONFIG.runsUrl,
    'workflow_runs'
  );
  return {
    runs: result.data.workflow_runs || [],
    isCached: result.isCached,
  };
}

export async function fetchDailyFiles(): Promise<{ files: GitHubContentFile[]; isCached: boolean }> {
  const result = await fetchWithCache<GitHubContentFile[]>(
    CONFIG.contentsUrl,
    'daily_files'
  );
  const filesList = Array.isArray(result.data) ? result.data : [];
  // Filter for markdown files
  return {
    files: filesList.filter((f) => f.name.endsWith('.md')),
    isCached: result.isCached,
  };
}

export async function fetchCommits(): Promise<{ commits: GitHubCommit[]; isCached: boolean }> {
  const result = await fetchWithCache<GitHubCommit[]>(
    CONFIG.commitsUrl,
    'commits'
  );
  return {
    commits: Array.isArray(result.data) ? result.data : [],
    isCached: result.isCached,
  };
}

export async function fetchTopicsData(): Promise<{ topics: string[]; usedTopics: string[] }> {
  const [topicsText, usedTopicsText] = await Promise.all([
    fetchRawText(CONFIG.rawTopicsUrl, 'raw_topics').catch(() => ''),
    fetchRawText(CONFIG.rawUsedTopicsUrl, 'raw_used_topics').catch(() => ''),
  ]);

  const topics = topicsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const usedTopics = usedTopicsText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return { topics, usedTopics };
}

export async function fetchFileContent(downloadUrl: string, fileSha: string): Promise<string> {
  return fetchRawText(downloadUrl, `file_content_${fileSha}`);
}

export function clearDashboardCache(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(CONFIG.cacheStorageKeyPrefix)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
