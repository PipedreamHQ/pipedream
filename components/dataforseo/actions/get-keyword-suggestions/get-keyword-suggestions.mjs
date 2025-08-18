import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-keyword-suggestions",
  name: "Get Keyword Suggestions",
  description: "Get keyword ideas and related terms for specified seed keywords. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/keyword_suggestions/live/?bash)",
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
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getKeywordSuggestions({
      $,
      data: [
        {
          keyword: this.keyword,
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

    $.export("$summary", `Successfully retrieved keyword suggestions for "${this.keyword}".`);
    return response;
  },
};
