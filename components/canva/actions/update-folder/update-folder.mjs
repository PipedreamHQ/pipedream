// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-update-folder",
  name: "Update Folder",
  description: "Rename a folder via PATCH /folders/{folderId}. [See the documentation](https://www.canva.dev/docs/connect/api-reference/folders/update-folder/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    folderId: {
      propDefinition: [
        canva,
        "folderId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "New folder name (max 255 characters).",
    },
  },
  async run({ $ }) {
    const response = await this.canva.updateFolder({
      $,
      folderId: this.folderId,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `Successfully renamed folder "${this.folderId}" to "${this.name}"`);
    return response;
  },
};
