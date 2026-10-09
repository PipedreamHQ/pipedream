import firma from "../../firma.app.mjs";

export default {
  key: "firma-get-template",
  name: "Get Template",
  description: "Retrieves details of a specific template. [See the documentation](https://docs.firma.dev/api-reference/templates/get-template)",
  version: "0.0.1",
  type: "action",
  props: {
    firma,
    templateId: {
      propDefinition: [
        firma,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.firma.getTemplate({
      $,
      templateId: this.templateId,
    });
    $.export("$summary", `Successfully retrieved template "${response.name || this.templateId}"`);
    return response;
  },
};
