import googleWorkspace from "../../app/google_workspace.app";

export default {
  key: "google_workspace-list-activities-by-admin",
  name: "List Activities By Admin",
  description: "Retrieves a report of all Admin console activities done by a specific administrator. [See the docs](https://developers.google.com/admin-sdk/reports/v1/guides/manage-audit-admin#get_admin_events) for more information",
  version: "0.0.1",
  type: "action",
  props: {
    googleWorkspace,
    applicationName: {
      propDefinition: [
        googleWorkspace,
        "applicationName",
      ],
    },
    userKey: {
      propDefinition: [
        googleWorkspace,
        "userKey",
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
    eventName: {
      propDefinition: [
        googleWorkspace,
        "eventName",
      ],
    },
  },
  async run({ $ }) {
    const {
      userKey,
      applicationName,
      endTime,
      startTime,
      maxResults,
      filters,
      eventName,
    } = this;

    const { items: activities } =
      await this.googleWorkspace.listAdminActivities({
        userKey,
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
};
