// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-delete-folder",
  name: "Delete Folder",
  description: "Permanently delete a folder via DELETE /folders/{folderId}. This is irreversible. [See the documentation](https://www.canva.dev/docs/connect/api-reference/folders/delete-folder/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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
  },
  async run({ $ }) {
    const response = await this.canva.deleteFolder({
      $,
      folderId: this.folderId,
    });
    $.export("$summary", `Successfully deleted folder "${this.folderId}"`);
    return response;
  },
};
