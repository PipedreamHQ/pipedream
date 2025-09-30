// legacy_hash_id: a_PNin2N// legacy_hash_id: a_RAiV28
import {
  INVOICE_FILTER_BY_OPTIONS,
  INVOICE_SORT_COLUMN_OPTIONS,
  INVOICE_STATUS_OPTIONS,
} from "../../common/constants.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-list-invoices",
  name: "List Invoices",
  description: "Lists all invoices. [See the documentation](https://www.zoho.com/books/api/v3/contacts/#list-contacts)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoBooks,
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "Search invoices by invoice number. Max-length [100]",
      optional: true,
    },
    itemName: {
      type: "string",
      label: "Item Name",
      description: "Search invoices by item name. Max-length [100]",
      optional: true,
    },
    itemId: {
      type: "string",
      label: "Item Id",
      description: "Search invoices by item id.",
      optional: true,
    },
    itemDescription: {
      type: "string",
      label: "Item Description",
      description: "Search invoices by item description. Max-length [100]",
      optional: true,
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "The reference number of the invoice.",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "The name of the customer. Max-length [100]",
      optional: true,
    },
    recurringInvoiceId: {
      type: "string",
      label: "Recurring Invoice Id",
      description: "ID of the recurring invoice from which the invoice is created.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Search contacts by email id. Max-length [100]",
      optional: true,
    },
    total: {
      type: "string",
      label: "Total",
      description: "The total amount to be paid.",
      optional: true,
    },
    balance: {
      type: "string",
      label: "Balance",
      description: "The unpaid amount.",
      optional: true,
    },
    customField: {
      type: "string",
      label: "Custom Field",
      description: "Search invoices by custom fields.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Search invoices by invoice date. Default date format is `yyyy-mm-dd`.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Search invoices by due date. Default date format is `yyyy-mm-dd`.",
      optional: true,
    },
    lastModifiedTime: {
      type: "string",
      label: "Last Modified Time",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Search invoices by invoice status.",
      options: INVOICE_STATUS_OPTIONS,
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "ID of the customer the invoice has to be created.",
      optional: true,
    },
    filterBy: {
      type: "string",
      label: "Filter By",
      description: "Filter invoices by any status or payment expected date.",
      optional: true,
      options: INVOICE_FILTER_BY_OPTIONS,
    },
    searchText: {
      type: "string",
      label: "Search Text",
      description: "Search invoices by invoice number or purchase order or customer name. Max-length [100]",
      optional: true,
    },
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "Sort invoices.",
      options: INVOICE_SORT_COLUMN_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.zohoBooks.paginate({
      fn: this.zohoBooks.listInvoices,
      fieldName: "invoices",
      params: {
        invoice_number: this.invoiceNumber,
        item_name: this.itemName,
        item_id: this.itemId,
        item_description: this.itemDescription,
        reference_number: this.referenceNumber,
        customer_name: this.customerName,
        recurring_invoice_id: this.recurringInvoiceId,
        email: this.email,
        total: this.total,
        balance: this.balance,
        custom_field: this.customField,
        date: this.date,
        due_date: this.dueDate,
        last_modified_time: this.lastModifiedTime,
        status: this.status,
        customer_id: this.customerId,
        filter_by: this.filterBy,
        search_text: this.searchText,
        sort_column: this.sortColumn,
      },
    });

    const responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully fetched ${responseArray.length} invoices(s)`);
    return responseArray;
  },
};
