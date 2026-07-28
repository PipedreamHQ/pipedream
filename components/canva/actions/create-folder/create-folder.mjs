// x-pd-ai: optimized
import canva from "../../canva.app.mjs";

export default {
  key: "canva-create-folder",
  name: "Create Folder",
  description: "Create a new folder via POST /folders. Optionally nest it under a parent folder. [See the documentation](https://www.canva.dev/docs/connect/api-reference/folders/create-folder/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    canva,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new folder (max 255 characters).",
    },
    parentFolderId: {
      type: "string",
      label: "Parent Folder ID",
      description: "Parent folder ID. Use the special values `root` (top level) or `uploads`, or a custom folder ID (max 50 chars). Defaults to `root`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.canva.createFolder({
      $,
      data: {
        name: this.name,
        parent_folder_id: this.parentFolderId ?? "root",
      },
    });
    $.export("$summary", `Successfully created folder "${response.folder?.name ?? this.name}" (ID: ${response.folder?.id})`);
    return response;
  },
};
