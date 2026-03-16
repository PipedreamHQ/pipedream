import app from "../../templatedocs.app.mjs";

export default {
  key: "templatedocs-delete-template",
  name: "Delete Template",
  description: "Permanently delete a template. This action cannot be undone. [See the documentation](https://templatedocs.io/docs/api/templates/delete)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
    await this.app.deleteTemplate({
      $,
      templateId: this.templateId,
    });

    $.export("$summary", `Successfully deleted template with ID: ${this.templateId}`);
    return {
      id: this.templateId,
      deleted: true,
    };
  },
};
