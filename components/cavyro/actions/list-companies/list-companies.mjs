import cavyro from "../../cavyro.app.mjs";

export default {
  key: "cavyro-list-companies",
  name: "List Companies",
  description: "List Cavyro companies, newest first, optionally matching a search query. Use it to find `companyId` values for **Create Contact** and **Create Deal**, and before **Create Company** to avoid duplicates. [See the documentation](https://developers.cavyro.com)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cavyro,
    query: {
      type: "string",
      label: "Query",
      description: "Only return companies matching this text (2-100 characters), e.g. `Acme`.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to return, 100 per page, e.g. `2`. Defaults to `1`.",
      optional: true,
      min: 1,
    },
  },
  async run({ $ }) {
    const items = await this.cavyro.listCompanies({
      $,
      params: {
        q: this.query,
        page: this.page,
        limit: 100,
      },
    });
    $.export("$summary", `Found ${items.length} compan${items.length === 1
      ? "y"
      : "ies"}`);
    return items;
  },
};
