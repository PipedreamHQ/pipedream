import dart from "../../dart.app.mjs";

export default {
  key: "dart-list-status-options",
  name: "List Status Options",
  description: "Retrieves available options for the Status field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dart,
  },
  async run({ $ }) {
    const options = await dart.propDefinitions.status.options.call(this.dart);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
