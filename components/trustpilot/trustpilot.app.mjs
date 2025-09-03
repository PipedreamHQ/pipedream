import { defineApp } from "@pipedream/types";
import { makeRequest } from "./common/api-client.mjs";
import {
  DEFAULT_LIMIT,
  ENDPOINTS,
  MAX_LIMIT,
  SORT_OPTIONS,
} from "./common/constants.mjs";
import {
  buildUrl,
  parseReview,
  sanitizeInput,
  validateBusinessUnitId,
  validateReviewId,
} from "./common/utils.mjs";

export default defineApp({
  type: "app",
  app: "trustpilot",
  propDefinitions: {
    businessUnitId: {
      type: "string",
      label: "Business Unit ID",
      description: "The unique identifier for your business unit on Trustpilot",
      useQuery: true,
      async options({
        page, query,
      }) {
        try {
          const businessUnits = await this.searchBusinessUnits({
            page,
            query,
          });

          return businessUnits.map((businessUnit) => {
            const {
              id, displayName,
            } = businessUnit;

            return {
              label: displayName,
              value: id,
            };
          });
        } catch (error) {
          console.error("Error fetching business units:", error);
          return [];
        }
      },
    },
    reviewId: {
      type: "string",
      label: "Review ID",
      description: "The unique identifier for a review",
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "Filter by SKU",
      optional: true,
    },
    productUrl: {
      type: "string",
      label: "Product URL",
      description: "Filter by product URL",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "How to sort the results",
      options: Object.entries(SORT_OPTIONS).map(([
        key,
        value,
      ]) => ({
        label: key.replace(/_/g, " ").toLowerCase(),
        value,
      })),
      optional: true,
      default: SORT_OPTIONS.CREATED_AT_DESC,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return",
      min: 1,
      max: MAX_LIMIT,
      default: DEFAULT_LIMIT,
      optional: true,
    },
    includeReportedReviews: {
      type: "boolean",
      label: "Include Reported Reviews",
      description: "Whether to include reviews that have been reported",
      default: false,
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Filter reviews by tags",
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "Filter reviews by language (ISO 639-1 code)",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "Which reviews to retrieve according to their review state. Default is Published.",
      options: [
        "published",
        "unpublished",
      ],
      optional: true,
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The language in which the attributes, if any, are returned",
      optional: true,
    },
  },
  methods: {
    async searchBusinessUnits({
      query = "a", page = 1,
    } = {}) {
      const response = await makeRequest(this, {
        endpoint: ENDPOINTS.BUSINESS_UNITS,
        params: {
          query,
          page,
        },
      });

      return response.businessUnits || [];
    },

    // Public Review methods (no auth required for basic info)
    async getPublicServiceReviews({
      businessUnitId,
      stars = null,
      sortBy = SORT_OPTIONS.CREATED_AT_DESC,
      limit = DEFAULT_LIMIT,
      offset = 0,
      tags = [],
      language = null,
    }) {
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }

      const endpoint = buildUrl(ENDPOINTS.PUBLIC_REVIEWS, {
        businessUnitId,
      });
      const params = {
        stars,
        orderBy: sortBy,
        perPage: limit,
        page: Math.floor(offset / limit) + 1,
        language,
      };

      if (tags.length > 0) {
        params.tags = tags.join(",");
      }

      const response = await this._makeRequestWithRetry({
        endpoint,
        params,
      });

      return {
        reviews: response.reviews?.map(parseReview) || [],
        pagination: {
          total: response.pagination?.total || 0,
          page: response.pagination?.page || 1,
          perPage: response.pagination?.perPage || limit,
          hasMore: response.pagination?.hasMore || false,
        },
      };
    },

    async getPublicServiceReviewById({
      businessUnitId, reviewId,
    }) {
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }
      if (!validateReviewId(reviewId)) {
        throw new Error("Invalid review ID");
      }

      const endpoint = buildUrl(ENDPOINTS.PUBLIC_REVIEW_BY_ID, {
        businessUnitId,
        reviewId,
      });
      const response = await this._makeRequest({
        endpoint,
      });
      return parseReview(response);
    },

    // Service Review methods - simplified for sources
    async getServiceReviews({
      businessUnitId,
      stars = null,
      sortBy = SORT_OPTIONS.CREATED_AT_DESC,
      limit = DEFAULT_LIMIT,
      offset = 0,
      tags = [],
      language = null,
    } = {}) {
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }

      const endpoint = buildUrl(ENDPOINTS.PUBLIC_REVIEWS, {
        businessUnitId,
      });

      const params = {
        stars,
        orderBy: sortBy,
        perPage: limit,
        page: Math.floor(offset / limit) + 1,
        language,
      };

      if (tags && tags.length > 0) {
        params.tags = Array.isArray(tags)
          ? tags.join(",")
          : tags;
      }

      const response = await makeRequest(this, {
        endpoint,
        params,
      });

      return {
        reviews: response.reviews?.map(parseReview) || [],
        pagination: {
          total: response.pagination?.total || 0,
          page: response.pagination?.page || 1,
          perPage: response.pagination?.perPage || limit,
          hasMore: response.pagination?.hasMore || false,
        },
      };
    },

    async getServiceReviewById({
      businessUnitId, reviewId,
    }) {
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }
      if (!validateReviewId(reviewId)) {
        throw new Error("Invalid review ID");
      }

      const endpoint = buildUrl(ENDPOINTS.SERVICE_REVIEW_BY_ID, {
        businessUnitId,
        reviewId,
      });
      const response = await this._makeRequest({
        endpoint,
      });
      return parseReview(response);
    },

    async replyToServiceReview({
      businessUnitId, reviewId, message,
    }) {
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }
      if (!validateReviewId(reviewId)) {
        throw new Error("Invalid review ID");
      }
      if (!message || typeof message !== "string") {
        throw new Error("Reply message is required");
      }

      // Sanitize and validate message length (Trustpilot limit is 5000 characters)
      const sanitizedMessage = sanitizeInput(message, 5000);
      if (sanitizedMessage.length === 0) {
        throw new Error("Reply message cannot be empty after sanitization");
      }

      const endpoint = buildUrl(ENDPOINTS.REPLY_TO_SERVICE_REVIEW, {
        businessUnitId,
        reviewId,
      });
      const response = await this._makeRequest({
        endpoint,
        method: "POST",
        data: {
          message: sanitizedMessage,
        },
      });
      return response;
    },

    // Product Review methods - simplified for sources
    async getProductReviews({
      businessUnitId,
      sku = null,
      productUrl = null,
      stars = null,
      sortBy = SORT_OPTIONS.CREATED_AT_DESC,
      limit = DEFAULT_LIMIT,
      offset = 0,
      includeReportedReviews = false,
      tags = [],
      language = null,
    } = {}) {
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }

      const endpoint = buildUrl(ENDPOINTS.PRIVATE_PRODUCT_REVIEWS, {
        businessUnitId,
      });

      const params = {
        sku,
        productUrl,
        stars,
        orderBy: sortBy,
        perPage: limit,
        page: Math.floor(offset / limit) + 1,
        includeReportedReviews,
        language,
      };

      if (tags && tags.length > 0) {
        params.tags = Array.isArray(tags)
          ? tags.join(",")
          : tags;
      }

      const response = await makeRequest(this, {
        endpoint,
        params,
      });

      return {
        reviews: response.productReviews?.map(parseReview) || [], // Note: productReviews not reviews
        pagination: {
          total: response.links?.total || 0,
          page: params.page,
          perPage: params.perPage,
          hasMore: response.links?.next
            ? true
            : false,
        },
      };
    },

    async getProductReviewById({ reviewId }) {
      if (!validateReviewId(reviewId)) {
        throw new Error("Invalid review ID");
      }

      const endpoint = buildUrl(ENDPOINTS.PRIVATE_PRODUCT_REVIEW_BY_ID, {
        reviewId,
      });
      const response = await this._makeRequest({
        endpoint,
      });
      return parseReview(response);
    },

    async replyToProductReview({
      reviewId, message,
    }) {
      if (!validateReviewId(reviewId)) {
        throw new Error("Invalid review ID");
      }
      if (!message || typeof message !== "string") {
        throw new Error("Reply message is required");
      }

      // Sanitize and validate message length (Trustpilot limit is 5000 characters)
      const sanitizedMessage = sanitizeInput(message, 5000);
      if (sanitizedMessage.length === 0) {
        throw new Error("Reply message cannot be empty after sanitization");
      }

      const review = await this.getProductReviewById({
        reviewId,
      });

      let conversationId = review.conversationId;

      if (!conversationId) {
        const createConversationEndpoint = buildUrl(ENDPOINTS.CREATE_CONVERSATION_FOR_REVIEW, {
          reviewId,
        });
        const createConversationResponse = await this._makeRequest({
          endpoint: createConversationEndpoint,
          method: "POST",
        });
        conversationId = createConversationResponse.conversationId;
      }

      const replyToConversationEndpoint = buildUrl(ENDPOINTS.REPLY_TO_CONVERSATION, {
        conversationId,
      });
      const response = await this._makeRequest({
        endpoint: replyToConversationEndpoint,
        method: "POST",
        data: {
          message: sanitizedMessage,
        },
      });
      return response;
    },

    // Conversation methods
    async getConversations({
      limit = DEFAULT_LIMIT,
      offset = 0,
      sortBy = SORT_OPTIONS.CREATED_AT_DESC,
      businessUnitId = null,
    } = {}) {
      const params = {
        perPage: limit,
        page: Math.floor(offset / limit) + 1,
        orderBy: sortBy,
      };

      if (businessUnitId) {
        params.businessUnitId = businessUnitId;
      }

      const response = await this._makeRequestWithRetry({
        endpoint: ENDPOINTS.CONVERSATIONS,
        params,
      });

      return {
        conversations: response.conversations || [],
        pagination: {
          total: response.pagination?.total || 0,
          page: response.pagination?.page || 1,
          perPage: response.pagination?.perPage || limit,
          hasMore: response.pagination?.hasMore || false,
        },
      };
    },

    async getConversationById({ conversationId }) {
      if (!conversationId) {
        throw new Error("Invalid conversation ID");
      }

      const endpoint = buildUrl(ENDPOINTS.CONVERSATION_BY_ID, {
        conversationId,
      });
      const response = await this._makeRequest({
        endpoint,
      });
      return response;
    },

    async replyToConversation({
      conversationId, message,
    }) {
      if (!conversationId) {
        throw new Error("Invalid conversation ID");
      }
      if (!message || typeof message !== "string") {
        throw new Error("Reply message is required");
      }

      // Sanitize and validate message length (Trustpilot limit is 5000 characters)
      const sanitizedMessage = sanitizeInput(message, 5000);
      if (sanitizedMessage.length === 0) {
        throw new Error("Reply message cannot be empty after sanitization");
      }

      const endpoint = buildUrl(ENDPOINTS.REPLY_TO_CONVERSATION, {
        conversationId,
      });
      const response = await this._makeRequest({
        endpoint,
        method: "POST",
        data: {
          message: sanitizedMessage,
        },
      });
      return response;
    },

    // Webhook methods
    async createWebhook({
      url, events = [], businessUnitId = null,
    }) {
      if (!url) {
        throw new Error("Webhook URL is required");
      }
      if (!Array.isArray(events) || events.length === 0) {
        throw new Error("At least one event must be specified");
      }

      const data = {
        url,
        events,
      };

      if (businessUnitId) {
        data.businessUnitId = businessUnitId;
      }

      const response = await this._makeRequest({
        endpoint: ENDPOINTS.WEBHOOKS,
        method: "POST",
        data,
      });
      return response;
    },

    async deleteWebhook(webhookId) {
      if (!webhookId) {
        throw new Error("Webhook ID is required");
      }

      const endpoint = buildUrl(ENDPOINTS.WEBHOOK_BY_ID, {
        webhookId,
      });
      await this._makeRequest({
        endpoint,
        method: "DELETE",
      });
    },

    async listWebhooks() {
      const response = await this._makeRequest({
        endpoint: ENDPOINTS.WEBHOOKS,
      });
      return response.webhooks || [];
    },
  },
});
