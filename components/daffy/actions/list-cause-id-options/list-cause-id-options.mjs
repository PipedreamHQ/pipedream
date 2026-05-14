import daffy from "../../daffy.app.mjs";

export default {
  key: "daffy-list-cause-id-options",
  name: "List Cause Options",
  description: "Retrieves available options for the Cause field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    daffy,
  },
  async run({ $ }) {
    const options = await daffy.propDefinitions.causeId.options.call(this.daffy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
