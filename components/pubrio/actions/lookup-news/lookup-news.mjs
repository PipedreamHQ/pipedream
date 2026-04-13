import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-lookup-news",
  name: "Lookup News",
  description: "Look up detailed news article information by news search ID. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/news_lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    newsSearchId: {
      type: "string",
      label: "News Search ID",
      description: "The news search ID to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.lookupNews({
      $,
      data: {
        news_search_id: this.newsSearchId,
      },
    });
    $.export("$summary", `Successfully looked up news article ${this.newsSearchId}`);
    return response;
  },
};
