import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-list-template-fields",
  name: "List Template Fields",
  description: "List a template's fields with all their settings: `id`, `name` (the key of its value in submission data), `type`, `page`, position, `required` and conditional logic."
    + " Use the names for **Generate PDF** data and **Create Signature Request** signers, and the IDs for **Update Template Fields** and **Remove Template Fields**."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/get/templates/{template_id}/fields)",
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
    templateVersion: {
      propDefinition: [
        docspring,
        "templateVersion",
      ],
      description: "The template version: a published version such as `1.2.0` (or `1` for the latest 1.x.x), `latest` or `draft`, e.g. `latest`."
        + " Leave blank for the draft.",
    },
  },
  async run({ $ }) {
    const result = await this.docspring.listTemplateFields({
      $,
      templateId: this.templateId,
      params: utils.compact({
        version: this.templateVersion,
      }),
    });
    $.export("$summary", `Found ${result.fields.length} field(s) in template ${result.template_id}`);
    return result;
  },
};
