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
 * Parse Trustpilot product review data
 * @param {object} review - Raw product review data from API
 * @returns {object} - Parsed product review data
 */
export function parseProductReview(review) {
  return {
    id: review.id,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    businessUnitId: review.businessUnitId,
    stars: review.stars,
    content: escapeHtml(review.content),
    product: review.product
      ? {
        id: review.product.id,
        productUrl: review.product.productUrl,
        productImages: review.product.productImages || [],
        name: escapeHtml(review.product.name),
        sku: review.product.sku,
        gtin: review.product.gtin,
        mpn: review.product.mpn,
        brand: escapeHtml(review.product.brand),
      }
      : null,
    consumer: review.consumer
      ? {
        id: review.consumer.id,
        email: review.consumer.email,
        name: escapeHtml(review.consumer.name),
      }
      : null,
    referenceId: review.referenceId,
    locale: review.locale,
    language: review.language,
    redirectUri: review.redirectUri,
    state: review.state,
    hasModerationHistory: review.hasModerationHistory || false,
    conversationId: review.conversationId,
    attributeRatings: review.attributeRatings?.map((attr) => ({
      attributeId: attr.attributeId,
      attributeName: escapeHtml(attr.attributeName),
      attributeType: attr.attributeType,
      attributeOptions: attr.attributeOptions,
      rating: attr.rating,
    })) || [],
    attachments: review.attachments || [],
  };
}

/**
 * Parse Trustpilot service review data
 * @param {object} review - Raw service review data from API
 * @returns {object} - Parsed service review data
 */
export function parseServiceReview(review) {
  return {
    links: review.links || [],
    id: review.id,
    consumer: review.consumer
      ? {
        links: review.consumer.links || [],
        id: review.consumer.id,
        displayName: escapeHtml(review.consumer.displayName),
        displayLocation: escapeHtml(review.consumer.displayLocation),
        numberOfReviews: review.consumer.numberOfReviews,
      }
      : null,
    businessUnit: review.businessUnit
      ? {
        links: review.businessUnit.links || [],
        id: review.businessUnit.id,
        identifyingName: escapeHtml(review.businessUnit.identifyingName),
        displayName: escapeHtml(review.businessUnit.displayName),
      }
      : null,
    location: escapeHtml(review.location),
    stars: review.stars,
    title: escapeHtml(review.title),
    text: escapeHtml(review.text),
    language: review.language,
    createdAt: review.createdAt,
    experiencedAt: review.experiencedAt,
    updatedAt: review.updatedAt,
    companyReply: review.companyReply
      ? {
        text: escapeHtml(review.companyReply.text),
        authorBusinessUserId: review.companyReply.authorBusinessUserId,
        authorBusinessUserName: escapeHtml(review.companyReply.authorBusinessUserName),
        createdAt: review.companyReply.createdAt,
        updatedAt: review.companyReply.updatedAt,
      }
      : null,
    isVerified: review.isVerified || false,
    source: review.source,
    numberOfLikes: review.numberOfLikes || 0,
    status: review.status,
    reportData: review.reportData,
    complianceLabels: review.complianceLabels || [],
    countsTowardsTrustScore: review.countsTowardsTrustScore || false,
    countsTowardsLocationTrustScore: review.countsTowardsLocationTrustScore,
    invitation: review.invitation
      ? {
        businessUnitId: review.invitation.businessUnitId,
      }
      : null,
    businessUnitHistory: review.businessUnitHistory || [],
    reviewVerificationLevel: review.reviewVerificationLevel,
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
