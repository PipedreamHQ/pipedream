import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-list-fiscalyears-openingbalances",
  name: "List Fiscal Years Opening Balances",
  description: "Retrieves a list of fiscal years opening balances. [See the documentation](https://developer.vismaonline.com)",
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
    const response = await this.app.listFiscalYearsOpeningBalances({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} fiscal years opening balances`);
    return response;
  },
};
