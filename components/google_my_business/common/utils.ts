import { ConfigurationError } from "@pipedream/platform";

export interface ParsedDate {
  year: number;
  month: number;
  day: number;
}

export interface ParsedMonth {
  year: number;
  month: number;
}

export function parseDate(value: string, label: string): ParsedDate {
  const match = value?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const [
    , yearStr,
    monthStr,
    dayStr,
  ] = match ?? [];
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  // Round-trip through Date.UTC to reject impossible calendar dates
  // (e.g. month 13, or day 30 in February) that the regex alone allows.
  const isValidCalendarDate = month >= 1 && month <= 12
    && new Date(Date.UTC(year, month - 1, day)).getUTCDate() === day;
  if (!match || !isValidCalendarDate) {
    throw new ConfigurationError(`**${label}** must be a valid date in \`YYYY-MM-DD\` format (e.g. \`2026-01-31\`). Received: "${value}"`);
  }
  return {
    year,
    month,
    day,
  };
}

export function parseMonth(value: string, label: string): ParsedMonth {
  const match = value?.trim().match(/^(\d{4})-(\d{2})$/);
  const [
    , yearStr,
    monthStr,
  ] = match ?? [];
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!match || month < 1 || month > 12) {
    throw new ConfigurationError(`**${label}** must be a valid month (01-12) in \`YYYY-MM\` format (e.g. \`2026-01\`). Received: "${value}"`);
  }
  return {
    year,
    month,
  };
}

export function assertDateOrder(start: ParsedDate, end: ParsedDate, startLabel: string, endLabel: string): void {
  const toOrdinal = ({
    year, month, day,
  }: ParsedDate) => year * 10000 + month * 100 + day;
  if (toOrdinal(end) < toOrdinal(start)) {
    throw new ConfigurationError(`**${endLabel}** must not be earlier than **${startLabel}**.`);
  }
}

export function assertMonthOrder(start: ParsedMonth, end: ParsedMonth, startLabel: string, endLabel: string): void {
  const toOrdinal = ({
    year, month,
  }: ParsedMonth) => year * 100 + month;
  if (toOrdinal(end) < toOrdinal(start)) {
    throw new ConfigurationError(`**${endLabel}** must not be earlier than **${startLabel}**.`);
  }
}
