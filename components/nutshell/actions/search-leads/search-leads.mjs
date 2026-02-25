import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-search-leads",
  name: "Search Leads",
  description: "Search leads by string. Returns formatted results: id, description, status, completion, value, primaryCompanyName, primaryContactName, isOverdue, lastContactDate, dueTime. [See the documentation](https://developers-rpc.nutshell.com/detail/class_core.html#a9e841c85b13b24f819f10bca0df837c3)",
  version: "0.0.3",
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
      description: "The string to search for (matches lead names, descriptions, etc.).",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of leads to return.",
      default: 1000,
      optional: true,
    },
  },
  async run({ $ }) {
    const leads = await this.nutshell.searchLeads({
      $,
      string: this.searchString,
      limit: this.limit ?? 1000,
    });
    $.export("$summary", `Found ${leads.length} lead(s)`);
    return leads;
  },
};
