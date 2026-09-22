import canvas from "../../canvas.app.mjs";

export default {
  key: "canvas-list-account-id-options",
  name: "List Account ID Options",
  description: "Retrieves available options for the Account ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    canvas,
  },
  async run({ $ }) {
    const options = await canvas.propDefinitions.accountId.options.call(this.canvas);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
