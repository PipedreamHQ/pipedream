import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-account-balances",
  name: "Get Account Balances",
  description: "Retrieves account balances by date. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    date: {
      type: "string",
      label: "Date",
      description: "Date in format yyyy-MM-dd",
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getAccountBalances({
      date: this.date,
      $,
    });
    $.export("$summary", `Successfully retrieved account balances for ${this.date}`);
    return response;
  },
};
