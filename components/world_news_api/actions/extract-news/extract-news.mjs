import app from "../../world_news_api.app.mjs";

export default {
  name: "Extract News",
  description: "Extract a news article from a website to a well structure JSON object. [See the docs here](https://worldnewsapi.com/docs/#Extract-News). **Calling this endpoint requires 1 point, plus 2 points if analyze is true.**",
  key: "world_news_api-extract-news",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the news article to extract.",
    },
    analyze: {
      type: "boolean",
      label: "Analyze",
      description: "Whether to analyze the news.",
    },
  },
  async run({ $ }) {
    const params = {
      url: this.url,
      analyze: this.analyze,
    };
    const res = await this.app.extractNews(params, $);
    $.export("$summary", res.title);
    return res;
  },
};
