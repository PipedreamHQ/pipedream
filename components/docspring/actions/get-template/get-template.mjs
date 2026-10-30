import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-get-template",
  name: "Get Template",
  description: "Get a template's settings, its PDF (`document`, with `page_count` and links) or HTML, its conditional logic and its published versions."
    + " `ready` says whether it can generate PDFs yet. Use **List Template Fields** for its fields and **Find Templates** to find a template by name."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/get/templates/{template_id})",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const template = await this.docspring.getTemplate({
      $,
      templateId: this.templateId,
    });
    $.export("$summary", `Got template ${template.id}: ${template.name}`);
    return template;
  },
};
