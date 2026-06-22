import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-search-leads",
  name: "Search Leads",
  description: "Search leads in Nutshell. Returns records in the existing lead output format. [See the documentation](https://developers.nutshell.com/reference/132e65861bebcb3781c3d37e66aff309)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    nutshell,
    query: {
      propDefinition: [
        nutshell,
        "query",
      ],
    },
    limit: {
      propDefinition: [
        nutshell,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      ...(this.query
        ? {
          q: this.query,
        }
        : {}),
      ...(this.limit
        ? {
          "page[limit]": this.limit,
        }
        : {}),
    };
    const leads = await this.nutshell.listLeads({
      $,
      params,
    });

    $.export("$summary", `Found ${leads.length} lead(s)`);
    return leads.map((l) => this.nutshell.formatSearchLeadResult(l));
  },
};
