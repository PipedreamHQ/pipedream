import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-business-listings-categories",
  name: "Get Business Listings Categories",
  description: "Get available business categories for business listings and local SEO. [See the documentation](https://docs.dataforseo.com/v3/business_data/business_listings/categories/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
  },
  async run({ $ }) {
    const response = await this.dataforseo.getBusinessListingsCategories({
      $,
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved business listings categories.");
    return response;
  },
};
