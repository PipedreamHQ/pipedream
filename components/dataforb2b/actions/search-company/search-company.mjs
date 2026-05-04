import dataforb2b from "../../dataforb2b.app.mjs";

export default {
  key: "dataforb2b-search-company",
  name: "Search Company",
  description: "Search companies using advanced filters by size, funding stage, industry, investor, and more. [See the documentation](https://docs.dataforb2b.ai/api-reference/search-company)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dataforb2b,
    filters: {
      propDefinition: [
        dataforb2b,
        "filters",
      ],
    },
    count: {
      propDefinition: [
        dataforb2b,
        "count",
      ],
    },
    offset: {
      propDefinition: [
        dataforb2b,
        "offset",
      ],
    },
    enrichLive: {
      propDefinition: [
        dataforb2b,
        "enrichLive",
      ],
    },
  },
  async run({ $ }) {
    const data = {
      count: this.count,
      offset: this.offset,
      enrich_live: this.enrichLive,
    };

    if (this.filters) {
      data.filters = typeof this.filters === "string"
        ? JSON.parse(this.filters)
        : this.filters;
    }

    const response = await this.dataforb2b.searchCompanies({
      $,
      data,
    });

    $.export("$summary", `Successfully retrieved ${response.count} companies (${response.total} total)`);
    return response;
  },
};
