import agiled from "../../agiled.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "agiled-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Agiled. [See the documentation](https://my.agiled.app/developers)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    agiled,
    client: {
      propDefinition: [
        agiled,
        "client",
      ],
    },
    invoiceNumber: {
      propDefinition: [
        agiled,
        "invoiceNumber",
      ],
    },
    amount: {
      propDefinition: [
        agiled,
        "amount",
      ],
    },
    dueDate: {
      propDefinition: [
        agiled,
        "dueDate",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
    items: {
      propDefinition: [
        agiled,
        "items",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
    notes: {
      propDefinition: [
        agiled,
        "notes",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const requestBody = {
      client: this.client,
      invoice_number: this.invoiceNumber,
      total: this.amount,
      due_date: this.dueDate,
      items: this.items
        ? this.items.map(JSON.parse)
        : [],
      notes: this.notes,
    };

    const response = await this.agiled.createInvoice(requestBody);

    $.export("$summary", `Successfully created invoice ${this.invoiceNumber}`);
    return response;
  },
};
