// x-pd-ai: optimized
import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-folder-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available folders so callers can copy an ID into another action's free-form folderId prop. [See the documentation](https://developers.wrike.com/reference/getfolders)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    wrike,
  },
  async run({ $ }) {
    const folders = await this.wrike.listFolders({
      $,
    });
    // Exclude Recycle Bin folders (scope: "RbFolder") — operations on them fail with HTTP 400.
    const options = folders
      .filter((folder) => folder.scope !== "RbFolder")
      .map((folder) => ({
        label: folder.title,
        value: folder.id,
      }));
    $.export("$summary", `Successfully retrieved ${options.length} folder${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
