import app from "../../codeclassify.app.mjs";

export default {
  key: "codeclassify-search-hs-code",
  name: "Search HS Codes",
  description: "Find Harmonized System (HS) customs codes from a plain-English product description. [See the docs](https://code-classify.com/api/).",
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
      type: "string",
      label: "Product Description",
      description: "A plain-English product, e.g. `coffee`.",
    },
    limit: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results (1-30).",
      optional: true,
      default: 15,
      min: 1,
      max: 30,
    },
  },
  async run({ $ }) {
    const response = await this.app.searchHsCode({
      $,
      params: {
        q: this.query,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response.count ?? 0} HS match${(response.count ?? 0) === 1 ? "" : "es"} for "${this.query}"`);
    return response;
  },
};
