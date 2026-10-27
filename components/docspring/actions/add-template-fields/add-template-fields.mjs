import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-add-template-fields",
  name: "Add Template Fields",
  description: "Add fields to a template's draft. Each field is a JSON object of field settings (`name`, `page`, `x`, `y`, `width`, `height`, `type` and others);"
    + " settings left out have their defaults, and a field named like existing fields shares their settings."
    + " Returns all of the template's fields. Use **List Template Fields** to see existing fields' settings, and **Publish Template Version** to publish the change."
    + " [See the documentation](https://docspring.com/docs/api/#tag/templates/post/templates/{template_id}/fields)",
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
      description: "The fields to add. Each item is a JSON object of field settings,"
        + " e.g. `{\"name\": \"email\", \"page\": 1, \"x\": 100, \"y\": 300, \"width\": 600, \"height\": 80, \"type\": \"email\", \"required\": true}`."
        + " One item can also be a JSON array of fields.",
    },
  },
  async run({ $ }) {
    const fields = utils.parseObjectArray(this.fields, "Fields");
    if (!fields) {
      throw new ConfigurationError("Add at least one field, e.g. `{\"name\": \"email\", \"page\": 1, \"type\": \"email\"}`");
    }
    const result = await this.docspring.addTemplateFields({
      $,
      templateId: this.templateId,
      data: {
        fields,
      },
    });
    $.export("$summary", `Added ${fields.length} field(s) to template ${result.template_id}`);
    return result;
  },
};
