import app from "../../codeclassify.app.mjs";

export default {
  key: "codeclassify-search-naics",
  name: "Search NAICS Codes",
  description: "Find NAICS 2022 industry codes from a plain-English business description. [See the docs](https://code-classify.com/api/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
      label: "Business Description",
      description: "A plain-English business activity, e.g. `software publishers`.",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum number of results (1-25).",
      default: 10,
      max: 25,
    },
  },
  async run({ $ }) {
    const response = await this.app.searchNaics({
      $,
      params: {
        q: this.query,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response.count ?? 0} NAICS match${(response.count ?? 0) === 1 ? "" : "es"} for "${this.query}"`);
    return response;
  },
};
