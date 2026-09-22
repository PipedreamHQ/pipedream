import shortcut from "../../shortcut.app.mjs";

export default {
  key: "shortcut-list-workflow-state-id-options",
  name: "List Workflow State ID Options",
  description: "Retrieves available options for the Workflow State ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    shortcut,
  },
  async run({ $ }) {
    const options = await shortcut.propDefinitions.workflowStateId.options.call(this.shortcut);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
