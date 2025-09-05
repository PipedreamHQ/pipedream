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
          if (query === "") {
            // Trustpilot requires a query to be passed in, default to "a" if empty
            query = "a";
          }

          const businessUnits = await this.searchBusinessUnits({
            // Trustpilot requires the page to be 1-indexed
            // whereas pipedream is 0-indexed
            page: page + 1,
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
      const response = await makeRequest(this, this, {
        endpoint: ENDPOINTS.BUSINESS_UNITS,
        params: {
          query,
          page,
        },
      });

      return response.businessUnits || [];
    },

    // Shared method for fetching service reviews - used by both actions and sources
    async fetchServiceReviews($, params = {}) {
      const {
        businessUnitId,
        page = 1,
        perPage = 20,
        orderBy = "createdat.desc",
        ignoreTagValueCase = false,
        ...filters
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
      const queryParams = {
        ...filters,
        page,
        perPage,
        orderBy,
        ignoreTagValueCase,
      };

      // Make the API request
      const response = await makeRequest($, this, {
        endpoint,
        params: queryParams,
      });

      // Handle the correct response structure (reviews array)
      const reviews = response.reviews?.map(parseServiceReview) || [];
      const pagination = {
        total: typeof response.total === "number"
          ? response.total :
          null,
        // Preserve the page and perPage we requested
        page: queryParams.page,
        perPage: queryParams.perPage,
        // Determine if there’s a next page by checking for a "next" link
        hasMore: Array.isArray(response.links)
          ? response.links.some((l) => l?.rel === "next-page")
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

    // Shared method for fetching product reviews - used by both actions and sources
    async fetchProductReviews($, params = {}) {
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
      if (!validateBusinessUnitId(businessUnitId)) {
        throw new Error("Invalid business unit ID format");
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
        language,
      };

      // Make the API request
      const response = await makeRequest($, this, {
        endpoint,
        params: queryParams,
      });

      // Handle the correct response structure (productReviews, not reviews)
      const reviews = response.productReviews?.map(parseProductReview) || [];
      const pagination = {
        total: response.total || 0,
        page: queryParams.page || 1,
        perPage: queryParams.perPage || 20,
        hasMore: response.links?.some((l) => l.rel === "next") || false,
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
