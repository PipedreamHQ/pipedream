import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-create-invoice",
  name: "Create Invoice",
  description: "Create a new invoice for a recipient. [See the documentation](https://developers.trolley.com/api/#create-an-invoice)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    trolley,
    recipientId: {
      propDefinition: [
        trolley,
        "recipientId",
      ],
      description: "The Trolley Recipient ID this invoice is for (e.g., `R-xxxx`). Use the **List Recipients** action to find available recipient IDs.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "An internal description for the invoice.",
      optional: true,
    },
    externalId: {
      propDefinition: [
        trolley,
        "externalId",
      ],
      description: "The invoice identifier from your external platform.",
      optional: true,
    },
    invoiceDate: {
      type: "string",
      label: "Invoice Date",
      description: "The date the invoice was issued, in `YYYY-MM-DD` format (e.g., `2026-05-14`).",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date the invoice is due, in `YYYY-MM-DD` format (e.g., `2026-06-14`).",
      optional: true,
    },
    tags: {
      propDefinition: [
        trolley,
        "tags",
      ],
      description: "Tags for this invoice (for metadata, search, and indexing).",
      optional: true,
    },
    lines: {
      type: "string",
      label: "Invoice Lines",
      description: "JSON array of invoice line objects (max 500 lines). Each line requires `unitAmount` (`{ value, currency }`). Optional per line: `category` (one of `services`, `rent`, `royalties`, `royalties_film`, `prizes`, `education`, `refunds`), `description`, `externalId`, `taxReportable`, `forceUsTaxActivity`, `tags`. Example: `[{\"unitAmount\":{\"value\":\"100.00\",\"currency\":\"USD\"},\"description\":\"Consulting\",\"category\":\"services\"}]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const lines = this.lines
      ? JSON.parse(this.lines)
      : undefined;
    const response = await this.trolley.createInvoice({
      $,
      data: {
        recipientId: this.recipientId,
        description: this.description,
        externalId: this.externalId,
        invoiceDate: this.invoiceDate,
        dueDate: this.dueDate,
        tags: this.tags,
        lines,
      },
    });
    $.export("$summary", `Successfully created invoice ${response.invoice?.id ?? ""}`);
    return response;
  },
};
