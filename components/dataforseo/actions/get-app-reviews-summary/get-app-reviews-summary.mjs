import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-app-reviews-summary",
  name: "Get App Reviews Summary",
  description: "Get app reviews and ratings summary for mobile app reputation analysis. [See the documentation](https://docs.dataforseo.com/v3/app_data/apple/app_reviews/live/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    appId: {
      type: "string",
      label: "App ID",
      description: "App ID or package name for the mobile app",
    },
    locationCode: {
      propDefinition: [
        dataforseo,
        "locationCode",
      ],
    },
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort reviews by specific criteria",
      options: [
        "most_recent",
        "most_helpful",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getAppReviewsSummary({
      $,
      data: [
        {
          app_id: this.appId,
          location_code: this.locationCode,
          language_code: this.languageCode,
          sort_by: this.sortBy,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000 && response.tasks[0].status_code !== 20100) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved app reviews summary for "${this.appId}".`);
    return response;
  },
};
