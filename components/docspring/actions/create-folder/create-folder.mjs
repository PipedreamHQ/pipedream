import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-create-folder",
  name: "Create Folder",
  description: "Create a folder for templates, at the root or in another folder. Returns the folder, with its `id` and `path`."
    + " Use **Move Template** or **Create Template** to put templates in it."
    + " [See the documentation](https://docspring.com/docs/api/#tag/folders/post/folders)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The folder's name, e.g. `Leases`. It can't contain `/`, and must be unique in its parent folder.",
    },
    parentFolderId: {
      propDefinition: [
        docspring,
        "folderId",
      ],
      label: "Parent Folder",
      description: "The folder to create it in, e.g. `fld_1234567890abcdef01`. Use **List Folders** to find it (the `id` field). Leave blank for the root folder.",
      optional: true,
    },
  },
  async run({ $ }) {
    const folder = await this.docspring.createFolder({
      $,
      data: utils.compact({
        name: this.name,
        parent_folder_id: this.parentFolderId,
      }),
    });
    $.export("$summary", `Created folder ${folder.id}: ${folder.path}`);
    return folder;
  },
};
