import { makeRequest } from "./common/api-client.mjs";
import { ENDPOINTS } from "./common/constants.mjs";
import {
  buildUrl,
  parseServiceReview,
  parseProductReview,
  validateBusinessUnitId,
} from "./common/utils.mjs";

export default {
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
    page: {
      type: "integer",
      label: "Page",
      description: "The page to retrieve",
      min: 1,
      default: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of items to retrieve per page",
      min: 1,
      max: 100,
      default: 20,
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

    // Shared method for fetching service reviews - used by both actions and sources
    async fetchServiceReviews(params = {}) {
      const {
        businessUnitId,
        stars,
        language,
        page = 1,
        internalLocationId,
        perPage = 20,
        orderBy = "createdat.desc",
        tagGroup,
        tagValue,
        ignoreTagValueCase = false,
        responded,
        referenceId,
        referralEmail,
        reported,
        startDateTime,
        endDateTime,
        source,
        username,
        findReviewer,
      } = params;

      // Validate required parameters
      if (!businessUnitId) {
        throw new Error("Business Unit ID is required");
      }
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID format");
      }

      // Build the endpoint URL
      const endpoint = buildUrl(ENDPOINTS.SERVICE_REVIEWS, {
        businessUnitId,
      });

      // Prepare query parameters
      const queryParams = {};

      // Add optional parameters if provided
      if (stars) queryParams.stars = stars;
      if (language) queryParams.language = language;
      if (page) queryParams.page = page;
      if (internalLocationId) queryParams.internalLocationId = internalLocationId;
      if (perPage) queryParams.perPage = perPage;
      if (orderBy) queryParams.orderBy = orderBy;
      if (tagGroup) queryParams.tagGroup = tagGroup;
      if (tagValue) queryParams.tagValue = tagValue;
      if (ignoreTagValueCase !== undefined) queryParams.ignoreTagValueCase = ignoreTagValueCase;
      if (responded !== undefined) queryParams.responded = responded;
      if (referenceId) queryParams.referenceId = referenceId;
      if (referralEmail) queryParams.referralEmail = referralEmail;
      if (reported !== undefined) queryParams.reported = reported;
      if (startDateTime) queryParams.startDateTime = startDateTime;
      if (endDateTime) queryParams.endDateTime = endDateTime;
      if (source) queryParams.source = source;
      if (username) queryParams.username = username;
      if (findReviewer) queryParams.findReviewer = findReviewer;

      // Make the API request
      const response = await makeRequest(this, {
        endpoint,
        params: queryParams,
      });

      // Handle the correct response structure (reviews array)
      const reviews = response.reviews?.map(parseServiceReview) || [];
      const pagination = {
        total: response.pagination?.total || 0,
        page: response.pagination?.page || page,
        perPage: response.pagination?.perPage || perPage,
        hasMore: response.pagination?.hasMore || false,
      };

      return {
        reviews,
        pagination,
        metadata: {
          businessUnitId,
          filters: queryParams,
          requestTime: new Date().toISOString(),
        },
      };
    },

    // Shared method for fetching product reviews - used by both actions and sources
    async fetchProductReviews(params = {}) {
      const {
        businessUnitId,
        page,
        perPage,
        sku,
        language,
        state,
        locale,
      } = params;

      // Validate required parameters
      if (!businessUnitId) {
        throw new Error("Business Unit ID is required");
      }

      // Build the endpoint URL
      const endpoint = buildUrl(ENDPOINTS.PRIVATE_PRODUCT_REVIEWS, {
        businessUnitId,
      });

      // Prepare query parameters
      const queryParams = {
        sku,
        state,
        locale,
        perPage,
        page,
        includeReportedReviews: false,
        language,
      };

      // Make the API request
      const response = await makeRequest(this, {
        endpoint,
        params: queryParams,
      });

      // Handle the correct response structure (productReviews, not reviews)
      const reviews = response.productReviews?.map(parseProductReview) || [];
      const pagination = {
        total: response.links?.total || 0,
        page: queryParams.page || 1,
        perPage: queryParams.perPage || 20,
        hasMore: response.links?.next
          ? true
          : false,
      };

      return {
        reviews,
        pagination,
        metadata: {
          businessUnitId,
          filters: queryParams,
          requestTime: new Date().toISOString(),
        },
      };
    },
  },
};
