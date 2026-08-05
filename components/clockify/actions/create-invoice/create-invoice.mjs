// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice for a client in a Clockify workspace. Note: Clockify's public API only supports invoice metadata (client, dates, currency, status, note) — there is no endpoint to add line items or import tracked time automatically, so use **List Time Entries** or **Get Time Entry Report** to look up the hours to bill and summarize them in the Note field. [See the documentation](https://docs.clockify.me/#tag/Invoice)",
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
    clientId: {
      propDefinition: [
        clockify,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the invoice. Example: `Invoice 1`",
      optional: true,
    },
    number: {
      type: "string",
      label: "Number",
      description: "Invoice number. Example: `INV-001`",
      optional: true,
    },
    issueDate: {
      type: "string",
      label: "Issue Date",
      description: "Issue date of the invoice, in `YYYY-MM-DD` format. Example: `2024-01-15`",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Due date of the invoice, in `YYYY-MM-DD` format. Example: `2024-02-15`",
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of the invoice. Example: `USD`",
      optional: true,
    },
    taxId: {
      type: "string",
      label: "Tax ID",
      description: "Tax identifier for the invoice",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note to include on the invoice, e.g. a summary of the billing period or hours covered",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the invoice",
      optional: true,
      options: [
        "DRAFT",
        "SENT",
        "VIEWED",
        "PAID",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.clockify.createInvoice({
      $,
      workspaceId: this.workspaceId,
      data: {
        clientId: this.clientId,
        name: this.name,
        number: this.number,
        issueDate: this.issueDate,
        dueDate: this.dueDate,
        currency: this.currency,
        taxId: this.taxId,
        note: this.note,
        status: this.status,
      },
    });

    $.export("$summary", `Successfully created invoice with ID ${response.id}`);

    return response;
  },
};
