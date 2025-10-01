import app from "../../quipu.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quipu-create-income-ticket",
  name: "Create Income Ticket",
  description: "Creates a new income ticket. [See the docs](http://quipuapp.github.io/api-v1-docs/#creating-a-ticket).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    recipientName: {
      type: "string",
      label: "Recipient Name",
      description: "The recipient name for the ticket.",
    },
    number: {
      propDefinition: [
        app,
        "number",
      ],
    },
    issued: {
      propDefinition: [
        app,
        "issued",
      ],
    },
    paidAt: {
      propDefinition: [
        app,
        "paidAt",
      ],
    },
    paymentMethod: {
      propDefinition: [
        app,
        "paymentMethod",
      ],
    },
    items: {
      propDefinition: [
        app,
        "items",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
      optional: true,
    },
    accountingCategory: {
      propDefinition: [
        app,
        "accountingCategory",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const attributes = {
      "kind": "income",
      "recipient_name": this.recipientName,
      "number": this.number,
      "issue_date": this.issued,
      "paid_at": this.paidAt,
      "payment_method": this.paymentMethod,
      "tags": (this.tags && this.tags.join(", ")) || undefined,
    };
    const relationships = {};
    if (this.accountingCategory) {
      relationships.accounting_category = {
        "data": {
          "id": this.accountingCategory,
          "type": "accounting_categories",
        },
      };
    }
    if (this.items) {
      let items = this.items;
      if (typeof (this.items) === "string") {
        items = JSON.parse(items);
      }
      if (!Array.isArray(items)) {
        throw new ConfigurationError("Items must to be an array.");
      }
      relationships.items = {
        "data": items,
      };
    }
    const ticket = await this.app.createTicket($, attributes, relationships);
    $.export("$summary", `Successfully created ticket with ID "${ticket.id}"`);
    return ticket;
  },
};
