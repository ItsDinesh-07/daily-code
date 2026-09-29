export const CONFIG = {
  // GitHub Repository Metadata
  owner: 'ItsDinesh-07',
  repo: 'daily-code',
  defaultBranch: 'main',
  workflowName: 'Daily Code Generator',
  workflowFileName: 'daily.yml',

  // API URLs
  githubApiBase: 'https://api.github.com',
  rawContentBase: 'https://raw.githubusercontent.com',

  // Scheduled Cron Times (in UTC)
  crons: [
    { hour: 4, minute: 30, label: 'Primary Run (10:00 AM IST)' },
    { hour: 10, minute: 30, label: 'Backup Run (4:00 PM IST)' },
  ],

  // Target Display Timezone
  timezone: 'Asia/Kolkata',
  timezoneLabel: 'IST (UTC+5:30)',

  // Cache & Polling Settings
  staleTimeMs: 5 * 60 * 1000, // 5 minutes
  cacheStorageKeyPrefix: 'daily_code_cache_v1_',
  autoRefreshIntervals: [
    { label: 'Off', value: 0 },
    { label: '1 minute', value: 60 * 1000 },
    { label: '5 minutes', value: 5 * 60 * 1000 },
    { label: '15 minutes', value: 15 * 60 * 1000 },
  ],

  // External Links
  get repoUrl() {
    return `https://github.com/${this.owner}/${this.repo}`;
  },
  get actionsUrl() {
    return `https://github.com/${this.owner}/${this.repo}/actions/workflows/${this.workflowFileName}`;
  },
  get contentsUrl() {
    return `${this.githubApiBase}/repos/${this.owner}/${this.repo}/contents/daily`;
  },
  get runsUrl() {
    return `${this.githubApiBase}/repos/${this.owner}/${this.repo}/actions/runs?per_page=50`;
  },
  get commitsUrl() {
    return `${this.githubApiBase}/repos/${this.owner}/${this.repo}/commits?per_page=100`;
  },
  get rawTopicsUrl() {
    return `${this.rawContentBase}/${this.owner}/${this.repo}/${this.defaultBranch}/topics.txt`;
  },
  get rawUsedTopicsUrl() {
    return `${this.rawContentBase}/${this.owner}/${this.repo}/${this.defaultBranch}/used_topics.txt`;
  },
};
