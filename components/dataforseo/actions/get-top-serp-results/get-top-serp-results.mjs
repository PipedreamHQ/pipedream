import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-top-serp-results",
  name: "Get Top SERP Results",
  description: "Get top-ranking pages and competitor analysis for specified keywords. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/serp_competitors/live/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    keywords: {
      propDefinition: [
        dataforseo,
        "keywords",
      ],
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
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getTopSerpResults({
      $,
      data: [
        {
          keywords: this.keywords,
          location_code: this.locationCode,
          language_code: this.languageCode,
          limit: this.limit,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved top SERP results for ${this.keywords.length} keywords.`);
    return response;
  },
};
