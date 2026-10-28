import harvest from "../../harvest.app.mjs";

export default {
  key: "harvest-get-invoice",
  name: "Get Invoice",
  description: "Retrieve a single invoice by ID. Use **List Invoices** to find a valid ID. Example: call with invoiceId set to a known invoice's ID to check its amount and payment state. [See the documentation](https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/#retrieve-an-invoice).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    harvest,
    accountId: {
      propDefinition: [
        harvest,
        "accountId",
      ],
    },
    invoiceId: {
      propDefinition: [
        harvest,
        "invoiceId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.harvest.getInvoice({
      $,
      invoiceId: this.invoiceId,
      accountId: this.accountId,
    });
    $.export("$summary", `Successfully retrieved invoice ${response.id}`);
    return response;
  },
};
