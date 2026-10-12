import { ConfigurationError } from "@pipedream/platform";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDate = (value, label) => {
  if (!DATE_PATTERN.test(value)) {
    throw new ConfigurationError(`${label} must use the YYYY-MM-DD format.`);
  }

  const [
    year,
    month,
    day,
  ] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) {
    throw new ConfigurationError(`${label} must be a valid calendar date.`);
  }

  return date.getTime();
};

const parseCursorHeader = (headers, name) => {
  const value = headers?.[name];

  if (value === undefined || value === null || value === "") return null;

  const parsedValue = Number(value);

  if (!Number.isSafeInteger(parsedValue) || parsedValue < 0) {
    throw new Error(`Toggl returned an invalid ${name} pagination header.`);
  }

  return parsedValue;
};

export const getNextCursor = (headers) => {
  const firstId = parseCursorHeader(headers, "x-next-id");
  const firstRowNumber = parseCursorHeader(headers, "x-next-row-number");

  if (firstId !== null && firstRowNumber === null) {
    throw new Error("Toggl returned an incomplete pagination cursor. Expected x-next-row-number with x-next-id.");
  }

  return firstRowNumber === null
    ? null
    : {
      ...firstId !== null && {
        firstId,
      },
      firstRowNumber,
    };
};
