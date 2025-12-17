import { defineAction } from "@pipedream/types";
import googleWorkspace from "../../app/google_workspace.app";

export default defineAction({
  key: "google_workspace-list-activities-by-event-name",
  name: "List Activities By Event Name",
  description: "Retrieves a report of all activities for a specific event name. [See the docs](https://developers.google.com/admin-sdk/reports/v1/guides/manage-audit-admin#get_all_events) for more information",
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
    eventName: {
      propDefinition: [
        googleWorkspace,
        "eventName",
      ],
      optional: false,
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
      eventName,
    } = this;

    const { items: activities } =
      await this.googleWorkspace.listAdminActivities({
        userKey: "all",
        applicationName,
        endTime,
        startTime,
        maxResults,
        filters,
        eventName,
      });

    $.export("$summary", `Successfully listed ${activities.length} activities.`);

    return activities;
  },
});
