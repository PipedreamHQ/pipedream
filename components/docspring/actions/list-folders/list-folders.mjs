import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-list-folders",
  name: "List Folders",
  description: "List the account's template folders, with each one's `id`, `name`, `path` and `parent_folder_id`: every folder at any depth, or the folders in one folder."
    + " Use the IDs with **Find Templates**, **Create Template**, **Move Template** and **Create Folder**."
    + " [See the documentation](https://docspring.com/docs/api/#tag/folders/get/folders)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    docspring,
    parentFolderId: {
      propDefinition: [
        docspring,
        "folderId",
      ],
      label: "Parent Folder",
      description: "Only list the folders in this folder, e.g. `fld_1234567890abcdef01`. Leave blank to list every folder, at any depth.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        docspring,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const pages = this.docspring.paginate({
      fn: this.docspring.listFolders,
      args: {
        $,
        params: utils.compact({
          parent_folder_id: this.parentFolderId,
        }),
      },
      max: utils.maxResults(this.maxResults),
    });
    const folders = [];
    for await (const folder of pages) {
      folders.push(folder);
    }
    $.export("$summary", `Found ${folders.length} folder(s)`);
    return folders;
  },
};
