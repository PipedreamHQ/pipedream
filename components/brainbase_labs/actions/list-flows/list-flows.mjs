import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase-list-flows",
  name: "List Flows",
  description: "Get all flows for a worker. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listFlows({
      $,
      workerId: this.workerId,
    });

    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} flow(s)`);
    return response;
  },
};

