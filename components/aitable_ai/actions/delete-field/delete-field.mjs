import app from "../../aitable_ai.app.mjs";

export default {
  key: "aitable_ai-delete-field",
  name: "Delete Field",
  description: "Delete a field in the specified datasheet. [See the documentation](https://developers.aitable.ai/api/reference/#tag/Field/operation/delete-fields)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
      ],
    },
    fieldId: {
      propDefinition: [
        app,
        "fieldId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.deleteField({
      $,
      spaceId: this.spaceId,
      fieldId: this.fieldId,
    });
    $.export("$summary", `Successfully deleted the field with ID '${this.fieldId}'`);
    return response;
  },
};
