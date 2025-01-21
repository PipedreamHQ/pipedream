import invoice_ninja from "../../invoice_ninja.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "invoice_ninja-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    invoice_ninja: {
      type: "app",
      app: "invoice_ninja",
    },
    clientId: {
      propDefinition: [
        invoice_ninja,
        "clientId",
      ],
    },
    userId: {
      propDefinition: [
        invoice_ninja,
        "userId",
      ],
      optional: true,
    },
    assignedUserId: {
      propDefinition: [
        invoice_ninja,
        "assignedUserId",
      ],
      optional: true,
    },
    statusId: {
      propDefinition: [
        invoice_ninja,
        "statusId",
      ],
      optional: true,
    },
    number: {
      propDefinition: [
        invoice_ninja,
        "number",
      ],
      optional: true,
    },
    poNumber: {
      propDefinition: [
        invoice_ninja,
        "poNumber",
      ],
      optional: true,
    },
    terms: {
      propDefinition: [
        invoice_ninja,
        "terms",
      ],
      optional: true,
    },
    publicNotes: {
      propDefinition: [
        invoice_ninja,
        "publicNotes",
      ],
      optional: true,
    },
    privateNotes: {
      propDefinition: [
        invoice_ninja,
        "privateNotes",
      ],
      optional: true,
    },
    footer: {
      propDefinition: [
        invoice_ninja,
        "footer",
      ],
      optional: true,
    },
    customValue1: {
      propDefinition: [
        invoice_ninja,
        "customValue1",
      ],
      optional: true,
    },
    customValue2: {
      propDefinition: [
        invoice_ninja,
        "customValue2",
      ],
      optional: true,
    },
    customValue3: {
      propDefinition: [
        invoice_ninja,
        "customValue3",
      ],
      optional: true,
    },
    customValue4: {
      propDefinition: [
        invoice_ninja,
        "customValue4",
      ],
      optional: true,
    },
    totalTaxes: {
      propDefinition: [
        invoice_ninja,
        "totalTaxes",
      ],
      optional: true,
    },
    lineItems: {
      propDefinition: [
        invoice_ninja,
        "lineItems",
      ],
      optional: true,
    },
    amount: {
      propDefinition: [
        invoice_ninja,
        "amount",
      ],
      optional: true,
    },
    balance: {
      propDefinition: [
        invoice_ninja,
        "balance",
      ],
      optional: true,
    },
    paidToDate: {
      propDefinition: [
        invoice_ninja,
        "paidToDate",
      ],
      optional: true,
    },
    discount: {
      propDefinition: [
        invoice_ninja,
        "discount",
      ],
      optional: true,
    },
    date: {
      propDefinition: [
        invoice_ninja,
        "date",
      ],
      optional: true,
    },
    dueDate: {
      propDefinition: [
        invoice_ninja,
        "dueDate",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const invoice = await this.invoice_ninja.createNewInvoice();
    $.export("$summary", `Created invoice with ID: ${invoice.id}`);
    return invoice;
  },
};
