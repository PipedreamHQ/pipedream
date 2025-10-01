import app from "../../wave.app.mjs";

export default {
  type: "action",
  key: "wave-create-invoice",
  name: "Create Invoice",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create an invoice for a customer with one product. [See the documentation](https://developer.waveapps.com/hc/en-us/articles/360038817812-Mutation-Create-invoice)",
  props: {
    app,
    businessId: {
      propDefinition: [
        app,
        "businessId",
      ],
      description: "The ID of the business to create the invoice for.",
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
        (c) => ({
          businessId: c.businessId,
        }),
      ],
      description: "The ID of the customer to create the invoice for.",
    },
    productsId: {
      propDefinition: [
        app,
        "productsId",
        (c) => ({
          businessId: c.businessId,
        }),
      ],
      description: "The ID of the product to create the invoice for.",
    },
  },
  async run({ $ }) {
    const res = await this.app.createInvoice(
      this.businessId,
      this.customerId,
      this.productsId,
    );
    if (!res.data.invoiceCreate?.invoice?.id) {
      throw new Error(`Failed to create invoice: ${JSON.stringify(res)}`);
    }
    $.export("summary", `Invoice successfully created with id "${res.data.invoiceCreate.invoice.id}"`);
    return res;
  },
};
