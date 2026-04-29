import virtualsms from "../../virtualsms.app.mjs";

export default {
  key: "virtualsms-get-balance",
  name: "Get Balance",
  description: "Retrieve the current account balance in USD. Useful for low-balance alerts or pre-flight checks before renting numbers. [See the documentation](https://virtualsms.io/docs/api-reference/introduction)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    virtualsms,
  },
  async run({ $ }) {
    const response = await this.virtualsms.getBalance({
      $,
    });
    const balance = response?.balance_usd ?? response?.balance;
    $.export("$summary", balance != null
      ? `Balance: $${balance}`
      : "Retrieved balance");
    return response;
  },
};
