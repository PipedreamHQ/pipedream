import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-threads-content",
  name: "Search Threads Content",
  description: "Searches Threads for posts matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/threads/search&method=GET)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "searchQuery",
      ],
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchThreadsContent({
      $,
      query: this.query,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched Threads content matching "${this.query}"`);
    return response;
  },
};
