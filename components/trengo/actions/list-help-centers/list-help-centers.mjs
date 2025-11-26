import utils from "../../common/utils.mjs";
import app from "../../trengo.app.mjs";

export default {
  type: "action",
  key: "trengo-list-help-centers",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "List Help Centers",
  description: "List all help centers. [See the documentation](https://developers.trengo.com/reference/list-all-help-centers)",
  props: {
    app,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of help centers to return (if not specified, all results will be returned)",
      optional: true,
    },
  },
  async run({ $ }) {
    const helpCenters = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getHelpCenters,
      resourceFnArgs: {},
    });
    for await (const item of resourcesStream) {
      helpCenters.push(item);
      if (this.maxResults && helpCenters.length >= this.maxResults) {
        break;
      }
    }
    const length = helpCenters.length;
    $.export("$summary", `Successfully retrieved ${length} help center${length === 1
      ? ""
      : "s"}`);
    return helpCenters;
  },
};
