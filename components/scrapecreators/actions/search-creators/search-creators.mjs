import { SEARCH_PLATFORMS } from "../../common/constants.mjs";
import app from "../../scrapecreators.app.mjs";

export default {
  key: "scrapecreators-search-creators",
  name: "Search Creators",
  description: "Search for creators based on platform and query. [See the documentation](https://docs.scrapecreators.com/api-reference/introduction)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    platform: {
      propDefinition: [
        app,
        "platform",
      ],
      options: SEARCH_PLATFORMS,
    },
    query: {
      type: "string",
      label: "Query",
      description: "The query to search for creators on",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of creators to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const results = this.app.paginate({
      $,
      fn: this.app.searchCreators,
      maxResults: this.limit,
      platform: this.platform,
      params: {
        query: this.query,
      },
    });

    const data = [];
    for await (const item of results) {
      data.push(item);
    }

    $.export("$summary", `Successfully searched for **${this.query}**`);
    return data;
  },
};
