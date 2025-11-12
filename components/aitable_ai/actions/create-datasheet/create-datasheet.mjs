import app from "../../aitable_ai.app.mjs";

export default {
  key: "aitable_ai-create-datasheet",
  name: "Create Datasheet",
  description: "Create a datasheet in the specified space. [See the documentation](https://developers.aitable.ai/api/reference#tag/Datasheet/operation/create-datasheets)",
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
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createDatasheet({
      $,
      spaceId: this.spaceId,
      data: {
        name: this.name,
        description: this.description,
        folderId: this.folderId,
      },
    });
    $.export("$summary", `Successfully created Datasheet with ID '${response.data.id}'`);
    return response;
  },
};
