import { ENDPOINTS } from "./constants.mjs";

/**
 * Build URL from endpoint template and parameters
 * @param {string} endpoint - Endpoint template with placeholders
 * @param {object} params - Parameters to replace in the endpoint
 * @returns {string} - Complete URL with parameters replaced
 */
export function buildUrl(endpoint, params = {}) {
  let url = endpoint;
  
  // Replace path parameters
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, value);
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
    title: review.title,
    text: review.text,
    language: review.language,
    location: review.location,
    tags: review.tags || [],
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    consumer: {
      id: review.consumer?.id,
      displayName: review.consumer?.displayName,
      numberOfReviews: review.consumer?.numberOfReviews,
    },
    company: {
      reply: review.companyReply ? {
        text: review.companyReply.text,
        createdAt: review.companyReply.createdAt,
      } : null,
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
  const { event, data } = payload;
  
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
  return businessUnitId && typeof businessUnitId === 'string' && businessUnitId.length > 0;
}

/**
 * Validate review ID format
 * @param {string} reviewId - Review ID to validate
 * @returns {boolean} - Whether the ID is valid
 */
export function validateReviewId(reviewId) {
  return reviewId && typeof reviewId === 'string' && reviewId.length > 0;
}

/**
 * Format query parameters for API requests
 * @param {object} params - Query parameters
 * @returns {object} - Formatted parameters
 */
export function formatQueryParams(params) {
  const formatted = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
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
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || data?.error || 'API Error',
      details: data?.details || data?.errors || [],
      code: data?.code || `HTTP_${status}`,
    };
  }
  
  return {
    status: 0,
    message: error.message || 'Unknown error',
    details: [],
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Sleep function for retry logic
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}