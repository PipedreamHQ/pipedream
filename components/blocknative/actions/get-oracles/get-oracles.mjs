import app from "../../blocknative.app.mjs";

export default {
  key: "blocknative-get-oracles",
  name: "Get Oracles",
  description: "Get a list of supported oracles. [See the documentation](https://docs.blocknative.com/gas-prediction/gas-platform-2)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getOracles({
      $,
    });
    $.export("$summary", "Successfully retrieved " + response.length + " results");
    return response;
  },
};
