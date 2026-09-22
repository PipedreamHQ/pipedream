import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-touch-id-options",
  name: "List Touch ID Options",
  description: "Retrieves available options for the Touch ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendoso,
  },
  async run({ $ }) {
    const options = await sendoso.propDefinitions.touchId.options.call(this.sendoso);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
