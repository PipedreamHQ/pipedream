import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-list-fiscalyears",
  name: "List Fiscal Years",
  description: "Retrieves a list of fiscal years. [See the documentation](https://developer.vismaonline.com)",
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
    const response = await this.app.listFiscalYears({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} fiscal years`);
    return response;
  },
};
