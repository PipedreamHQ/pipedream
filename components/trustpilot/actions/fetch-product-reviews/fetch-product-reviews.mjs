import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-fetch-product-reviews",
  name: "Fetch Product Reviews",
  description: "Retrieves a list of product reviews for a specific business unit on Trustpilot. This action enables you to fetch multiple product reviews with powerful filtering options including star ratings, language, tags, and sorting preferences. Ideal for monitoring product feedback trends, generating reports, analyzing customer sentiment across your product catalog, or building review dashboards. Supports pagination for handling large review volumes. [See the documentation](https://developers.trustpilot.com/product-reviews-api#get-private-product-reviews)",
  version: "0.0.3",
  type: "action",
  props: {
    trustpilot,
    businessUnitId: {
      propDefinition: [
        trustpilot,
        "businessUnitId",
      ],
    },
    stars: {
      propDefinition: [
        trustpilot,
        "stars",
      ],
    },
    sortBy: {
      propDefinition: [
        trustpilot,
        "sortBy",
      ],
    },
    limit: {
      propDefinition: [
        trustpilot,
        "limit",
      ],
    },
    includeReportedReviews: {
      propDefinition: [
        trustpilot,
        "includeReportedReviews",
      ],
    },
    tags: {
      propDefinition: [
        trustpilot,
        "tags",
      ],
    },
    language: {
      propDefinition: [
        trustpilot,
        "language",
      ],
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Number of results to skip (for pagination)",
      min: 0,
      default: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      businessUnitId,
      stars,
      sortBy,
      limit,
      includeReportedReviews,
      tags,
      language,
      offset,
    } = this;

    try {
      const result = await this.trustpilot.getProductReviews({
        businessUnitId,
        stars,
        sortBy,
        limit,
        includeReportedReviews,
        tags,
        language,
        offset,
      });

      const {
        reviews, pagination,
      } = result;

      $.export("$summary", `Successfully fetched ${reviews.length} product review(s) for business unit ${businessUnitId}`);

      return {
        reviews,
        pagination,
        metadata: {
          businessUnitId,
          filters: {
            stars,
            sortBy,
            includeReportedReviews,
            tags,
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
