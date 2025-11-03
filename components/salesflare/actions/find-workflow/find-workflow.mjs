import app from "../../salesflare.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "salesflare-find-workflow",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Find Workflow",
  description: "Finds workflows according to props configured, if no prop configured returns all workflows, [See the docs here](https://api.salesflare.com/docs#operation/getWorkflows)",
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
  },
  async run ({ $ }) {
    const items = [];
    const params = utils.extractProps(this, {});
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getWorkflows,
      resourceFnArgs: {
        $,
        params,
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} workflow${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
