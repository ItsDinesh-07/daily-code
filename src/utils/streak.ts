import { DailyFileMeta, GitHubContentFile, HeatmapDay, StreakStats, GitHubWorkflowRun } from '../types';
import { getTodayDateStringIST } from './date';
import { subDays, format, parseISO, isSameDay } from 'date-fns';

export function parseDailyFile(file: GitHubContentFile): DailyFileMeta {
  const match = file.name.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  const dateStr = match ? match[1] : '';
  const topicSlug = match ? match[2] : file.name.replace(/\.md$/, '');

  // Format topic title nicely from slug
  const title = topicSlug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Guess code language from topic slug
  let language = 'javascript';
  if (topicSlug.includes('java-') || topicSlug.includes('-java')) language = 'java';
  else if (topicSlug.includes('spring')) language = 'java';
  else if (topicSlug.includes('react') || topicSlug.includes('jsx')) language = 'jsx';
  else if (topicSlug.includes('php')) language = 'php';
  else if (topicSlug.includes('sql')) language = 'sql';
  else if (topicSlug.includes('css') || topicSlug.includes('flexbox') || topicSlug.includes('grid')) language = 'css';
  else if (topicSlug.includes('git')) language = 'bash';
  else if (topicSlug.includes('dsa') || topicSlug.includes('algorithm')) language = 'typescript';

  return {
    ...file,
    dateStr,
    topicSlug,
    formattedDate: dateStr,
    parsedTitle: title,
    language,
  };
}

export function computeStreakStats(
  dailyFiles: DailyFileMeta[],
  workflowRuns: GitHubWorkflowRun[],
  totalTopicsCount: number
): StreakStats {
  const fileDatesSet = new Set(dailyFiles.map((f) => f.dateStr).filter(Boolean));
  const sortedDates = Array.from(fileDatesSet).sort();

  const todayStr = getTodayDateStringIST();
  const todayFile = dailyFiles.find((f) => f.dateStr === todayStr);

  const todayStatus: 'done' | 'pending' = todayFile ? 'done' : 'pending';

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();

  // If today hasn't triggered yet, start checking from yesterday so active streak isn't reset prematurely
  if (!fileDatesSet.has(todayStr)) {
    checkDate = subDays(checkDate, 1);
  }

  while (true) {
    const formatted = format(checkDate, 'yyyy-MM-dd');
    if (fileDatesSet.has(formatted)) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  sortedDates.forEach((dStr) => {
    const currentDate = parseISO(dStr);
    if (prevDate) {
      const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  });

  // Calculate success rate over last 30 runs
  const last30Runs = workflowRuns.slice(0, 30);
  const successfulRuns = last30Runs.filter((r) => r.conclusion === 'success').length;
  const successRate = last30Runs.length > 0 ? Math.round((successfulRuns / last30Runs.length) * 100) : 100;

  const totalSnippets = dailyFiles.length;
  const remainingTopics = Math.max(0, totalTopicsCount - totalSnippets);

  return {
    currentStreak,
    longestStreak,
    totalSnippets,
    successRate,
    remainingTopics,
    todayStatus,
    todayFileName: todayFile?.name,
    todayDownloadUrl: todayFile?.download_url,
  };
}

export function generateHeatmapData(dailyFiles: DailyFileMeta[]): HeatmapDay[] {
  const dateCounts: Record<string, number> = {};

  dailyFiles.forEach((f) => {
    if (f.dateStr) {
      dateCounts[f.dateStr] = (dateCounts[f.dateStr] || 0) + 1;
    }
  });

  const heatmap: HeatmapDay[] = [];
  const today = new Date();

  // Generate past 365 days
  for (let i = 364; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const count = dateCounts[dateStr] || 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count === 1) level = 1;
    else if (count === 2) level = 2;
    else if (count === 3) level = 3;
    else if (count >= 4) level = 4;

    heatmap.push({
      date: dateStr,
      count,
      level,
    });
  }

  return heatmap;
}
