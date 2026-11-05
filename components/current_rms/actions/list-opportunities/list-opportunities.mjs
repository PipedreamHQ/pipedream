import app from "../../current_rms.app.mjs";

const OPPORTUNITIES_MAX_PER_PAGE = 25;

export default {
  key: "current_rms-list-opportunities",
  name: "List Opportunities",
  description: "List opportunities in Current RMS, with their dates and charge totals. Returns active opportunities unless you set **Filter Mode**."
    + " Use **Get Opportunity** for line items, assets and participants, which this action does not return."
    + " [See the documentation](https://api.current-rms.com/doc#opportunities-opportunities-v2.1-releasing-june-15th-2026-get)",
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
    search: {
      propDefinition: [
        app,
        "search",
      ],
      description: "Search subject, description, number, member organization name or tags, e.g. `Conference`.",
    },
    filterMode: {
      type: "string",
      label: "Filter Mode",
      description: "Which opportunities to return, e.g. `orders`. Defaults to active opportunities.",
      options: [
        "live",
        "inactive",
        "all",
        "with_active_status",
        "needing_prep",
        "prepared",
        "needing_load",
        "enquiries",
        "drafts",
        "quotations",
        "orders",
        "invoiced",
        "not_invoiced",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const opportunities = await this.app.paginate({
      $,
      fn: this.app.listOpportunities,
      resourceKey: "opportunities",
      perPage: OPPORTUNITIES_MAX_PER_PAGE,
      maxResults: this.maxResults,
      params: {
        "filtermode": this.filterMode,
        "q[subject_or_description_or_number_or_member_name_or_tags_name_cont]": this.search,
      },
    });
    $.export("$summary", `Found ${opportunities.length} opportunit${opportunities.length === 1
      ? "y"
      : "ies"}`);
    return opportunities;
  },
};
