import utils from "../../common/utils.mjs";
import app from "../../trengo.app.mjs";

export default {
  key: "trengo-list-labels",
  name: "List Labels",
  description: "List all labels. [See the documentation](https://developers.trengo.com/reference/list-all-labels)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of labels to return (if not specified, all results will be returned)",
      optional: true,
    },
  },
  async run({ $ }) {
    const labels = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.listLabels,
      resourceFnArgs: {
        $,
      },
    });
    for await (const item of resourcesStream) {
      labels.push(item);
      if (this.maxResults && labels.length >= this.maxResults) {
        break;
      }
    }
    const length = labels.length;
    $.export("$summary", `Successfully retrieved ${length} label${length === 1
      ? ""
      : "s"}`);
    return labels;
  },
};
