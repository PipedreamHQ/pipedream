import sugar from "sugar";

export function parseDate(str: string) {
  return sugar.Date.create(str);
}

export function formatDate(date: Date, format: string) {
  return sugar.Date.format(date, format);
}
