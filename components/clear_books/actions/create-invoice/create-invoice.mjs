import clear_books from "../../clear_books.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "clear_books-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice in Clear Books. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    clear_books,
    createInvoiceClientDetails: {
      propDefinition: [
        clear_books,
        "createInvoiceClientDetails",
      ],
    },
    createInvoiceLineItems: {
      propDefinition: [
        clear_books,
        "createInvoiceLineItems",
      ],
    },
    createInvoiceIssueDate: {
      propDefinition: [
        clear_books,
        "createInvoiceIssueDate",
      ],
    },
    createInvoiceNotes: {
      propDefinition: [
        clear_books,
        "createInvoiceNotes",
      ],
    },
    createInvoiceDueDate: {
      propDefinition: [
        clear_books,
        "createInvoiceDueDate",
      ],
    },
    createInvoiceTags: {
      propDefinition: [
        clear_books,
        "createInvoiceTags",
      ],
    },
  },
  async run({ $ }) {
    const clientDetails = JSON.parse(this.createInvoiceClientDetails[0]);
    const lineItems = this.createInvoiceLineItems.map((item) => JSON.parse(item));

    const data = {
      client_details: clientDetails,
      line_items: lineItems,
      issue_date: this.createInvoiceIssueDate,
    };

    if (this.createInvoiceNotes) {
      data.notes = this.createInvoiceNotes;
    }

    if (this.createInvoiceDueDate) {
      data.due_date = this.createInvoiceDueDate;
    }

    if (this.createInvoiceTags && this.createInvoiceTags.length > 0) {
      data.tags = this.createInvoiceTags;
    }

    const response = await this.clear_books.createInvoice(data);

    $.export("$summary", `Created invoice with ID ${response.id}`);
    return response;
  },
};
