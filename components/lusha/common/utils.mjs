import {
  MIN_PAGE_SIZE,
  PAGE_SIZE,
} from "./constants.mjs";

export const parseObject = (obj) => {
  if (!obj) return undefined;

  if (Array.isArray(obj)) {
    return obj.map((item) => {
      if (typeof item === "string") {
        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      }
      return item;
    });
  }
  if (typeof obj === "string") {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
  return obj;
};

const firstDefined = (item, keys) => keys
  .map((key) => item?.[key])
  .find((value) => value !== undefined && value !== null && value !== "");

// Lusha V3 filter endpoints return `values` whose item shape depends on the filter type
// (plain strings for some, objects for others), so map both shapes to a prop option.
export const toOption = (item, {
  valueKeys = [
    "value",
    "id",
    "code",
    "name",
  ],
  labelKeys = [
    "label",
    "name",
    "value",
  ],
} = {}) => {
  if (typeof item !== "object" || item === null) {
    return item;
  }
  const value = firstDefined(item, valueKeys);
  const label = firstDefined(item, labelKeys) ?? value;
  return {
    value,
    label: String(label),
  };
};

// Size and revenue filters take `{ min, max }` range objects, so the option value is the
// JSON-encoded range (parsed back with `parseObject` before it is sent).
export const toRangeOption = (item) => {
  const {
    min, max,
  } = item;
  const range = {
    min,
  };
  if (max !== undefined && max !== null) {
    range.max = max;
  }
  return {
    value: JSON.stringify(range),
    label: String(item.label ?? item.name ?? `${min}${max
      ? `-${max}`
      : "+"}`),
  };
};

// V2 used `country_grouping`; V3 prospecting location objects use `countryGrouping`.
const normalizeLocation = (location) => {
  if (typeof location !== "object" || location === null) {
    return location;
  }
  const {
    country_grouping: legacyGrouping, ...rest
  } = location;
  return legacyGrouping && !rest.countryGrouping
    ? {
      ...rest,
      countryGrouping: legacyGrouping,
    }
    : rest;
};

// `parseObject` JSON-parses each array item, which turns digit-only strings such as Lusha IDs
// ("4389064654") or SIC codes ("7372") into numbers. The API expects strings, so string-list
// inputs only parse a JSON-encoded array and then coerce every item back to a string.
export const parseStringList = (value) => {
  const list = typeof value === "string"
    ? parseObject(value)
    : value;
  if (list === undefined || list === null || list === "") return undefined;
  return [].concat(list).map(String);
};

const setStringsIfPresent = (target, key, value) => {
  const list = parseStringList(value);
  if (list?.length) {
    target[key] = list;
  }
};

const setIfPresent = (target, key, value) => {
  const parsed = parseObject(value);
  if (Array.isArray(parsed)
    ? parsed.length
    : parsed !== undefined && parsed !== null && parsed !== "") {
    target[key] = parsed;
  }
};

// Builds `filters.contacts.include` for POST /v3/contacts/prospecting.
// https://docs.lusha.com/api-reference/prospecting/prospecting-contacts
export const buildContactInclude = ({
  names, jobTitles, jobTitlesExactMatch, countries,
  seniority, departments, existingDataPoints, location,
}) => {
  const include = {};
  setStringsIfPresent(include, "names", names);
  setStringsIfPresent(include, "jobTitles", jobTitles);
  setStringsIfPresent(include, "jobTitlesExactMatch", jobTitlesExactMatch);
  setStringsIfPresent(include, "countries", countries);
  setIfPresent(include, "seniorityIds", seniority);
  setStringsIfPresent(include, "departments", departments);
  setStringsIfPresent(include, "existingDataPoints", existingDataPoints);
  setIfPresent(include, "locations", parseObject(location)?.map(normalizeLocation));
  return include;
};

// Builds `filters.companies.include` for POST /v3/companies/prospecting.
// https://docs.lusha.com/api-reference/prospecting/prospecting-companies
export const buildCompanyInclude = ({
  names, domains, locations, sizes, revenues, sicCodes, naicsCodes,
}) => {
  const include = {};
  setStringsIfPresent(include, "names", names);
  setStringsIfPresent(include, "domains", domains);
  setIfPresent(include, "locations", parseObject(locations)?.map((country) => ({
    country,
  })));
  setIfPresent(include, "sizes", sizes);
  setIfPresent(include, "revenues", revenues);
  setStringsIfPresent(include, "sicCodes", sicCodes);
  setStringsIfPresent(include, "naicsCodes", naicsCodes);
  return include;
};

// Request only as many results as the limit needs, within Lusha's 10-100 page-size range.
// Below 10 Lusha still returns a 10-result page; the extra results are discarded.
export const getPageSize = (limit) => Math.min(
  PAGE_SIZE,
  Math.max(MIN_PAGE_SIZE, limit || PAGE_SIZE),
);
