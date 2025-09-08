import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-reviews",
  name: "Get Google Reviews",
  description: "Get Google business reviews and ratings for local SEO and reputation management. [See the documentation](https://docs.dataforseo.com/v3/business_data/google/reviews/task_post/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for",
    },
    locationCoordinate: {
      propDefinition: [
        dataforseo,
        "locationCoordinate",
      ],
    },
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getGoogleReviews({
      $,
      data: [
        {
          keyword: this.keyword,
          location_coordinate: this.locationCoordinate,
          language_code: this.languageCode,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000 && response.tasks[0].status_code !== 20100) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved Google reviews for "${this.keyword}".`);
    return response;
  },
};
