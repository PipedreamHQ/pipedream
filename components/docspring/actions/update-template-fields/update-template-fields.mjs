import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-update-template-fields",
  name: "Update Template Fields",
  description: "Change the settings of fields in a template's draft. Each change is a JSON object with the field's `id` and the settings to change; settings left out keep their values."
    + " Changing a shared setting changes it for every field with the same name. Returns all of the template's fields."
    + " Use **List Template Fields** to find the fields' IDs, and **Publish Template Version** to publish the change."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/put/templates/{template_id}/fields)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The changes. Each item is a JSON object with the field's `id` and the settings to change,"
        + " e.g. `{\"id\": 12, \"required\": false, \"font_size\": 9}` or `{\"id\": 15, \"name\": \"tenant_email\"}`. One item can also be a JSON array of changes.",
    },
  },
  async run({ $ }) {
    const fields = utils.parseObjectArray(this.fields, "Fields");
    if (!fields) {
      throw new ConfigurationError("Add at least one change, e.g. `{\"id\": 12, \"required\": false}`");
    }
    fields.forEach((field, index) => {
      if (utils.isBlank(field.id)) {
        throw new ConfigurationError(`Field change ${index + 1} needs the field's \`id\`. Use **List Template Fields** to find it.`);
      }
    });
    const result = await this.docspring.updateTemplateFields({
      $,
      templateId: this.templateId,
      data: {
        fields: fields.map((field) => ({
          ...field,
          id: utils.toInteger(field.id, "Field ID"),
        })),
      },
    });
    $.export("$summary", `Updated ${fields.length} field(s) in template ${result.template_id}`);
    return result;
  },
};
