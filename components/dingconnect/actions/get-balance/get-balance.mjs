import app from "../../dingconnect.app.mjs";

export default {
  key: "dingconnect-get-balance",
  name: "Get Balance",
  description: "Get the current agent balance from DingConnect. [See the documentation](https://www.dingconnect.com/api#operation/getbalance)",
  version: "0.0.2",
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
    const response = await this.app.getBalance({
      $,
    });

    $.export("$summary", "Successfully retrieved the current agent balance");

    return response;
  },
};
