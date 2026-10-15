import givebutter from "../../givebutter.app.mjs";

export default {
  key: "givebutter-list-campaigns",
  name: "List Campaigns",
  description: "List campaigns from the authenticated Givebutter account. Returns a paginated array of campaign objects (each includes at minimum `id`, `code`, and `title`). Use this to discover campaign IDs before referencing a campaign in other tools. [See the documentation](https://docs.givebutter.com/api-reference/campaigns/list-all-campaigns)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    page: {
      propDefinition: [
        givebutter,
        "page",
      ],
    },
    limit: {
      propDefinition: [
        givebutter,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.givebutter.listCampaigns({
      $,
      params: {
        page: this.page,
        per_page: this.limit,
      },
    });
    const campaigns = response?.data ?? response;
    const count = Array.isArray(campaigns)
      ? campaigns.length
      : "unknown number of";
    $.export("$summary", `Retrieved ${count} campaign(s)`);
    return response;
  },
};
