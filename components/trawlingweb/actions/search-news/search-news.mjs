import trawlingweb from "../../trawlingweb.app.mjs";

export default {
  key: "trawlingweb-search-news",
  name: "Search News",
  description: "Search for news based on the specified search parameters. [See the documentation](https://dashboard.trawlingweb.com/documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trawlingweb,
    query: {
      type: "string",
      label: "Query",
      description: "The search query",
    },
    dateStart: {
      type: "string",
      label: "Date Start",
      description: "The start date of the search in ISO 8601 format (YYYY-MM-DD)",
      optional: true,
    },
    dateEnd: {
      type: "string",
      label: "Date End",
      description: "The end date of the search in ISO 8601 format (YYYY-MM-DD)",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort by publishing date or crawled date. Default: `crawled`",
      options: [
        "published",
        "crawled",
      ],
      optional: true,
    },
    order: {
      type: "string",
      label: "Order",
      description: "Set up the order in ascending (from older news to newer) or descending (from newer news to older)",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      optional: true,
      max: 100,
    },
  },
  async run({ $ }) {
    const { response: { data } } = await this.trawlingweb.searchNews({
      $,
      params: {
        q: this.query,
        ts: this.dateStart
          ? Date.parse(this.dateStart)
          : undefined,
        tsi: this.dateEnd
          ? Date.parse(this.dateEnd)
          : undefined,
        sort: this.sort === "published"
          ? "published"
          : undefined,
        order: this.order,
        size: this.maxResults,
      },
    });

    $.export("$summary", `Found ${data?.length} news resources`);

    return data;
  },
};
