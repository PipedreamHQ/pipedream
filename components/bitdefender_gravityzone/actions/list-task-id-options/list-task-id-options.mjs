import bitdefender_gravityzone from "../../bitdefender_gravityzone.app.mjs";

export default {
  key: "bitdefender_gravityzone-list-task-id-options",
  name: "List Task ID Options",
  description: "Retrieves available options for the Task ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bitdefender_gravityzone,
  },
  async run({ $ }) {
    const results = [];
    let page = 0;
    while (true) {
      const options = await bitdefender_gravityzone.propDefinitions.taskId.options
        .call(this.bitdefender_gravityzone, {
          page,
        });
      if (!options?.length) break;
      results.push(...options);
      page++;
    }
    $.export("$summary", `Successfully retrieved ${results.length} option${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
