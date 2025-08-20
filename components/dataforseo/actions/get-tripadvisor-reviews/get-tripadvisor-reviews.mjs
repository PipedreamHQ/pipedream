import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-tripadvisor-reviews",
  name: "Get TripAdvisor Reviews",
  description: "Get TripAdvisor business reviews and ratings, especially useful for hospitality businesses. [See the documentation](https://docs.dataforseo.com/v3/business_data/tripadvisor/reviews/task_post/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for",
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
        "detailed_reviews",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getTripadvisorReviews({
      $,
      data: [
        {
          keyword: this.keyword,
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

    $.export("$summary", `Successfully retrieved TripAdvisor reviews for "${this.keyword}".`);
    return response;
  },
};
