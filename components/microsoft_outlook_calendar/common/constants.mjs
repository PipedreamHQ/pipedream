// Recurrence pattern type groupings (for validation and pattern building)
export const DAYS_OF_WEEK_TYPES = [
  "weekly",
  "relativeMonthly",
  "relativeYearly",
];
export const ABSOLUTE_TYPES = [
  "absoluteMonthly",
  "absoluteYearly",
];
export const YEARLY_TYPES = [
  "absoluteYearly",
  "relativeYearly",
];
export const RELATIVE_TYPES = [
  "relativeMonthly",
  "relativeYearly",
];

// Day of week options (recurrence days + first day of week)
export const DAY_OF_WEEK_OPTIONS = [
  {
    label: "Sunday",
    value: "sunday",
  },
  {
    label: "Monday",
    value: "monday",
  },
  {
    label: "Tuesday",
    value: "tuesday",
  },
  {
    label: "Wednesday",
    value: "wednesday",
  },
  {
    label: "Thursday",
    value: "thursday",
  },
  {
    label: "Friday",
    value: "friday",
  },
  {
    label: "Saturday",
    value: "saturday",
  },
];

// Recurrence pattern type options
export const RECURRENCE_PATTERN_TYPE_OPTIONS = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Weekly",
    value: "weekly",
  },
  {
    label: "Absolute Monthly (e.g. 15th of each month)",
    value: "absoluteMonthly",
  },
  {
    label: "Relative Monthly (e.g. 2nd Tuesday)",
    value: "relativeMonthly",
  },
  {
    label: "Absolute Yearly (e.g. March 15 every year)",
    value: "absoluteYearly",
  },
  {
    label: "Relative Yearly (e.g. 2nd Thursday of November)",
    value: "relativeYearly",
  },
];

// Recurrence week index options (for relativeMonthly, relativeYearly)
export const RECURRENCE_INDEX_OPTIONS = [
  {
    label: "First",
    value: "first",
  },
  {
    label: "Second",
    value: "second",
  },
  {
    label: "Third",
    value: "third",
  },
  {
    label: "Fourth",
    value: "fourth",
  },
  {
    label: "Last",
    value: "last",
  },
];

// Recurrence range type options
export const RECURRENCE_RANGE_TYPE_OPTIONS = [
  {
    label: "No end date",
    value: "noEnd",
  },
  {
    label: "End by date",
    value: "endDate",
  },
  {
    label: "End after N occurrences",
    value: "numbered",
  },
];
