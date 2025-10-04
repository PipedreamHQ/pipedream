import app from "../../quipu.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "quipu-create-income-invoice",
  name: "Create Income Invoice",
  description: "Creates a new income invoice. [See the docs](http://quipuapp.github.io/api-v1-docs/#creating-an-invoice).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    client: {
      propDefinition: [
        app,
        "client",
      ],
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
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date of the invoice, ISO 8601 format. Example: `2019-07-26`.",
    },
    items: {
      propDefinition: [
        app,
        "items",
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
    paidAt: {
      propDefinition: [
        app,
        "paidAt",
      ],
      optional: true,
    },
    paymentMethod: {
      propDefinition: [
        app,
        "paymentMethod",
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
  },
  async run({ $ }) {
    const attributes = {
      "kind": "income",
      "number": this.number,
      "issue_date": this.issued,
      "due_date": this.dueDate,
      "paid_at": this.paidAt,
      "payment_method": this.paymentMethod,
      "tags": (this.tags && this.tags.join(", ")) || undefined,
    };
    const relationships = {
      "contact": {
        "data": {
          "id": this.client,
          "type": "contacts",
        },
      },
    };
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
    const invoice = await this.app.createInvoice($, attributes, relationships);
    $.export("$summary", `Successfully created invoice with ID "${invoice.id}"`);
    return invoice;
  },
};
