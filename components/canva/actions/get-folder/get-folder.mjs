// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-get-folder",
  name: "Get Folder",
  description: "Retrieve folder metadata (id, name, thumbnail, timestamps) via GET /folders/{folderId}. [See the documentation](https://www.canva.dev/docs/connect/api-reference/folders/get-folder/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.canva.getFolder({
      $,
      folderId: this.folderId,
    });
    $.export("$summary", `Successfully retrieved folder "${response.folder?.name ?? this.folderId}"`);
    return response;
  },
};
