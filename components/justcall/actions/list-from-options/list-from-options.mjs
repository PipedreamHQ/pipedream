import justcall from "../../justcall.app.mjs";

export default {
  key: "justcall-list-from-options",
  name: "List From Options",
  description: "Retrieves available options for the From field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    justcall,
  },
  async run({ $ }) {
    const options = await justcall.propDefinitions.from.options.call(this.justcall);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
