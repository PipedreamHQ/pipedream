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
  if (!match) {
    throw new ConfigurationError(`**${label}** must be a date in \`YYYY-MM-DD\` format (e.g. \`2026-01-31\`). Received: "${value}"`);
  }
  const [
    , year,
    month,
    day,
  ] = match;
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
  };
}

export function parseMonth(value: string, label: string): ParsedMonth {
  const match = value?.trim().match(/^(\d{4})-(\d{2})$/);
  if (!match) {
    throw new ConfigurationError(`**${label}** must be a month in \`YYYY-MM\` format (e.g. \`2026-01\`). Received: "${value}"`);
  }
  const [
    , year,
    month,
  ] = match;
  return {
    year: Number(year),
    month: Number(month),
  };
}
