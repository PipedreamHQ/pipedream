import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-update-application-status",
  name: "Update Application Status",
  description: "Update the status of an application. Not every status returned by **List Status ID Options** is a valid transition from the application's current status — an \"Invalid status\" error means the target stage isn't reachable from here; check the application's current status and try an adjacent stage. [See the documentation](https://documentation.bamboohr.com/reference/update-applicant-status)",
  version: "0.0.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    bamboohr,
    applicationId: {
      propDefinition: [
        bamboohr,
        "applicationId",
      ],
    },
    statusId: {
      propDefinition: [
        bamboohr,
        "statusId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bamboohr.updateApplicationStatus({
      $,
      applicationId: this.applicationId,
      data: {
        status: this.statusId,
      },
    });
    $.export("$summary", "Updated status of application.");
    return response;
  },
};
