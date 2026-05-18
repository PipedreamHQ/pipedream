import close from "../../close.app.mjs";

export default {
  key: "close-list-status-id-options",
  name: "List Status ID Options",
  description: "Retrieves available options for the Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    close,
  },
  async run({ $ }) {
    const options = await close.propDefinitions.statusId.options.call(this.close);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
