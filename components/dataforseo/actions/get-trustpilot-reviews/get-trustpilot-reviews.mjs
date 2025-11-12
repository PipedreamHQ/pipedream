import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-trustpilot-reviews",
  name: "Get Trustpilot Reviews",
  description: "Get Trustpilot business reviews and ratings for reputation management. [See the documentation](https://docs.dataforseo.com/v3/business_data/trustpilot/reviews/task_post/?bash)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain of the local establishment. Example: `www.thepearlsource.com`",
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort reviews by specific criteria",
      options: [
        "recency",
        "relevance",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getTrustpilotReviews({
      $,
      data: [
        {
          domain: this.domain,
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

    $.export("$summary", `Successfully retrieved Trustpilot reviews for "${this.domain}".`);
    return response;
  },
};
