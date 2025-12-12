import app from "../../fortnox.app.mjs";

export default {
  key: "fortnox-list-financial-years",
  name: "List Financial Years",
  description: "Retrieve a list of financial years. [See the documentation](https://api.fortnox.se/apidocs#tag/fortnox_FinancialYears/operation/getByDate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    date: {
      type: "string",
      label: "Date",
      description: "The date to retrieve the financial years for in **YYYY-MM-DD** format",
      optional: true,
    },
  },
  async run({ $ }) {
    const { FinancialYears } = await this.app.listFinancialYears({
      $,
      params: {
        Date: this.date,
      },
    });

    $.export("$summary", `Successfully retrieved ${FinancialYears.length} financial year${FinancialYears.length === 1
      ? ""
      : "s"}`);
    return FinancialYears;
  },
};
