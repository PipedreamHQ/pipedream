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
  setIfPresent(include, "names", names);
  setIfPresent(include, "jobTitles", jobTitles);
  setIfPresent(include, "jobTitlesExactMatch", jobTitlesExactMatch);
  setIfPresent(include, "countries", countries);
  setIfPresent(include, "seniorityIds", seniority);
  setIfPresent(include, "departments", departments);
  setIfPresent(include, "existingDataPoints", existingDataPoints);
  setIfPresent(include, "locations", parseObject(location)?.map(normalizeLocation));
  return include;
};

// Builds `filters.companies.include` for POST /v3/companies/prospecting.
// https://docs.lusha.com/api-reference/prospecting/prospecting-companies
export const buildCompanyInclude = ({
  names, domains, locations, sizes, revenues, sicCodes, naicsCodes,
}) => {
  const include = {};
  setIfPresent(include, "names", names);
  setIfPresent(include, "domains", domains);
  setIfPresent(include, "locations", parseObject(locations)?.map((country) => ({
    country,
  })));
  setIfPresent(include, "sizes", sizes);
  setIfPresent(include, "revenues", revenues);
  setIfPresent(include, "sicCodes", sicCodes);
  setIfPresent(include, "naicsCodes", naicsCodes);
  return include;
};
