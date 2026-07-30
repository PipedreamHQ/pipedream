import surecart from "../../surecart.app.mjs";

export default {
  key: "surecart-create-invoice",
  name: "Create Invoice",
  description: "Create a new invoice. [See the documentation](https://developer.surecart.com/api-reference/invoices/create)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    surecart,
    automaticCollection: {
      type: "boolean",
      label: "Automatic Collection",
      description: "Automatically charge the customer's default payment method when the invoice is due.",
      optional: true,
    },
    dueDate: {
      type: "integer",
      label: "Due Date (Unix timestamp)",
      description: "Payment due date as a Unix timestamp. Example: `1710000000`",
      optional: true,
    },
    issueDate: {
      type: "integer",
      label: "Issue Date (Unix timestamp)",
      description: "Invoice issue date as a Unix timestamp. Example: `1700000000`",
      optional: true,
    },
    footer: {
      type: "string",
      label: "Footer",
      description: "Footer text displayed on the invoice. Example: `Thank you for your business.`",
      optional: true,
    },
    memo: {
      type: "string",
      label: "Memo",
      description: "Internal memo or note for this invoice. Example: `Q1 subscription renewal`",
      optional: true,
    },
    notificationsEnabled: {
      type: "boolean",
      label: "Notifications Enabled",
      description: "Send email notifications to the customer about this invoice.",
      optional: true,
    },
    liveMode: {
      propDefinition: [
        surecart,
        "liveMode",
      ],
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional key-value metadata. Example: `{ \"po_number\": \"PO-12345\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.surecart.createInvoice({
      $,
      data: {
        invoice: {
          automatic_collection: this.automaticCollection,
          due_date: this.dueDate,
          issue_date: this.issueDate,
          footer: this.footer,
          memo: this.memo,
          notifications_enabled: this.notificationsEnabled,
          live_mode: this.liveMode,
          metadata: this.metadata,
        },
      },
    });
    $.export("$summary", `Successfully created invoice ${response.id}`);
    return response;
  },
};
