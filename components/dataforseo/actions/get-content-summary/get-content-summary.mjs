import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-content-summary",
  name: "Get Content Summary",
  description: "Get content performance metrics and summary for content strategy optimization. [See the documentation](https://docs.dataforseo.com/v3/content_analysis/summary/live/?bash)",
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
  },
  async run({ $ }) {
    const response = await this.dataforseo.getContentSummary({
      $,
      data: [
        {
          keyword: this.keyword,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved content summary for "${this.keyword}".`);
    return response;
  },
};
