import wrike from "../../wrike.app.mjs";

export default {
  key: "wrike-list-folder-id-options",
  name: "List Folder ID Options",
  description: "Retrieves available folders so callers can copy an ID into another action's free-form folderId prop. [See the documentation](https://developers.wrike.com/reference/getfoldersempty)",
  version: "1.0.1",
  type: "action",
  ai: "optimized",
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
      params: !this.folderId
        ? {
          deleted: false,
        }
        : undefined,
    });
    // Server-side `deleted: false` only applies to the account-level list; when
    // `folderId` is provided the endpoint returns that folder's children as-is,
    // so a Recycle Bin parent would leak trashed folders. `scope` marks each
    // resource's zone — drop anything living under the RB.
    const filtered = folders.filter((f) => f.scope !== "RbFolder" && f.scope !== "RbRoot");
    $.export("$summary", `Successfully retrieved ${filtered.length} folder${filtered.length === 1
      ? ""
      : "s"}`);
    return filtered;
  },
};
