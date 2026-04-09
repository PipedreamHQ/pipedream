import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-news",
  name: "Lookup News",
  description: "Look up detailed news article information by news search ID. [See the documentation](https://docs.pubrio.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    pubrio,
    newsSearchId: {
      type: "string",
      label: "News Search ID",
      description: "The news search ID to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.makeRequest({
      $,
      method: "POST",
      url: "/companies/news/lookup",
      data: { news_search_id: this.newsSearchId },
    });
    $.export("$summary", "Successfully looked up news article");
    return response;
  },
};
