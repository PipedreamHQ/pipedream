// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "clockify-update-invoice",
  name: "Update Invoice",
  description: "Updates an existing invoice in a Clockify workspace. Clockify's update endpoint replaces the entire invoice, so this action first fetches the current invoice and merges your changes into it — fields you don't set are left unchanged, including the invoice's tax and discount percentages, which this action preserves but cannot edit. `Status` is applied through a separate endpoint, so it is sent as a second request after the field changes are saved, and setting it alone skips the replace entirely. Clockify offers no transaction across the two endpoints: if the status request fails, the field changes have already been applied. Line items and imported time cannot be set through Clockify's public API. Use **List Invoices** to find the ID of the invoice to update. [See the documentation](https://docs.clockify.me/#tag/Invoice/operation/updateInvoice) and the [status endpoint](https://docs.clockify.me/#tag/Invoice/operation/changeInvoiceStatus)",
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
      propDefinition: [
        clockify,
        "invoiceNumber",
      ],
      description: "New invoice number. Example: `INV-001`",
      optional: true,
    },
    issuedDate: {
      propDefinition: [
        clockify,
        "issuedDate",
      ],
      description: "New issue date of the invoice, in ISO 8601 format. Example: `2026-08-05T00:00:00Z`",
      optional: true,
    },
    dueDate: {
      propDefinition: [
        clockify,
        "dueDate",
      ],
      description: "New due date of the invoice, in ISO 8601 format. Example: `2026-09-05T00:00:00Z`",
      optional: true,
    },
    currency: {
      propDefinition: [
        clockify,
        "currency",
      ],
      description: "New currency of the invoice. Example: `USD`",
      optional: true,
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "New subject line for the invoice. Example: `Consulting services, August 2026`",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "New note for the invoice, e.g. a summary of the billing period or hours covered. Set to an empty string to clear the existing note",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "New status of the invoice. Clockify applies this through a dedicated status endpoint rather than the update endpoint, so it is sent as a separate request after the other field changes are saved. If it fails, those field changes have already been applied",
      optional: true,
      options: constants.INVOICE_STATUS_OPTIONS,
    },
  },
  async run({ $ }) {
    const hasInvoiceFields = this.clientId !== undefined
      || this.number !== undefined
      || this.issuedDate !== undefined
      || this.dueDate !== undefined
      || this.currency !== undefined
      || this.subject !== undefined
      || this.note !== undefined;

    if (!hasInvoiceFields && this.status === undefined) {
      throw new ConfigurationError("Set at least one field to update: Client, Number, Issue Date, Due Date, Currency, Subject, Note, or Status.");
    }

    let response;

    if (hasInvoiceFields) {
      const invoice = await this.clockify.getInvoice({
        $,
        workspaceId: this.workspaceId,
        invoiceId: this.invoiceId,
      });

      response = await this.clockify.updateInvoice({
        $,
        workspaceId: this.workspaceId,
        invoiceId: this.invoiceId,
        data: {
          clientId: this.clientId ?? invoice.clientId,
          number: this.number ?? invoice.number,
          issuedDate: this.issuedDate ?? invoice.issuedDate,
          dueDate: this.dueDate ?? invoice.dueDate,
          currency: this.currency ?? invoice.currency,
          subject: this.subject ?? invoice.subject,
          note: this.note ?? invoice.note,
          discountPercent: utils.toPercent(invoice.discount),
          taxPercent: utils.toPercent(invoice.tax),
          tax2Percent: utils.toPercent(invoice.tax2),
          companyId: invoice.companyId,
          taxType: invoice.taxType?.value ?? invoice.taxType,
          visibleZeroFields: invoice.visibleZeroFields,
        },
      });
    }

    if (this.status !== undefined) {
      await this.clockify.updateInvoiceStatus({
        $,
        workspaceId: this.workspaceId,
        invoiceId: this.invoiceId,
        data: {
          invoiceStatus: this.status,
        },
      });

      // The status endpoint returns no body, so re-fetch to always return the current invoice
      response = await this.clockify.getInvoice({
        $,
        workspaceId: this.workspaceId,
        invoiceId: this.invoiceId,
      });
    }

    $.export("$summary", `Successfully updated invoice with ID ${this.invoiceId}`);

    return response;
  },
};
