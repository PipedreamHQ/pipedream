import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-bank-accounts",
  name: "Get Bank Accounts",
  description: "Retrieves a list of bank accounts. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getBankAccounts({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} bank accounts`);
    return response;
  },
};
