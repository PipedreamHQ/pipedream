import pidj from "../../pidj.app.mjs";

export default {
  key: "pidj-list-group-id-options",
  name: "List Group Id Options",
  description: "Retrieves available options for the Group Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pidj,
  },
  async run({ $ }) {
    const options = await pidj.propDefinitions.groupId.options.call(this.pidj);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
