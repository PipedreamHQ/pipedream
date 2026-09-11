// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";

export default {
  key: "mixpanel_service_account-list-saved-funnels",
  name: "List Saved Funnels",
  description: "List the funnels saved in this Mixpanel project, returning each funnel's `funnel_id` and name. [See the documentation](https://docs.mixpanel.com/reference/funnels-list-saved)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listSavedFunnels({
      $,
      params: {
        workspace_id: this.workspaceId,
      },
    });

    $.export("$summary", `Found ${response.length} saved funnel${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
