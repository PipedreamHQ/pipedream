import options from "../../common/options.mjs";
import app from "../../jibble.app.mjs";

export default {
  name: "Create Time Tracking Report",
  description: "This is generic endpoint for getting time tracking reports. [See the documentation](https://docs.api.jibble.io/#3115af1a-24a6-4d19-a7e7-08d8c173bb85).",
  key: "jibble-create-time-tracking-report",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    from: {
      label: "From",
      type: "string",
      description: "The start date of the report. Format: YYYY-MM-DDTHH:mm:ssZ. Example: `2021-12-20T08:00:00.000Z`",
    },
    to: {
      label: "To",
      type: "string",
      description: "The end date of the report. Format: YYYY-MM-DDTHH:mm:ssZ. Example: `2021-12-20T08:00:00.000Z`",
    },
    groupBy: {
      label: "Group By",
      type: "string",
      description: "The field to group the report by.",
      options: options.GROUP_BY,
    },
    subGroupBy: {
      label: "Sub Group By",
      type: "string",
      description: "The field to sub group the report by.",
      options: options.SUB_GROUP_BY,
    },
    personIds: {
      propDefinition: [
        app,
        "personId",
      ],
      label: "Person IDs",
      type: "string[]",
      description: "The ID of the persons to create the report.",
      optional: true,
    },
    projectIds: {
      propDefinition: [
        app,
        "projectId",
      ],
      label: "Project IDs",
      type: "string[]",
      description: "The ID of the projects to create the report.",
      optional: true,
    },
    clientIds: {
      propDefinition: [
        app,
        "clientId",
      ],
      label: "Client IDs",
      type: "string[]",
      description: "The ID of the clients to create the report.",
      optional: true,
    },
    activityIds: {
      propDefinition: [
        app,
        "activityId",
      ],
      label: "Activity IDs",
      type: "string[]",
      description: "The ID of the activities to create the report.",
      optional: true,
    },
    groupIds: {
      propDefinition: [
        app,
        "groupId",
      ],
      label: "Group IDs",
      type: "string[]",
      description: "The ID of the groups to create the report.",
      optional: true,
    },
    locationIds: {
      propDefinition: [
        app,
        "locationId",
      ],
      label: "Location IDs",
      type: "string[]",
      description: "The ID of the locations to create the report.",
      optional: true,
    },
    scheduleIds: {
      propDefinition: [
        app,
        "scheduleId",
      ],
      label: "Schedule IDs",
      type: "string[]",
      description: "The ID of the schedules to create the report.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      ...data
    } = this;
    const res = await app.createTimeTrackingReport(data, $);
    $.export("summary", "Time tracking successfully created.");
    return res;
  },
};
