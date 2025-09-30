import app from "../../tavily.app.mjs";

export default {
  key: "tavily-send-query",
  name: "Send Query",
  description: "Search for data based on a query. [See the documentation](https://docs.tavily.com/docs/tavily-api/rest_api#post-search)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    searchDepth: {
      propDefinition: [
        app,
        "searchDepth",
      ],
    },
    includeImages: {
      propDefinition: [
        app,
        "includeImages",
      ],
    },
    includeAnswer: {
      propDefinition: [
        app,
        "includeAnswer",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendQuery({
      $,
      data: {
        query: this.query,
        search_depth: this.searchDepth,
        include_images: this.includeImages,
        include_answer: this.includeAnswer,
      },
    });

    $.export("$summary", `Successfully sent query and got the following answer: '${response.answer}'`);

    return response;
  },
};
