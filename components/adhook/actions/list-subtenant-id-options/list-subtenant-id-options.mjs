import adhook from "../../adhook.app.mjs";

export default {
  key: "adhook-list-subtenant-id-options",
  name: "List Subtenant Id Options",
  description: "Retrieves available options for the Subtenant Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    adhook,
  },
  async run({ $ }) {
    const options = await adhook.propDefinitions.subtenantId.options.call(this.adhook);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
