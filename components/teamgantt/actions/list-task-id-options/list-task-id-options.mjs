import { teamgantt } from "../../teamgantt.app.mjs";

export default {
  key: "teamgantt-list-task-id-options",
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
    teamgantt,
  },
  async run({ $ }) {
    const options = await teamgantt.propDefinitions.taskId.options.call(this.teamgantt, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
