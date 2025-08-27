import { axios } from "@pipedream/platform";
import * as crypto from "crypto";
import {
  BASE_URL,
  DEFAULT_LIMIT,
  ENDPOINTS,
  HTTP_STATUS,
  MAX_LIMIT,
  RATING_SCALE,
  RETRY_CONFIG,
  SORT_OPTIONS,
} from "./common/constants.mjs";
import {
  buildUrl,
  formatQueryParams,
  parseBusinessUnit,
  parseReview,
  parseWebhookPayload,
  sanitizeInput,
  sleep,
  validateBusinessUnitId,
  validateReviewId,
} from "./common/utils.mjs";

export default {
  type: "app",
  app: "trustpilot",
  propDefinitions: {
    businessUnitId: {
      type: "string",
      label: "Business Unit ID",
      description: "The unique identifier for your business unit on Trustpilot",
      async options() {
        try {
          const businessUnits = await this.searchBusinessUnits({
            query: "",
            limit: 20,
          });
          return businessUnits.map(({
            id, displayName, name: { identifying },
          }) => ({
            label: `${identifying || displayName}`,
            value: id,
          }));
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
    stars: {
      type: "integer",
      label: "Star Rating",
      description: "Filter by star rating (1-5)",
      options: RATING_SCALE,
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
  },
  methods: {
    // Authentication and base request methods
    _getAuthHeaders() {
      const headers = {
        "Content-Type": "application/json",
        "User-Agent": "Pipedream/1.0",
      };

      if (!this.$auth?.api_key && !this.$auth?.oauth_access_token) {
        throw new Error("Authentication required: Configure either API key or OAuth token");
      }

      if (this.$auth?.api_key) {
        headers["apikey"] = this.$auth.api_key;
      }

      if (this.$auth?.oauth_access_token) {
        headers["Authorization"] = `Bearer ${this.$auth.oauth_access_token}`;
      }

      return headers;
    },

    async _makeRequest({
      endpoint, method = "GET", params = {}, data = null, ...args
    }) {
      const url = `${BASE_URL}${endpoint}`;
      const headers = this._getAuthHeaders();

      const config = {
        method,
        url,
        headers,
        params: formatQueryParams(params),
        timeout: 30000,
        ...args,
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(this, config);
      return response.data || response;
    },

    async _makeRequestWithRetry(config, retries = RETRY_CONFIG.MAX_RETRIES) {
      try {
        return await this._makeRequest(config);
      } catch (error) {
        if (retries > 0 && error.response?.status === HTTP_STATUS.TOO_MANY_REQUESTS) {
          const delay = Math.min(
            RETRY_CONFIG.INITIAL_DELAY * (RETRY_CONFIG.MAX_RETRIES - retries + 1),
            RETRY_CONFIG.MAX_DELAY,
          );
          await sleep(delay);
          return this._makeRequestWithRetry(config, retries - 1);
        }
        throw error;
      }
    },

    // Business Unit methods
    async getBusinessUnit(businessUnitId) {
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }

      const endpoint = buildUrl(ENDPOINTS.BUSINESS_UNIT_BY_ID, {
        businessUnitId,
      });
      const response = await this._makeRequest({
        endpoint,
      });
      return parseBusinessUnit(response);
    },

    async searchBusinessUnits({
      query = "", limit = DEFAULT_LIMIT, offset = 0,
    } = {}) {
      const response = await this._makeRequest({
        endpoint: ENDPOINTS.BUSINESS_UNITS,
        params: {
          query,
          limit,
          offset,
        },
      });

      return response.businessUnits?.map(parseBusinessUnit) || [];
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

    // Private helper for fetching reviews
    async _getReviews({
      endpoint,
      businessUnitId,
      stars = null,
      sortBy = SORT_OPTIONS.CREATED_AT_DESC,
      limit = DEFAULT_LIMIT,
      offset = 0,
      includeReportedReviews = false,
      tags = [],
      language = null,
    }) {
      if (businessUnitId && !validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID");
      }

      const params = {
        stars,
        orderBy: sortBy,
        perPage: limit,
        page: Math.floor(offset / limit) + 1,
        includeReportedReviews,
        language,
      };

      if (tags.length > 0) {
        params.tags = tags.join(",");
      }

      const response = await this._makeRequestWithRetry({
        endpoint: endpoint || ENDPOINTS.PRIVATE_SERVICE_REVIEWS,
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

    // Private Service Review methods
    async getServiceReviews(options = {}) {
      const endpoint = buildUrl(ENDPOINTS.PUBLIC_REVIEWS, {
        businessUnitId: options.businessUnitId,
      });
      return this._getReviews({
        endpoint,
        ...options,
      });
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

      const endpoint = buildUrl(ENDPOINTS.PRIVATE_SERVICE_REVIEW_BY_ID, {
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

    // Product Review methods
    async getProductReviews(options = {}) {
      const endpoint = buildUrl(ENDPOINTS.PUBLIC_PRODUCT_REVIEWS, {
        businessUnitId: options.businessUnitId,
      });
      return this._getReviews({
        endpoint,
        ...options,
      });
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

      const endpoint = buildUrl(ENDPOINTS.REPLY_TO_PRODUCT_REVIEW, {
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

    // Utility methods
    parseWebhookPayload(payload) {
      return parseWebhookPayload(payload);
    },

    validateWebhookSignature(payload, signature, secret) {
      // Trustpilot uses HMAC-SHA256 for webhook signature validation
      // The signature is sent in the x-trustpilot-signature header
      if (!signature || !secret) {
        return false;
      }

      const payloadString = typeof payload === "string"
        ? payload
        : JSON.stringify(payload);

      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payloadString)
        .digest("hex");

      // Constant time comparison to prevent timing attacks
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature),
      );
    },

  },
};
