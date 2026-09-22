import coinbase_developer_platform from "../../coinbase_developer_platform.app.mjs";

export default {
  key: "coinbase_developer_platform-list-network-id-options",
  name: "List Network ID Options",
  description: "Retrieves available options for the Network ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    coinbase_developer_platform,
  },
  async run({ $ }) {
    const options = await coinbase_developer_platform.propDefinitions.networkId.options
      .call(this.coinbase_developer_platform);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
