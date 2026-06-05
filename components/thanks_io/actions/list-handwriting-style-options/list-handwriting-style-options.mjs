import thanks_io from "../../thanks_io.app.mjs";

export default {
  key: "thanks_io-list-handwriting-style-options",
  name: "List Handwriting Style Options",
  description: "Retrieves available options for the Handwriting Style field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    thanks_io,
  },
  async run({ $ }) {
    const options = await thanks_io.propDefinitions.handwritingStyle.options.call(this.thanks_io);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
