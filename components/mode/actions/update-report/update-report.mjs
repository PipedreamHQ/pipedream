import app from "../../mode.app.mjs";

export default {
  key: "mode-update-report",
  name: "Update Report",
  description: "Update a report's name, description, or move it to a different space. Sent to the API as `{ report: { name, description, space_token } }`. Use **List Reports** to find the report token and **List Spaces** to find a destination space token. [See the documentation](https://mode.com/developer/api-reference/analytics/reports/#updateReport)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    reportToken: {
      propDefinition: [
        app,
        "reportToken",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "New name for the report.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "New description for the report.",
      optional: true,
    },
    spaceToken: {
      propDefinition: [
        app,
        "spaceToken",
      ],
      description: "The token of the space to move this report to. Run the **List Spaces** action to find available space tokens.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateReport({
      $,
      reportToken: this.reportToken,
      data: {
        report: {
          name: this.name,
          description: this.description,
          space_token: this.spaceToken,
        },
      },
    });
    $.export("$summary", `Successfully updated report "${response?.name ?? this.reportToken}"`);
    return response;
  },
};
