import app from "../../finnhub.app.mjs";

export default {
  key: "finnhub-get-market-news",
  name: "Get Market News",
  description: "Get a list of the latest market news. [See the documentation](https://finnhub.io/docs/api/market-news)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    category: {
      propDefinition: [
        app,
        "category",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getMarketNews({
      $,
      data: {
        category: this.category,
      },
    });
    $.export("$summary", "Successfully retrieved " + response.length + " market news");
    return response;
  },
};
