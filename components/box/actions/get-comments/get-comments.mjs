import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Get Comments",
  description: "Fetches comments for a file. [See the documentation](https://developer.box.com/reference/get-files-id-comments/).",
  key: "box-get-comments",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fileId: {
      type: "integer",
      label: "File ID",
      description: "The file ID to get comments from. Use a custom expression to reference a file from your workflow",
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
