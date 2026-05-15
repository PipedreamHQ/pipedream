import blocknative from "../../blocknative.app.mjs";

export default {
  key: "blocknative-list-chainid-options",
  name: "List chainid Options",
  description: "Retrieves available options for the chainid field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    blocknative,
  },
  async run({ $ }) {
    const options = await blocknative.propDefinitions.chainid.options.call(this.blocknative);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
