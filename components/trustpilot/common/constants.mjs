export const BASE_URL = "https://api.trustpilot.com/v1";

export const ENDPOINTS = {
  // Business Units
  BUSINESS_UNITS: "/business-units/search",

  // Service Reviews
  SERVICE_REVIEWS: "/private/business-units/{businessUnitId}/reviews",
  SERVICE_REVIEW_BY_ID: "/private/reviews/{reviewId}",
  REPLY_TO_SERVICE_REVIEW: "/private/reviews/{reviewId}/reply",

  // Private Reviews (Product)
  PRIVATE_PRODUCT_REVIEWS: "/private/product-reviews/business-units/{businessUnitId}/reviews",
  PRIVATE_PRODUCT_REVIEW_BY_ID: "/private/product-reviews/{reviewId}",
  CREATE_CONVERSATION_FOR_REVIEW: "/private/product-reviews/{reviewId}/create-conversation",

  // Conversations
  CONVERSATION_BY_ID: "/private/conversations/{conversationId}",
  REPLY_TO_CONVERSATION: "/private/conversations/{conversationId}/comments",
};

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;
