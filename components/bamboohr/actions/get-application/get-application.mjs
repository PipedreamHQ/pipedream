import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-get-application",
  name: "Get Application",
  description: "Get an application by its application ID. Use **List Applications** to find the application ID before retrieving the full application details. [See the documentation](https://documentation.bamboohr.com/reference/get-application-details)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
