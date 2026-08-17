// x-pd-ai: optimized
import givebutter from "../../givebutter.app.mjs";
import { MAX_PER_PAGE } from "../common/constants.mjs";

export default {
  key: "givebutter-list-campaigns",
  name: "List Campaigns",
  description: "List campaigns from the authenticated Givebutter account. Returns a paginated array of campaign objects (each includes at minimum `id`, `code`, and `title`). Use this to discover campaign IDs before referencing a campaign in other tools. [See the documentation](https://docs.givebutter.com/api-reference/campaigns/list-all-campaigns)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    givebutter,
    scope: {
      type: "string",
      label: "Scope",
      description: "Optional scope filter passed to the Givebutter API (e.g. to narrow which campaigns are returned).",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "1-indexed page number for offset-based pagination (Givebutter default: 1). Use with **List Campaigns** repeatedly to page through results.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of campaigns to return per page (maps to \`per_page\`). Must be between 1 and ${MAX_PER_PAGE} (the Givebutter API caps \`per_page\` at ${MAX_PER_PAGE}). Defaults to the API default of 20 if omitted.`,
      min: 1,
      max: MAX_PER_PAGE,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.givebutter.listCampaigns({
      $,
      params: {
        scope: this.scope,
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
