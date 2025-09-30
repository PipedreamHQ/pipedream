import utopianLabs from "../../utopian_labs.app.mjs";

export default {
  key: "utopian_labs-get-run-status",
  name: "Get Run Status",
  description: "Retrieve the status of an initiated run. [See the documentation](https://docs.utopianlabs.ai/research#retrieve-research-run-status)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    utopianLabs,
    runId: {
      type: "string",
      label: "Run ID",
      description: "The ID of the run you want to retrieve the status for",
    },
  },
  async run({ $ }) {
    const response = await this.utopianLabs.getRunStatus(this.runId);
    $.export("$summary", `Successfully retrieved status for run ${this.runId}`);
    return response;
  },
};
