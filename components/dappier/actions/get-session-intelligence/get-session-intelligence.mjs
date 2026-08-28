// x-pd-ai: optimized
import app from "../../dappier.app.mjs";
import { resolveDateRange } from "../../common/utils.mjs";

export default {
  key: "dappier-get-session-intelligence",
  name: "Get Session Intelligence",
  description: "Retrieve session-intelligence analytics for Ask AI widgets (GET `/v1/analytics/session-intelligence`). Returns a `summary`, `engagement_time` stats, `intent_breakdown`, `top_queried_topics`, `category_distribution` (IAB categories), and a fixed 7-bucket `session_engagement_distribution` (query-depth). All filters are optional; with no dates it defaults to the last 7 days (UTC). Example: call with no arguments for last-7-days intent and topic breakdowns, or pass `widget_id=wd_92831` to scope to a single widget. [See the documentation](https://docs.dappier.com/api-reference/endpoint/session-intelligence).",
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
    const response = await this.app.getSessionIntelligence({
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
    $.export("$summary", "Successfully retrieved session intelligence analytics");
    return response;
  },
};
