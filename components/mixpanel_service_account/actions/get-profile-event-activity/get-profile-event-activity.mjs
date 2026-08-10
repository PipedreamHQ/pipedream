// x-pd-ai: optimized
import app from "../../mixpanel_service_account.app.mjs";

export default {
  key: "mixpanel_service_account-get-profile-event-activity",
  name: "Get Profile Event Activity",
  description: "Get the chronological event feed for one or more specific users - what they did, when, and with which event properties. This is the \"what has this user been doing?\" tool. Requires exact `distinct_id` values; it cannot search by email. [See the documentation](https://docs.mixpanel.com/reference/activity-stream-query)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    distinctIds: {
      propDefinition: [
        app,
        "distinctIds",
      ],
    },
    fromDate: {
      propDefinition: [
        app,
        "fromDate",
      ],
    },
    toDate: {
      propDefinition: [
        app,
        "toDate",
      ],
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getProfileEventActivity({
      $,
      params: {
        distinct_ids: JSON.stringify(this.distinctIds),
        from_date: this.fromDate,
        to_date: this.toDate,
        workspace_id: this.workspaceId,
      },
    });

    const events = response.results?.events ?? [];
    $.export("$summary", `Found ${events.length} event${events.length === 1
      ? ""
      : "s"} for ${this.distinctIds.length} profile${this.distinctIds.length === 1
      ? ""
      : "s"} from ${this.fromDate} to ${this.toDate}`);

    return response;
  },
};
