import app from "../../dappier.app.mjs";
import {
  INTERACTION_TYPES,
  LOGS_LIMIT_MAX,
  LOGS_LIMIT_MIN,
} from "../../common/constants.mjs";
import { resolveDateRange } from "../../common/utils.mjs";

export default {
  key: "dappier-get-ask-ai-logs",
  name: "Get Ask AI Logs",
  description: "Retrieve raw Ask AI conversation logs (GET `/v1/analytics/ask-ai/logs`). Returns a `data` array of individual conversation rows (timestamp, prompt, response, widget, referring URL, interaction type) sorted newest-first, plus `count` and `total_pages` for pagination. All filters are optional; with no dates it defaults to the last 7 days (UTC). This is the row-level detail behind **Get Ask AI Analytics**. If `total_pages` in the response is greater than 1, call again with an incremented `page` to fetch the remaining rows. Example: `limit=5` returns the 5 most recent conversations for the last 7 days; add `page=2` to get the next 5. [See the documentation](https://docs.dappier.com/api-reference/endpoint/ask-ai-logs).",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    interactionType: {
      type: "string",
      label: "Interaction Type",
      description: "Filter to a single interaction type. Optional - omit to include all types.",
      options: INTERACTION_TYPES,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "1-based page number for pagination. Increment to page through results (see `total_pages` in the response). Defaults to 1.",
      min: 1,
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Number of conversation rows per page. Min ${LOGS_LIMIT_MIN}, max ${LOGS_LIMIT_MAX}. Defaults to 50.`,
      min: LOGS_LIMIT_MIN,
      max: LOGS_LIMIT_MAX,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getAskAiLogs({
      $,
      params: {
        ...resolveDateRange(this.startDate, this.endDate),
        widget_id: this.widgetId,
        placement_id: this.placementId,
        deployment_type: this.deploymentType,
        interaction_type: this.interactionType,
        page: this.page,
        limit: this.limit,
      },
    });
    const count = response?.data?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} Ask AI log row${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
