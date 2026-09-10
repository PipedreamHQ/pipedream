import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Get Comments",
  description: "Fetches all comments on a Box file, paginating through every page and returning the full list. Use **Add Comment** to create a new comment on the file. [See the documentation](https://developer.box.com/reference/get-files-id-comments/).",
  key: "box-get-comments",
  version: "0.0.9",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Parent Folder",
      description: "The parent folder of the file. Use `0` for the root folder. Use the **List Folders** action to retrieve folder IDs.",
    },
    fileId: {
      propDefinition: [
        app,
        "fileId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
      label: "File ID",
      description: "The file to get comments from (e.g. `123456789`). Use the **List Folder Items** action to retrieve file IDs.",
    },
  },
  async run({ $ }) {
    const results = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getComments,
      resourceFnArgs: {
        $,
        fileId: this.fileId,
      },
    });
    for await (const resource of resourcesStream) {
      results.push(resource);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", results.length ? `Successfully fetched ${results.length} comment${results.length === 1 ? "" : "s"}.` : "No comments found.");
    return results;
  },
};
