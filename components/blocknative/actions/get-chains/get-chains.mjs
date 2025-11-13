import app from "../../blocknative.app.mjs";

export default {
  key: "blocknative-get-chains",
  name: "Get Chains",
  description: "Get a list of supported chains. [See the documentation](https://docs.blocknative.com/gas-prediction/gas-platform-1)",
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
    const response = await this.app.getChains({
      $,
    });
    $.export("$summary", "Successfully retrieved " + response.length + " chains");
    return response;
  },
};
