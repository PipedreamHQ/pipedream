import venly from "../../venly.app.mjs";

export default {
  key: "venly-list-chain-options",
  name: "List Blockchain Options",
  description: "Retrieves available options for the Blockchain field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    venly,
  },
  async run({ $ }) {
    const options = await venly.propDefinitions.chain.options.call(this.venly);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
