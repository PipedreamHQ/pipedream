import app from "../../lightspeed_ecom_c_series.app.mjs";

export default {
  key: "lightspeed_ecom_c_series-find-invoice",
  name: "Find Invoice",
  description: "Find an invoice by ID. [See the documentation](https://developers.lightspeedhq.com/ecom/endpoints/invoice/#get-all-invoices)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      description: "Retrieve all invoices from a specific customer based on the customerid",
      optional: true,
    },
    orderNumber: {
      propDefinition: [
        app,
        "orderNumber",
      ],
      description: "Retrieve an order based on the order number",
      optional: true,
    },
    invoiceNumber: {
      propDefinition: [
        app,
        "invoiceNumber",
      ],
      description: "Retrieve an invoice based on the invoice number",
      optional: true,
    },
    sinceId: {
      type: "string",
      label: "Since ID",
      description: "Restrict results to after the specified ID",
      optional: true,
    },
    createdAtMin: {
      propDefinition: [
        app,
        "createdAtMin",
      ],
      description: "Show invoices created after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    createdAtMax: {
      propDefinition: [
        app,
        "createdAtMax",
      ],
      description: "Show invoices created before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMin: {
      propDefinition: [
        app,
        "updatedAtMin",
      ],
      description: "Show invoices last updated after date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
    updatedAtMax: {
      propDefinition: [
        app,
        "updatedAtMax",
      ],
      description: "Show invoices last updated before date. **Format: `YYYY-MM-DD HH:MM:SS`**",
    },
  },
  async run({ $ }) {
    const response = this.app.paginate({
      fn: this.app.listInvoice,
      $,
      params: {
        customer: this.customerId,
        number: this.invoiceNumber,
        order: this.orderNumber,
        since_id: this.sinceId,
        created_at_min: this.createdAtMin,
        created_at_max: this.createdAtMax,
        updated_at_min: this.updatedAtMin,
        updated_at_max: this.updatedAtMax,
      },
      dataField: "invoices",
    });

    const invoices = [];
    for await (const invoice of response) {
      invoices.push(invoice);
    }

    $.export("$summary", `Successfully found ${invoices.length} invoice${invoices.length === 1
      ? ""
      : "s"}`);
    return invoices;
  },
};
