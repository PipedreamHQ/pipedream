export const BASE_URL = "https://api.trustpilot.com/v1";

export const WEBHOOK_EVENTS = {
  REVIEW_CREATED: "review.created",
  REVIEW_REVISED: "review.revised",
  REVIEW_DELETED: "review.deleted",
  REPLY_CREATED: "reply.created",
  INVITATION_SENT: "invitation.sent",
  INVITATION_FAILED: "invitation.failed",
};

export const ENDPOINTS = {
  // Business Units
  BUSINESS_UNITS: "/business-units",
  BUSINESS_UNIT_BY_ID: "/business-units/{businessUnitId}",

  // Public Reviews
  PUBLIC_REVIEWS: "/business-units/{businessUnitId}/reviews",
  PUBLIC_REVIEW_BY_ID: "/business-units/{businessUnitId}/reviews/{reviewId}",

  // Private Reviews (Service)
  PRIVATE_SERVICE_REVIEWS: "/private/business-units/{businessUnitId}/reviews",
  PRIVATE_SERVICE_REVIEW_BY_ID: "/private/business-units/{businessUnitId}/reviews/{reviewId}",
  REPLY_TO_SERVICE_REVIEW: "/private/business-units/{businessUnitId}/reviews/{reviewId}/reply",

  // Private Reviews (Product)
  PRIVATE_PRODUCT_REVIEWS: "/private/product-reviews/business-units/{businessUnitId}/reviews",
  PRIVATE_PRODUCT_REVIEW_BY_ID: "/private/product-reviews/{reviewId}",
  REPLY_TO_PRODUCT_REVIEW: "/private/product-reviews/{reviewId}/reply",

  // Conversations
  CONVERSATIONS: "/private/conversations",
  CONVERSATION_BY_ID: "/private/conversations/{conversationId}",
  REPLY_TO_CONVERSATION: "/private/conversations/{conversationId}/reply",

  // Invitations
  EMAIL_INVITATIONS: "/private/business-units/{businessUnitId}/email-invitations",

  // Webhooks
  // Note: This integration uses polling sources instead of webhooks for better reliability
  // and simpler implementation. Webhook signature validation is implemented in the app
  // using HMAC-SHA256 with the x-trustpilot-signature header for future webhook sources.
  // These endpoints and validation methods are ready for webhook implementation if needed.
  WEBHOOKS: "/private/webhooks",
  WEBHOOK_BY_ID: "/private/webhooks/{webhookId}",
};

export const REVIEW_TYPES = {
  SERVICE: "service",
  PRODUCT: "product",
};

export const INVITATION_TYPES = {
  REVIEW: "review",
  PRODUCT_REVIEW: "product-review",
};

export const SORT_OPTIONS = {
  CREATED_AT_ASC: "createdat.asc",
  CREATED_AT_DESC: "createdat.desc",
  STARS_ASC: "stars.asc",
  STARS_DESC: "stars.desc",
  UPDATED_AT_ASC: "updatedat.asc",
  UPDATED_AT_DESC: "updatedat.desc",
};

export const RATING_SCALE = [
  1,
  2,
  3,
  4,
  5,
];

export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_DELAY: 1000,
  MAX_DELAY: 10000,
};

export const POLLING_CONFIG = {
  DEFAULT_TIMER_INTERVAL_SECONDS: 15 * 60, // 15 minutes
  MAX_ITEMS_PER_POLL: 100,
  LOOKBACK_HOURS: 24, // How far back to look on first run
};

export const SOURCE_TYPES = {
  NEW_REVIEWS: "new_reviews",
  UPDATED_REVIEWS: "updated_reviews",
  NEW_REPLIES: "new_replies",
  NEW_CONVERSATIONS: "new_conversations",
  UPDATED_CONVERSATIONS: "updated_conversations",
};
