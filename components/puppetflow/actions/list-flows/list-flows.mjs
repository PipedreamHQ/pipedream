import puppetflow from "../../puppetflow.app.mjs";
import { MAX_LIMIT } from "../../common/constants.mjs";

export default {
  key: "puppetflow-list-flows",
  name: "List Flows",
  description: "List the Puppetflow flows the connected API key can access, optionally filtered by text, type or folder."
    + " Returns each flow's `id`, `name`, `description`, `flow_type` and `default_inputs`."
    + " Use it to find the flow ID required by **Trigger Flow** and **List Runs**."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/flows#list-flows)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    puppetflow,
    search: {
      type: "string",
      label: "Search",
      description: "Text matched against the flow name, description or ID, e.g. `invoice`.",
      optional: true,
    },
    flowType: {
      propDefinition: [
        puppetflow,
        "flowType",
      ],
    },
    folderId: {
      propDefinition: [
        puppetflow,
        "folderId",
      ],
    },
    maxResults: {
      propDefinition: [
        puppetflow,
        "maxResults",
      ],
      description: `The maximum number of flows to return, from \`1\` to \`${MAX_LIMIT}\`, e.g. \`50\`. Defaults to \`50\`.`,
      max: MAX_LIMIT,
    },
  },
  async run({ $ }) {
    const flows = await this.puppetflow.listFlows({
      $,
      params: {
        search: this.search,
        type: this.flowType,
        folder_id: this.folderId,
        limit: this.maxResults,
      },
    });

    $.export("$summary", `Found ${flows.length} flow${flows.length === 1
      ? ""
      : "s"}`);
    return flows;
  },
};
