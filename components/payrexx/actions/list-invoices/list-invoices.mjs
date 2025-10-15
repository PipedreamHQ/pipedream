import payrexx from "../../payrexx.app.mjs";

export default {
  key: "payrexx-list-invoices",
  name: "List Invoices",
  description: "List all invoices for a merchant. [See the documentation](https://payrexxserviceapi.readme.io/reference/list-all-invoices)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    payrexx,
  },
  async run({ $ }) {
    const response = await this.payrexx.listInvoices({
      $,
    });

    $.export("$summary", `Successfully fetched ${response.data?.length} invoices`);

    return response;
  },
};
