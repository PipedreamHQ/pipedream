import app from "../../veilstrat.app.mjs";

export default {
  key: "veilstrat-get-filter-catalog",
  name: "Get Filter Catalog",
  description: "Get the current catalog of supported search rules, technology identifiers and signal slices. [See the documentation](https://app.veilstrat.com/docs/api/endpoints)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const result = await this.app.getFilters({
      $,
    });
    $.export("$summary", "Retrieved the current filter catalog");
    return result;
  },
};
