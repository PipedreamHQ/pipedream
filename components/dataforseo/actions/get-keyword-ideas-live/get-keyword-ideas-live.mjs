import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-keyword-ideas-live",
  name: "Get Keyword Ideas Live",
  description: "Generate live keyword suggestions and ideas for content strategy. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/keyword_ideas/live/?bash)",
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
    const response = await this.dataforseo.getKeywordIdeasLive({
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

    $.export("$summary", `Successfully retrieved keyword ideas for ${this.keywords.length} keywords.`);
    return response;
  },
};
