// x-pd-ai: optimized
import app from "../../dappier.app.mjs";
import { resolveDateRange } from "../../common/utils.mjs";

export default {
  key: "dappier-get-ask-ai-analytics",
  name: "Get Ask AI Analytics",
  description: "Retrieve aggregated Ask AI widget analytics (GET `/v1/analytics/ask-ai`). Returns a `summary` (widget loads, viewable/engagement sessions, clicks, session duration, etc.) plus a `daily_breakdown`. All filters are optional; with no dates it defaults to the last 7 days (UTC). Use **Get Ask AI Logs** for the raw per-conversation rows behind these numbers. Example: call with no arguments to get the last-7-days summary, or pass `start_date=2026-07-01` and `end_date=2026-08-01` for a fixed window. [See the documentation](https://docs.dappier.com/api-reference/endpoint/ask-ai-analytics).",
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
    widgetId: {
      propDefinition: [
        app,
        "widgetId",
      ],
    },
    placementId: {
      propDefinition: [
        app,
        "placementId",
      ],
    },
    deploymentType: {
      propDefinition: [
        app,
        "deploymentType",
      ],
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
    const response = await this.app.getAskAiAnalytics({
      $,
      params: {
        ...resolveDateRange(this.startDate, this.endDate),
        widget_id: this.widgetId,
        placement_id: this.placementId,
        deployment_type: this.deploymentType,
        creative_id: this.creativeId,
        line_item_id: this.lineItemId,
        publisher_id: this.publisherId,
      },
    });
    $.export("$summary", "Successfully retrieved Ask AI analytics");
    return response;
  },
};
