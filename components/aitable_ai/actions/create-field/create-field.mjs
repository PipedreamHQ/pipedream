import app from "../../aitable_ai.app.mjs";

export default {
  key: "aitable_ai-create-field",
  name: "Create Field",
  description: "Create a new field in the specified datasheet. [See the documentation](https://developers.aitable.ai/api/reference#tag/Field/operation/create-fields)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
    type: {
      propDefinition: [
        app,
        "type",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Name of the Field",
    },
  },

  async run({ $ }) {
    const response = await this.app.createField({
      $,
      spaceId: this.spaceId,
      data: {
        type: this.type,
        name: this.name,
      },
    });
    $.export("$summary", `Successfully sent request to create field. Result: '${response.message}'`);
    return response;
  },
};
