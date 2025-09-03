import trustpilot from "../../trustpilot.app.mjs";
import { makeRequest } from "../../common/api-client.mjs";
import { ENDPOINTS } from "../../common/constants.mjs";
import {
  buildUrl,
  parseProductReview,
} from "../../common/utils.mjs";

export default {
  key: "trustpilot-fetch-product-reviews",
  name: "Fetch Product Reviews",
  description: "Retrieves a list of product reviews for a specific business unit on Trustpilot. This action enables you to fetch multiple product reviews with powerful filtering options including star ratings, language, tags, and sorting preferences. Ideal for monitoring product feedback trends, generating reports, analyzing customer sentiment across your product catalog, or building review dashboards. Supports pagination for handling large review volumes. [See the documentation](https://developers.trustpilot.com/product-reviews-api#get-private-product-reviews)",
  version: "0.1.0",
  type: "action",
  props: {
    trustpilot,
    businessUnitId: {
      propDefinition: [
        trustpilot,
        "businessUnitId",
      ],
    },
    page: {
      propDefinition: [
        trustpilot,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        trustpilot,
        "perPage",
      ],
    },
    sku: {
      propDefinition: [
        trustpilot,
        "sku",
      ],
    },
    language: {
      propDefinition: [
        trustpilot,
        "language",
      ],
    },
    state: {
      propDefinition: [
        trustpilot,
        "state",
      ],
    },
    locale: {
      propDefinition: [
        trustpilot,
        "locale",
      ],
    },
  },
  async run({ $ }) {
    const {
      businessUnitId,
      page,
      perPage,
      sku,
      language,
      state,
      locale,
    } = this;

    // Validate required parameters
    if (!businessUnitId) {
      throw new Error("Business Unit ID is required");
    }

    try {
      // Build the endpoint URL
      const endpoint = buildUrl(ENDPOINTS.PRIVATE_PRODUCT_REVIEWS, {
        businessUnitId,
      });

      // Prepare query parameters
      const params = {
        sku,
        state,
        locale,
        perPage,
        page,
        includeReportedReviews: false,
        language,
      };

      // Make the API request
      const response = await makeRequest(this.trustpilot, {
        endpoint,
        params,
      });

      // Handle the correct response structure (productReviews, not reviews)
      const reviews = response.productReviews?.map(parseProductReview) || [];
      const pagination = {
        total: response.links?.total || 0,
        page: params.page,
        perPage: params.perPage,
        hasMore: response.links?.next
          ? true
          : false,
      };

      $.export("$summary", `Successfully fetched ${reviews.length} product review(s) for business unit ${businessUnitId}`);

      return {
        reviews,
        pagination,
        metadata: {
          businessUnitId,
          filters: {
            sku,
            page,
            perPage,
            state,
            locale,
            language,
          },
          requestTime: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch product reviews: ${error.message}`);
    }
  },
};
