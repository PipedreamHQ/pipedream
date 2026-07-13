import nutshell from "../../nutshell.app.mjs";

export default {
  key: "nutshell-list-industry-id-options",
  name: "List Industry Id Options",
  description: "Retrieves available options for the Industry Id field.",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nutshell,
  },
  async run({ $ }) {
    const options = await nutshell.propDefinitions.industryId.options.call(this.nutshell);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
