import app from "../../social_fetch.app.mjs";

export default {
  key: "social_fetch-search-tiktok-content",
  name: "Search TikTok Content",
  description: "Searches TikTok for videos/content matching a query. [See the documentation](https://app.socialfetch.dev/playground?path=/v1/tiktok/search&method=GET)",
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
      description: "Free-form search term to find TikTok content, e.g. `space exploration`. Plain string, no dropdown.",
    },
    cursor: {
      propDefinition: [
        app,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchTiktokContent({
      $,
      query: this.query,
      cursor: this.cursor,
    });
    $.export("$summary", `Successfully fetched TikTok content matching "${this.query}"`);
    return response;
  },
};
