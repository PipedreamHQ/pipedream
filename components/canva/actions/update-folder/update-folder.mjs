// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
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
      description: "New folder name. Valid names contain 1–255 characters.",
    },
  },
  async run({ $ }) {
    if (this.name.length < 1 || this.name.length > 255) {
      throw new ConfigurationError("Name must contain 1–255 characters.");
    }

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
