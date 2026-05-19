import textlocal from "../../textlocal.app.mjs";

export default {
  key: "textlocal-list-group-id-options",
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
    textlocal,
  },
  async run({ $ }) {
    const options = await textlocal.propDefinitions.groupId.options.call(this.textlocal);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
