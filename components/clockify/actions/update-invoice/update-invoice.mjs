// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-update-invoice",
  name: "Update Invoice",
  description: "Updates the metadata of an existing invoice in a Clockify workspace. Clockify's update endpoint replaces the entire invoice, so this action first fetches the current invoice and merges your changes into it before saving — fields you don't set are left unchanged. Use **List Invoices** to find the ID of the invoice to update. [See the documentation](https://docs.clockify.me/#tag/Invoice/operation/updateInvoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    invoiceId: {
      propDefinition: [
        clockify,
        "invoiceId",
      ],
    },
    clientId: {
      propDefinition: [
        clockify,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    number: {
      type: "string",
      label: "Number",
      description: "New invoice number. Example: `INV-001`",
      optional: true,
    },
    issuedDate: {
      type: "string",
      label: "Issue Date",
      description: "New issue date of the invoice, in ISO 8601 format. Example: `2026-08-05T00:00:00Z`",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "New due date of the invoice, in ISO 8601 format. Example: `2026-09-05T00:00:00Z`",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "New currency of the invoice. Example: `USD`",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "New note for the invoice",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "New status of the invoice",
      optional: true,
      options: [
        "DRAFT",
        "SENT",
        "VIEWED",
        "PARTIALLY_PAID",
        "PAID",
        "CANCELLED",
      ],
    },
  },
  async run({ $ }) {
    if (!this.clientId
      && !this.number
      && !this.issuedDate
      && !this.dueDate
      && !this.currency
      && !this.note
      && !this.status) {
      throw new ConfigurationError("Set at least one field to update.");
    }

    const invoice = await this.clockify.getInvoice({
      $,
      workspaceId: this.workspaceId,
      invoiceId: this.invoiceId,
    });

    const response = await this.clockify.updateInvoice({
      $,
      workspaceId: this.workspaceId,
      invoiceId: this.invoiceId,
      data: {
        client: this.clientId
          ? {
            id: this.clientId,
          }
          : invoice.client,
        number: this.number || invoice.invoiceNumber,
        issuedDate: this.issuedDate || invoice.issuedDate || invoice.issueDate,
        dueDate: this.dueDate || invoice.dueDate,
        currency: this.currency || invoice.currency,
        note: this.note || invoice.note,
        status: this.status || invoice.status,
      },
    });

    $.export("$summary", `Successfully updated invoice with ID ${this.invoiceId}`);

    return response;
  },
};
