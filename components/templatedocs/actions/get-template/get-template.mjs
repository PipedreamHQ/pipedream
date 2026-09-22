import app from "../../templatedocs.app.mjs";

export default {
  key: "templatedocs-get-template",
  name: "Get Template",
  description: "Retrieve the details of a specific template, including its name, file size, and placeholder tags. [See the documentation](https://templatedocs.io/docs/api/templates/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    templateId: {
      propDefinition: [
        app,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getTemplate({
      $,
      templateId: this.templateId,
    });

    $.export("$summary", `Successfully retrieved template "${response.name}"`);
    return response;
  },
};
