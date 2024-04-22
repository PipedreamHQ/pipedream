import chaser from "../../chaser.app.mjs";

export default {
  key: "chaser-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Chaser. [See the documentation](https://openapi.chaserhq.com/docs/static/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    chaser,
    customerDetails: {
      propDefinition: [
        chaser,
        "customerDetails",
      ],
    },
    associatedContactDetails: {
      propDefinition: [
        chaser,
        "associatedContactDetails",
        (c) => ({
          customerDetails: c.customerDetails,
        }),
      ],
      optional: true,
    },
    invoiceDetails: {
      propDefinition: [
        chaser,
        "invoiceDetails",
      ],
    },
    additionalInvoiceDetails: {
      propDefinition: [
        chaser,
        "additionalInvoiceDetails",
        (c) => ({
          invoiceDetails: c.invoiceDetails,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    // Create customer
    const customer = await this.chaser.createCustomer({
      customerDetails: this.customerDetails,
      associatedContactDetails: this.associatedContactDetails,
    });

    // Create invoice with optional additional details
    const invoice = await this.chaser.createInvoice({
      invoiceDetails: this.invoiceDetails,
      additionalInvoiceDetails: this.additionalInvoiceDetails,
    });

    $.export("$summary", `Successfully created invoice with ID ${invoice.id} for customer ${customer.name}`);
    return invoice;
  },
};
