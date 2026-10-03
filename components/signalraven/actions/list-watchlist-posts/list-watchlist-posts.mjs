import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-list-watchlist-posts",
  name: "List Watchlist Posts",
  description: "List posts from the watchlist, the named accounts and people being tracked. [See the documentation](https://signalraven.ai/developers/api)",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listWatchlist({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });
    const count = response.data?.length || 0;
    $.export("$summary", `Fetched ${count} watchlist post${count === 1
      ? ""
      : "s"}.`);
    return response;
  },
};
