import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-update-application-status",
  name: "Update Application Status",
  description: "Update the status of an application. [See the documentation](https://documentation.bamboohr.com/reference/post-applicant-status-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
