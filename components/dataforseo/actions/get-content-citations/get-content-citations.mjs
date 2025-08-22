import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-content-citations",
  name: "Get Content Citations",
  description: "Find mentions and citations of keywords or brands online for brand monitoring and content strategy. [See the documentation](https://docs.dataforseo.com/v3/content_analysis/search/live/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for",
    },
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getContentCitations({
      $,
      data: [
        {
          keyword: this.keyword,
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

    $.export("$summary", `Successfully retrieved content citations for "${this.keyword}".`);
    return response;
  },
};
