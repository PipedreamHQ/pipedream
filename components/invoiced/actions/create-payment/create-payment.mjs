import { parseObject } from "../../common/utils.mjs";
import invoiced from "../../invoiced.app.mjs";

export default {
  key: "invoiced-create-payment",
  name: "Create Payment",
  description: "Creates a new payment in Invoiced. [See the documentation](https://developer.invoiced.com/api/payments#create-a-payment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    invoiced,
    customerId: {
      propDefinition: [
        invoiced,
        "customerId",
      ],
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Payment datetime, defaults to current timestamp. Format YYYY-MM-DDTHH:MM:SSZ.",
      optional: true,
    },
    method: {
      type: "string",
      label: "Payment Method",
      description: "Payment instrument used, defaults to **other**",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "[3-letter ISO code](https://en.wikipedia.org/wiki/ISO_4217)",
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Payment amount. Example: 100.00",
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Reference number, i.e. check #",
      optional: true,
    },
    achSenderId: {
      type: "string",
      label: "ACH Sender ID",
      description: "Originator ID (ACH payments)",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source of the payment, defaults to **keyed**",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Internal notes",
      optional: true,
    },
    appliedTo: {
      type: "string[]",
      label: "Applied To",
      description: "JSON array of payment applications. Each application should have: type (invoice, credit_note, etc.), invoice (or credit_note ID), amount. Example: [{\"type\":\"invoice\",\"invoice\":\"44648\",\"amount\":800}] [See the documentation](https://developer.invoiced.com/api/payments#payment-object) for more details.",
      optional: true,
    },

  },
  async run({ $ }) {
    const response = await this.invoiced.createPayment({
      $,
      data: {
        customer: this.customerId,
        date: this.date && Date.parse(this.date),
        method: this.method,
        currency: this.currency,
        amount: this.amount && parseFloat(this.amount),
        reference: this.reference,
        ach_sender_id: this.achSenderId,
        source: this.source,
        notes: this.notes,
        applied_to: parseObject(this.appliedTo),
      },
    });

    $.export("$summary", `Successfully created payment with ID ${response.id} for amount $${response.amount}`);
    return response;
  },
};

