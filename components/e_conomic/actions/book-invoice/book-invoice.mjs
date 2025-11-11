import economic from "../../e_conomic.app.mjs";

export default {
  key: "e_conomic-book-invoice",
  name: "Book Invoice",
  description: "Books an invoice. [See the documentation](https://restdocs.e-conomic.com/#post-invoices-booked)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    economic,
    draftInvoiceNumber: {
      propDefinition: [
        economic,
        "draftInvoiceNumber",
      ],
    },
    sendByEan: {
      type: "boolean",
      label: "Send by EAN",
      description: "Send your invoice electronically via EAN (European Article Numbering)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.economic.bookInvoice({
      $,
      data: {
        draftInvoice: {
          draftInvoiceNumber: this.draftInvoiceNumber,
        },
        sendBy: this.sendByEan
          ? "ean"
          : undefined,
      },
    });
    $.export("$summary", "Successfully booked invoice.");
    return response;
  },
};
