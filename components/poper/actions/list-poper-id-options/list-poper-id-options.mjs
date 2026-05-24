import poper from "../../poper.app.mjs";

export default {
  key: "poper-list-poper-id-options",
  name: "List Poper ID Options",
  description: "Retrieves available options for the Poper ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    poper,
  },
  async run({ $ }) {
    const options = await poper.propDefinitions.poperId.options.call(this.poper);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
