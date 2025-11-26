import utils from "../../common/utils.mjs";
import app from "../../trengo.app.mjs";

export default {
  key: "trengo-list-all-blocks",
  name: "List All Blocks",
  description: "List all blocks in a help center. [See the documentation](https://developers.trengo.com/reference/list-all-blocks)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    helpCenterId: {
      propDefinition: [
        app,
        "helpCenterId",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of blocks to return (if not specified, all results will be returned)",
      optional: true,
    },
  },
  async run({ $ }) {
    const blocks = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.listBlocks,
      resourceFnArgs: {
        helpCenterId: this.helpCenterId,
      },
    });
    for await (const item of resourcesStream) {
      blocks.push(item);
      if (this.maxResults && blocks.length >= this.maxResults) {
        break;
      }
    }
    const length = blocks.length;
    $.export("$summary", `Successfully retrieved ${length} block${length === 1
      ? ""
      : "s"}`);
    return blocks;
  },
};
