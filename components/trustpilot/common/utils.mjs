/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHtml(text) {
  if (!text) return text;
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#x27;",
    "/": "&#x2f;",
  };
  const reg = /[&<>"'/]/g;
  return text.toString().replace(reg, (match) => map[match]);
}

/**
 * Sanitize input text by removing potentially harmful content
 * @param {string} text - Text to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized text
 */
export function sanitizeInput(text, maxLength = 5000) {
  if (!text) return "";

  // Convert to string and trim
  let sanitized = String(text).trim();

  // Remove control characters except newlines and tabs
  // Using Unicode property escapes for safer regex
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Build URL from endpoint template and parameters
 * @param {string} endpoint - Endpoint template with placeholders
 * @param {object} params - Parameters to replace in the endpoint
 * @returns {string} - Complete URL with parameters replaced
 */
export function buildUrl(endpoint, params = {}) {
  let url = endpoint;

  // Replace path parameters with proper escaping
  Object.entries(params).forEach(([
    key,
    value,
  ]) => {
    const placeholder = `{${key}}`;
    // Use split/join to avoid regex issues and encode the value
    url = url.split(placeholder).join(encodeURIComponent(String(value)));
  });

  return url;
}

/**
 * Parse Trustpilot review data
 * @param {object} review - Raw review data from API
 * @returns {object} - Parsed review data
 */
export function parseReview(review) {
  return {
    id: review.id,
    stars: review.stars,
    title: escapeHtml(review.title),
    text: escapeHtml(review.text),
    language: review.language,
    location: escapeHtml(review.location),
    tags: review.tags || [],
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    consumer: {
      id: review.consumer?.id,
      displayName: escapeHtml(review.consumer?.displayName),
      numberOfReviews: review.consumer?.numberOfReviews,
    },
    company: {
      reply: review.companyReply
        ? {
          text: escapeHtml(review.companyReply.text),
          createdAt: review.companyReply.createdAt,
        }
        : null,
    },
    imported: review.imported || false,
    verified: review.verified || false,
    url: review.url,
  };
}

/**
 * Parse Trustpilot business unit data
 * @param {object} businessUnit - Raw business unit data from API
 * @returns {object} - Parsed business unit data
 */
export function parseBusinessUnit(businessUnit) {
  return {
    id: businessUnit.id,
    displayName: businessUnit.displayName,
    identifyingName: businessUnit.identifyingName,
    trustScore: businessUnit.trustScore,
    stars: businessUnit.stars,
    numberOfReviews: businessUnit.numberOfReviews,
    profileUrl: businessUnit.profileUrl,
    websiteUrl: businessUnit.websiteUrl,
    country: businessUnit.country,
    status: businessUnit.status,
    createdAt: businessUnit.createdAt,
    categories: businessUnit.categories || [],
    images: businessUnit.images || [],
  };
}

/**
 * Parse webhook payload
 * @param {object} payload - Raw webhook payload
 * @returns {object} - Parsed webhook data
 */
export function parseWebhookPayload(payload) {
  const {
    event, data,
  } = payload;

  return {
    event: event?.type || payload.eventType,
    timestamp: event?.timestamp || payload.timestamp,
    businessUnitId: data?.businessUnit?.id || payload.businessUnitId,
    reviewId: data?.review?.id || payload.reviewId,
    consumerId: data?.consumer?.id || payload.consumerId,
    data: data || payload.data,
    raw: payload,
  };
}

/**
 * Validate business unit ID format
 * @param {string} businessUnitId - Business unit ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export function validateBusinessUnitId(businessUnitId) {
  // Trustpilot Business Unit IDs are 24-character hexadecimal strings (MongoDB ObjectID format)
  return (
    typeof businessUnitId === "string" &&
    /^[a-f0-9]{24}$/.test(businessUnitId)
  );
}

/**
 * Validate review ID format
 * @param {string} reviewId - Review ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export function validateReviewId(reviewId) {
  // Trustpilot Review IDs are 24-character hexadecimal strings (MongoDB ObjectID format)
  return (
    typeof reviewId === "string" &&
    /^[a-f0-9]{24}$/.test(reviewId)
  );
}

/**
 * Format query parameters for API requests
 * @param {object} params - Query parameters
 * @returns {object} - Formatted parameters
 */
export function formatQueryParams(params) {
  const formatted = {};

  Object.entries(params).forEach(([
    key,
    value,
  ]) => {
    if (value !== null && value !== undefined && value !== "") {
      formatted[key] = value;
    }
  });

  return formatted;
}

/**
 * Parse error response from Trustpilot API
 * @param {object} error - Error object from API
 * @returns {object} - Parsed error
 */
export function parseApiError(error) {
  if (error.response) {
    const {
      status, data,
    } = error.response;
    return {
      status,
      message: data?.message || data?.error || "API Error",
      details: data?.details || data?.errors || [],
      code: data?.code || `HTTP_${status}`,
    };
  }

  return {
    status: 0,
    message: error.message || "Unknown error",
    details: [],
    code: "UNKNOWN_ERROR",
  };
}

/**
 * Sleep function for retry logic
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
