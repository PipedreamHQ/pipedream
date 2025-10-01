import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-application",
  name: "Get Application",
  description: "Get the details of an application. [See the documentation](https://documentation.bamboohr.com/reference/get-application-details-1)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.bamboohr.getApplication({
      $,
      applicationId: this.applicationId,
    });
    $.export("$summary", `Found application ${this.applicationId}`);
    return response;
  },
};
