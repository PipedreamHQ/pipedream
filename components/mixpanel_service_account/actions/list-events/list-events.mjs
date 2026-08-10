// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "mixpanel_service_account-list-events",
  name: "List Events",
  description: "List the names of the events tracked in this Mixpanel project over the last 31 days, ordered by how often they were fired. Start here when you do not already know the exact event name a question refers to - most other tools need an exact, case-sensitive name. [See the documentation](https://docs.mixpanel.com/reference/query-months-top-event-names)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    analysisType: {
      type: "string",
      label: "Analysis Type",
      description: "How events are counted when ranking them.",
      options: constants.ANALYSIS_TYPES,
      default: "general",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `The maximum number of event names to return. Defaults to ${constants.DEFAULT_TOP_VALUES_LIMIT}.`,
      min: 1,
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listEvents({
      $,
      params: {
        type: this.analysisType,
        limit: this.limit,
        workspace_id: this.workspaceId,
      },
    });

    $.export("$summary", `Found ${response.length} event${response.length === 1
      ? ""
      : "s"} tracked in the last 31 days`);

    return response;
  },
};
