import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-sentiment-analysis",
  name: "Get Sentiment Analysis",
  description: "Analyze sentiment of brand mentions and content for reputation management. [See the documentation](https://docs.dataforseo.com/v3/content_analysis/sentiment_analysis/live/?bash)",
  version: "0.0.1",
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
    const response = await this.dataforseo.getSentimentAnalysis({
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

    $.export("$summary", `Successfully analyzed sentiment for "${this.keyword}".`);
    return response;
  },
};
