import trustpilot from "../../trustpilot.app.mjs";

export default {
  key: "trustpilot-fetch-service-reviews",
  name: "Fetch Service Reviews",
  description: "Fetches service reviews for a specific business unit from Trustpilot with support for filtering by star rating, tags, language, and more. [See the documentation](https://developers.trustpilot.com/business-units-api#get-business-unit-reviews)",
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
      const result = await this.trustpilot.getServiceReviews({
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

      $.export("$summary", `Successfully fetched ${reviews.length} service review(s) for business unit ${businessUnitId}`);

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
      throw new Error(`Failed to fetch service reviews: ${error.message}`);
    }
  },
};
