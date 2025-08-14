import { ERROR_MESSAGES } from "./constants.mjs";

// Build parameters object from props, filtering out undefined values
export function buildParams(props, filterKeys) {
  const params = {};
  
  // Add filter parameters
  filterKeys.forEach(key => {
    const propKey = toCamelCase(key);
    if (props[propKey]) {
      params[key] = props[propKey];
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
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// Generate filter summary for execution summary
export function generateFilterSummary(props, filterKeys) {
  const appliedFilters = [];
  
  filterKeys.forEach(key => {
    const propKey = toCamelCase(key);
    const value = props[propKey];
    if (value) {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
      appliedFilters.push(`${label}: ${value}`);
    }
  });
  
  return appliedFilters.length > 0 ? ` with filters: ${appliedFilters.join(", ")}` : "";
}

// Standardized error handling
export function handleApiError(error) {
  const statusCode = error.response?.status;
  const errorMessage = error.response?.data?.message || error.message;
  
  switch (statusCode) {
    case 401:
      throw new Error(ERROR_MESSAGES.AUTHENTICATION_FAILED);
    case 403:
      throw new Error(ERROR_MESSAGES.ACCESS_FORBIDDEN);
    case 429:
      throw new Error(ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    case 500:
    case 502:
    case 503:
    case 504:
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    default:
      throw new Error(`${ERROR_MESSAGES.GENERIC_ERROR}: ${errorMessage}`);
  }
}

// Generate props object for an endpoint
export function generateEndpointProps(app, endpoint) {
  const props = {
    [app.app]: app, // Add the app reference
  };
  
  // Add filter props based on endpoint configuration
  endpoint.filters.forEach(filterKey => {
    const propKey = toCamelCase(filterKey);
    props[propKey] = {
      type: "string",
      label: filterKey.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      description: `Filter by ${filterKey.replace(/_/g, " ")}`,
      optional: true,
    };
  });
  
  // Add common pagination props
  props.limit = {
    propDefinition: [app, "limit"],
  };
  props.page = {
    propDefinition: [app, "page"], 
  };
  
  return props;
}
