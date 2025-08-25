// Build parameters object from props, filtering out undefined values
export function buildParams(props, filterKeys) {
  const params = {};

  // Add filter parameters
  filterKeys.forEach((key) => {
    const propKey = toCamelCase(key);
    if (props[propKey]) {
      // Handle arrays by joining them with commas for the API
      if (Array.isArray(props[propKey])) {
        params[key] = props[propKey].join(",");
      } else {
        params[key] = props[propKey];
      }
    }
  });

  // Add pagination parameters
  if (props.limit !== undefined) {
    params.limit = props.limit;
  }
  if (props.page !== undefined) {
    params.page = props.page;
  }

  return params;
}

// Convert snake_case to camelCase for prop names
export function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// Convert camelCase to snake_case for API parameters
export function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Generate filter summary for execution summary
export function generateFilterSummary(props, filterKeys) {
  const appliedFilters = [];

  filterKeys.forEach((key) => {
    const propKey = toCamelCase(key);
    const value = props[propKey];
    if (value) {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      // Handle arrays by joining them for display
      const displayValue = Array.isArray(value)
        ? value.join(", ")
        : value;
      appliedFilters.push(`${label}: ${displayValue}`);
    }
  });

  return appliedFilters.length > 0
    ? ` with filters: ${appliedFilters.join(", ")}`
    : "";
}

