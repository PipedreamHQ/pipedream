import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-remove-template-fields",
  name: "Remove Template Fields",
  description: "Remove fields from a template's draft. Returns the template's remaining fields."
    + " Use **List Template Fields** to find the fields' IDs, and **Publish Template Version** to publish the change."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/post/templates/{template_id}/fields/remove)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
    fieldIds: {
      propDefinition: [
        docspring,
        "fieldIds",
        (c) => ({
          templateId: c.templateId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const fieldIds = (utils.parseStringArray(this.fieldIds) || [])
      .map((id) => utils.toInteger(id, "Field ID"));
    if (!fieldIds.length) {
      throw new ConfigurationError("Choose at least one field to remove, e.g. `12`");
    }
    const result = await this.docspring.removeTemplateFields({
      $,
      templateId: this.templateId,
      data: {
        field_ids: fieldIds,
      },
    });
    $.export("$summary", `Removed ${fieldIds.length} field(s) from template ${result.template_id}`);
    return result;
  },
};
