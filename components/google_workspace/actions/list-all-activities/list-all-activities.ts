import googleWorkspace from "../../app/google_workspace.app";

export default {
  key: "google_workspace-list-all-activities",
  name: "List All Activities",
  description: "Retrieve a report of all administrative activities done for an account,. [See the docs](https://developers.google.com/admin-sdk/reports/v1/guides/manage-audit-admin#get_account_events) for more information",
  version: "0.0.5",
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
    eventName: {
      propDefinition: [
        googleWorkspace,
        "eventName",
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

    const {
      items: activities,
      ...other
    } = await this.googleWorkspace.listActivities({
      userKey: "all",
      applicationName,
      endTime,
      startTime,
      maxResults,
      filters,
      eventName,
    });

    console.log("other", other);

    $.export("$summary", `Successfully listed ${activities.length} activities.`);

    return activities;
  },
};
