import app from "../../avosms.app.mjs";

export default {
  name: "Get Balance",
  description: "Get the available account balance. [See the documentation](https://www.avosms.com/en/api/documentation/compte/balance)",
  key: "avosms-get-balance",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getBalance({
      $,
    });

    $.export("$summary", `Successfully retrieved account balance: ${response.balance}`);

    return response;
  },
};
