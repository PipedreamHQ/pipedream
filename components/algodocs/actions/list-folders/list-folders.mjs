import app from "../../algodocs.app.mjs";

export default {
  key: "algodocs-list-folders",
  name: "List Folders",
  description:
    "Lists all folders in the authenticated AlgoDocs account (GET /v1/folders). Each folder includes at least `id` and `name`. Use this to discover a valid `folderId` before running **Upload File**. [See the documentation](https://api.algodocs.com/).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    algodocs: app,
  },
  async run({ $ }) {
    const folders = await this.algodocs.listFolders({
      $,
    });
    const items = Array.isArray(folders)
      ? folders
      : (folders?.data ?? []);
    $.export("$summary", `Retrieved ${items.length} folder(s)`);
    return items;
  },
};
