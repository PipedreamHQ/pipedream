// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";

export default {
  key: "mixpanel_service_account-list-saved-cohorts",
  name: "List Saved Cohorts",
  description: "List the cohorts saved in this Mixpanel project, with each cohort's ID, name, description, and current member count. [See the documentation](https://docs.mixpanel.com/reference/cohorts-list)",
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
    const response = await this.app.listSavedCohorts({
      $,
      params: {
        workspace_id: this.workspaceId,
      },
    });

    $.export("$summary", `Found ${response.length} saved cohort${response.length === 1
      ? ""
      : "s"}`);

    return response;
  },
};
