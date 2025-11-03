import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Get Comments",
  description: "Fetches comments for a file. [See the documentation](https://developer.box.com/reference/get-files-id-comments/).",
  key: "box-get-comments",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    folderId: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Parent Folder",
      description: "Use this option to select your File ID from a dropdown list.",
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
      description: "The file ID to get comments from. Use a custom expression to reference a file from your workflow or select it from the dropdown list.",
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
