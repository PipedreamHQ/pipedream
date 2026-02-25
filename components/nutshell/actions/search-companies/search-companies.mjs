import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-search-companies",
  name: "Search Companies",
  description: "Search companies (accounts) by string. Returns raw API results (array of account stubs). [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#a3c7830301c59b470e5947754cac32ad9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    searchString: {
      type: "string",
      label: "Search String",
      description: "The string to search for (matches company names, etc.).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of companies to return.",
      default: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const companies = await this.nutshell.searchCompanies({
      $,
      string: this.searchString,
      limit: this.limit ?? 1000,
    }) ?? [];
    $.export("$summary", `Found ${companies.length} company(ies)`);
    return companies;
  },
};
