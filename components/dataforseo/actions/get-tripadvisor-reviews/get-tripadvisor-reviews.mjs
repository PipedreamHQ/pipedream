import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-tripadvisor-reviews",
  name: "Get TripAdvisor Reviews",
  description: "Get TripAdvisor business reviews and ratings, especially useful for hospitality businesses. [See the documentation](https://docs.dataforseo.com/v3/business_data/tripadvisor/reviews/task_post/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the target location. Ex: `US`",
    },
    locationCode: {
      propDefinition: [
        dataforseo,
        "tripAdvisorLocationCode",
        (c) => ({
          countryCode: c.countryCode,
        }),
      ],
    },
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
      optional: true,
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
    waitForResults: {
      type: "boolean",
      label: "Wait for Results",
      description: "Wait for the results to be available. Not for use with Pipedream Connect.",
      default: true,
      optional: true,
    },
    postbackUrl: {
      type: "string",
      label: "Postback URL",
      description: "The URL to receive the search results. Only applicable when \"Wait for Results\" = `FALSE`",
      optional: true,
    },
  },
  async run({ $ }) {
    let response;
    const context = $.context;
    const run = context
      ? context.run
      : {
        runs: 1,
      };

    if (run.runs === 1) {
      let postbackUrl  = this.postbackUrl;
      if (context && this.waitForResults) {
        ({ resume_url: postbackUrl } = $.flow.rerun(600000, null, 1));
      }
      response = await this.dataforseo.getTripadvisorReviews({
        $,
        data: [
          {
            keyword: this.keyword,
            location_code: this.locationCode,
            language_code: this.languageCode,
            sort_by: this.sortBy,
            postback_url: postbackUrl,
          },
        ],
      });

      if (response.status_code !== 20000) {
        throw new ConfigurationError(`Error: ${response.status_message}`);
      }

      if (response.tasks[0].status_code !== 20000 && response.tasks[0].status_code !== 20100) {
        throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
      }
    }

    if (run.runs > 1) {
      response = run.callback_request.body;
    }

    $.export("$summary", `Successfully retrieved TripAdvisor reviews for "${this.keyword}".`);
    return response;
  },
};
