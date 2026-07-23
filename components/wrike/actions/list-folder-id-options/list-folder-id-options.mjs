// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-folder-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available folders so callers can copy an ID into another action's free-form folderId prop. [See the documentation](https://developers.wrike.com/reference/getfoldersempty)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
    spaceId: {
      type: "string",
      label: "Space ID",
      description: "Filter by space ID.",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Filter by folder ID.",
      optional: true,
    },
  },
  async run({ $ }) {
    const folders = await this.wrike.listFolders({
      $,
      spaceId: this.spaceId,
      folderId: this.folderId,
    });
    $.export("$summary", `Successfully retrieved ${folders.length} folder${folders.length === 1
      ? ""
      : "s"}`);
    return folders;
  },
};
