import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-account-balance-by-account-number",
  name: "Get Account Balance by Account Number",
  description: "Retrieves account balance by account number and date. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    accountNumber: {
      type: "integer",
      label: "Account Number",
      description: "The account number",
    },
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
    const response = await this.app.getAccountBalanceByAccountNumber({
      accountNumber: this.accountNumber,
      date: this.date,
      $,
    });
    $.export("$summary", `Successfully retrieved account balance for account ${this.accountNumber} on ${this.date}`);
    return response;
  },
};
