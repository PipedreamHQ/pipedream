import { defineAction } from "@pipedream/types";
import googleWorkspace from "../../app/google_workspace.app";

export default defineAction({
  key: "google_workspace-list-all-activities",
  name: "List All Activities",
  description: "Retrieves a report of all administrative activities done for an account. [See the docs](https://developers.google.com/admin-sdk/reports/v1/guides/manage-audit-admin#get_account_events) for more information",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    googleWorkspace,
    applicationName: {
      propDefinition: [
        googleWorkspace,
        "applicationName",
      ],
    },
    endTime: {
      propDefinition: [
        googleWorkspace,
        "endTime",
      ],
    },
    startTime: {
      propDefinition: [
        googleWorkspace,
        "startTime",
      ],
    },
    maxResults: {
      propDefinition: [
        googleWorkspace,
        "maxResults",
      ],
    },
    filters: {
      propDefinition: [
        googleWorkspace,
        "filters",
      ],
    },
  },
  async run({ $ }) {
    const {
      applicationName,
      endTime,
      startTime,
      maxResults,
      filters,
    } = this;

    const { items: activities } =
      await this.googleWorkspace.listAdminActivities({
        userKey: "all",
        applicationName,
        endTime,
        startTime,
        maxResults,
        filters,
      });

    $.export("$summary", `Successfully listed ${activities.length} activities.`);

    return activities;
  },
});
