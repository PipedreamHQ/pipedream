import { ConfigurationError } from "@pipedream/platform";

export const parseDate = (date) => {
  if (!date) return undefined;
  const parsedDate = Date.parse(date) / 1000;
  if (isNaN(parsedDate)) {
    throw new ConfigurationError(`Invalid date: ${date}`);
  }
  return parsedDate;
};
