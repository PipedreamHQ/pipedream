import moco from "../../moco.app.mjs";

export default {
  key: "moco-create-payment",
  name: "Create Payment",
  description: "Creates a new payment for an invoice. [See the documentation](https://everii-group.github.io/mocoapp-api-docs/sections/invoice_payments.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    moco,
    invoiceId: {
      propDefinition: [
        moco,
        "invoiceId",
      ],
      optional: true,
    },
    date: {
      type: "string",
      label: "Payment Date",
      description: "The date of the payment in format YYYY-MM-DD",
    },
    amount: {
      type: "integer",
      label: "Amount",
      description: "The amount of the payment in cents",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "The currency of the payment (e.g., USD, EUR)",
      optional: true,
      default: "USD",
    },
    partiallyPaid: {
      type: "boolean",
      label: "Partially Paid",
      description: "Whether the payment is partially paid",
      optional: true,
      default: false,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the payment",
    },
  },
  async run({ $ }) {
    const response = await this.moco.createInvoicePayment({
      $,
      data: {
        date: this.date,
        invoice_id: this.invoiceId,
        paid_total: this.amount,
        currency: this.currency,
        partially_paid: this.partiallyPaid,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully created payment with ID: ${response.id}`);
    return response;
  },
};
