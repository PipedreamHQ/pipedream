import trustpilot from "../../trustpilot.app.mjs";

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

    try {
      // Use the shared method from the app
      const result = await this.trustpilot.fetchProductReviews({
        businessUnitId,
        page,
        perPage,
        sku,
        language,
        state,
        locale,
      });

      $.export("$summary", `Successfully fetched ${result.reviews.length} product review(s) for business unit ${businessUnitId}`);

      return result;
    } catch (error) {
      throw new Error(`Failed to fetch product reviews: ${error.message}`);
    }
  },
};
