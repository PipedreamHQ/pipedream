// x-pd-ai: optimized
import app from "../../dappier.app.mjs";
import { resolveDateRange } from "../../common/utils.mjs";

export default {
  key: "dappier-get-sponsored-conversations-analytics",
  name: "Get Sponsored Conversations Analytics",
  description: "Retrieve aggregated sponsored-conversation (ad campaign) analytics (GET `/v1/analytics/sponsored-conversations`). Returns a `summary` (impressions, queries, sessions, clicks, conversion rate) plus `daily_breakdown`, `campaign_breakdown`, `prompt_breakdown`, and `click_type_breakdown`. All filters are optional; with no dates it defaults to the last 7 days (UTC). Example: call with no arguments for the last-7-days rollup, or pass `campaignId=cp_...` with `startDate`/`endDate` to scope one campaign to a window. [See the documentation](https://docs.dappier.com/api-reference/endpoint/sponsored-conversations-analytics).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Filter by campaign ID (e.g. `cp_...`). Optional - omit to include all campaigns. The Dappier API exposes no listing endpoint; find campaign IDs in the Dappier platform at https://platform.dappier.com.",
      optional: true,
    },
    agentId: {
      type: "string",
      label: "Agent ID",
      description: "Filter by AI model / agent ID (e.g. `am_...`). Optional - omit to include all agents. The Dappier API exposes no listing endpoint; find agent IDs in the Dappier platform at https://platform.dappier.com.",
      optional: true,
    },
    placementId: {
      propDefinition: [
        app,
        "placementId",
      ],
    },
    promptId: {
      type: "string",
      label: "Prompt ID",
      description: "Filter by prompt ID (e.g. `pm_...`). Optional - omit to include all prompts.",
      optional: true,
    },
    creativeId: {
      propDefinition: [
        app,
        "creativeId",
      ],
    },
    lineItemId: {
      propDefinition: [
        app,
        "lineItemId",
      ],
    },
    publisherId: {
      propDefinition: [
        app,
        "publisherId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSponsoredConversationsAnalytics({
      $,
      params: {
        ...resolveDateRange(this.startDate, this.endDate),
        campaign_id: this.campaignId,
        agent_id: this.agentId,
        placement_id: this.placementId,
        prompt_id: this.promptId,
        creative_id: this.creativeId,
        line_item_id: this.lineItemId,
        publisher_id: this.publisherId,
      },
    });
    $.export("$summary", "Successfully retrieved sponsored conversations analytics");
    return response;
  },
};
