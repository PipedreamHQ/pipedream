import app from "../../templated.app.mjs";

export default {
  key: "templated-get-template",
  name: "Get Template",
  description: "Retrieves a single template object referenced by its unique ID. [See the documentation](https://app.templated.io/docs#retrieve-template)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
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
      id: this.templateId,
    });
    $.export("$summary", `Successfully retrieved template with ID: ${this.templateId}`);
    return response;
  },
};
