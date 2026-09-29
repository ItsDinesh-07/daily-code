import { formatInTimeZone } from 'date-fns-tz';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { CONFIG } from '../config';

export function formatIST(dateInput: string | Date | number, formatStr: string = 'dd MMM yyyy, hh:mm a'): string {
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    return formatInTimeZone(date, CONFIG.timezone, formatStr) + ' IST';
  } catch (e) {
    return String(dateInput);
  }
}

export function formatRelativeTime(dateInput: string | Date | number): string {
  try {
    const date = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (e) {
    return String(dateInput);
  }
}

export interface CountdownResult {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  nextRunLabel: string;
  nextRunDate: Date;
}

export function getNextCronCountdown(): CountdownResult {
  const now = new Date();
  const currentUtcYear = now.getUTCFullYear();
  const currentUtcMonth = now.getUTCMonth();
  const currentUtcDate = now.getUTCDate();

  // Define candidate cron run times today and tomorrow in UTC
  const candidates = [
    { date: new Date(Date.UTC(currentUtcYear, currentUtcMonth, currentUtcDate, 4, 30, 0)), label: 'Primary Run (10:00 AM IST)' },
    { date: new Date(Date.UTC(currentUtcYear, currentUtcMonth, currentUtcDate, 10, 30, 0)), label: 'Backup Run (4:00 PM IST)' },
    { date: new Date(Date.UTC(currentUtcYear, currentUtcMonth, currentUtcDate + 1, 4, 30, 0)), label: 'Primary Run (10:00 AM IST tomorrow)' },
    { date: new Date(Date.UTC(currentUtcYear, currentUtcMonth, currentUtcDate + 1, 10, 30, 0)), label: 'Backup Run (4:00 PM IST tomorrow)' },
  ];

  // Find the earliest upcoming candidate
  const nextTarget = candidates.find((c) => c.date.getTime() > now.getTime()) || candidates[0];

  const diffMs = Math.max(0, nextTarget.date.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatted = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;

  return {
    hours,
    minutes,
    seconds,
    formatted,
    nextRunLabel: nextTarget.label,
    nextRunDate: nextTarget.date,
  };
}

export function getTodayDateStringIST(): string {
  return formatInTimeZone(new Date(), CONFIG.timezone, 'yyyy-MM-dd');
}
