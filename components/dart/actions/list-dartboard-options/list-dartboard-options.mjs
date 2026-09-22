import dart from "../../dart.app.mjs";

export default {
  key: "dart-list-dartboard-options",
  name: "List Dartboard Options",
  description: "Retrieves available options for the Dartboard field.",
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
    const options = await dart.propDefinitions.dartboard.options.call(this.dart);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
