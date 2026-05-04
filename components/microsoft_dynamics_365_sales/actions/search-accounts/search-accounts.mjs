import microsoft from "../../microsoft_dynamics_365_sales.app.mjs";

export default {
  key: "microsoft_dynamics_365_sales-search-accounts",
  name: "Search Accounts",
  description: "Search accounts by company name using `contains(name, …)`. [See the documentation](https://learn.microsoft.com/en-us/power-apps/developer/data-platform/webapi/query/filter-rows)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoft,
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Substring to match against account name (for example `Acme`)",
    },
  },
  async run({ $ }) {
    const data = await this.microsoft.searchAccountsByName({
      $,
      searchTerm: this.searchTerm,
    });

    const count = data?.value?.length ?? 0;
    $.export("$summary", `Found ${count} account${count === 1
      ? ""
      : "s"}`);

    return data;
  },
};
