import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-list-workers",
  name: "List Workers",
  description: "Get all workers for the team. [See the documentation](https://docs.usebrainbase.com/api-reference/workers/get-all-workers-for-the-team)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listWorkers({
      $,
    });

    $.export(
      "$summary",
      `Successfully retrieved ${response?.length || 0} worker(s)`,
    );
    return response;
  },
};
