import puppetflow from "../../puppetflow.app.mjs";

export default {
  key: "puppetflow-list-runs",
  name: "List Runs",
  description: "List the runs of a Puppetflow flow, most recent first, optionally filtered by status."
    + " Returns each run's `id`, `status`, `output`, `error_message`, `duration_ms` and timestamps."
    + " Use **List Flows** to find the flow ID, and **Get Run** to load the full details of a single run."
    + " [See the documentation](https://docs.puppetflow.com/reference/api/runs#list-runs)",
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
    flowId: {
      propDefinition: [
        puppetflow,
        "flowId",
      ],
    },
    status: {
      propDefinition: [
        puppetflow,
        "status",
      ],
    },
    maxResults: {
      propDefinition: [
        puppetflow,
        "maxResults",
      ],
      description: "The maximum number of runs to return across all pages, e.g. `50`. Defaults to `50`.",
    },
  },
  async run({ $ }) {
    const runs = [];
    const items = this.puppetflow.paginate({
      fn: this.puppetflow.listRuns,
      args: {
        $,
        flowId: this.flowId,
        params: {
          status: this.status,
        },
      },
      max: this.maxResults,
    });
    for await (const run of items) {
      runs.push(run);
    }

    $.export("$summary", `Found ${runs.length} run${runs.length === 1
      ? ""
      : "s"} for flow ${this.flowId}`);
    return runs;
  },
};
