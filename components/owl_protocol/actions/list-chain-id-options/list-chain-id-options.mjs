import owl_protocol from "../../owl_protocol.app.mjs";

export default {
  key: "owl_protocol-list-chain-id-options",
  name: "List Chain ID Options",
  description: "Retrieves available options for the Chain ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    owl_protocol,
  },
  async run({ $ }) {
    const options = await owl_protocol.propDefinitions.chainId.options.call(this.owl_protocol);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
