// legacy_hash_id: a_PNin2N
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-list-invoices",
  name: "List Invoices",
  description: "Lists all invoices with pagination.",
  version: "0.2.1",
  type: "action",
  props: {
    zoho_books: {
      type: "app",
      app: "zoho_books",
    },
    organization_id: {
      type: "string",
      description: "In Zoho Books, your business is termed as an organization. If you have multiple businesses, you simply set each of those up as an individual organization. Each organization is an independent Zoho Books Organization with it's own organization ID, base currency, time zone, language, contacts, reports, etc.\n\nThe parameter `organization_id` should be sent in with every API request to identify the organization.\n\nThe `organization_id` can be obtained from the GET `/organizations` API's JSON response. Alternatively, it can be obtained from the **Manage Organizations** page in the admin console.",
    },
    invoice_number: {
      type: "string",
      description: "Search invoices by invoice number.Variants: `invoice_number_startswith` and `invoice_number_contains`. Max-length [100]",
      optional: true,
    },
    item_name: {
      type: "string",
      description: "Search invoices by item name. Variants: `item_name_startswith` and `item_name_contains`. Max-length [100]",
      optional: true,
    },
    item_id: {
      type: "string",
      description: "Search invoices by item id.",
      optional: true,
    },
    item_description: {
      type: "string",
      description: "Search invoices by item description. Variants: `item_description_startswith` and `item_description_contains`. Max-length [100]",
      optional: true,
    },
    reference_number: {
      type: "string",
      description: "The reference number of the invoice.",
      optional: true,
    },
    customer_name: {
      type: "string",
      description: "The name of the customer. Max-length [100]",
      optional: true,
    },
    recurring_invoice_id: {
      type: "string",
      description: "ID of the recurring invoice from which the invoice is created.",
      optional: true,
    },
    email: {
      type: "string",
      description: "Search contacts by email id. Max-length [100]",
      optional: true,
    },
    total: {
      type: "string",
      description: "The total amount to be paid.",
      optional: true,
    },
    balance: {
      type: "string",
      description: "The unpaid amount.",
      optional: true,
    },
    custom_field: {
      type: "string",
      description: "Search invoices by custom fields. Variants: `custom_field_startswith` and `custom_field_contains`.",
      optional: true,
    },
    date: {
      type: "string",
      description: "Search invoices by invoice date. Default date format is `yyyy-mm-dd`. Variants: `due_date_start`, `due_date_end`, `due_date_before` and `due_date_after`.",
      optional: true,
    },
    due_date: {
      type: "string",
      description: "Search invoices by due date. Default date format is `yyyy-mm-dd`. Variants: `due_date_start`, `due_date_end`, `due_date_before` and `due_date_after`",
      optional: true,
    },
    last_modified_time: {
      type: "string",
      optional: true,
    },
    status: {
      type: "string",
      description: "Search invoices by invoice status. Allowed Values: `sent`, `draft`, `overdue`, `paid`, `void`, `unpaid`, `partially_paid` and `viewed`",
      optional: true,
      options: [
        "sent",
        "draft",
        "overdue",
        "paid",
        "void",
        "unpaid",
        "partially_paid",
        "viewed",
      ],
    },
    customer_id: {
      type: "string",
      description: "ID of the customer the invoice has to be created.",
      optional: true,
    },
    filter_by: {
      type: "string",
      description: "Filter invoices by any status or payment expected date.Allowed Values: `Status.All`, `Status.Sent`, `Status.Draft`, `Status.OverDue`, `Status.Paid`, `Status.Void`, `Status.Unpaid`, `Status.PartiallyPaid`, `Status.Viewed` and `Date.PaymentExpectedDate`",
      optional: true,
      options: [
        "Status.All",
        "Status.Sent",
        "Status.Draft",
        "Status.OverDue",
        "Status.Paid",
        "Status.Void",
        "Status.Unpaid",
        "Status.PartiallyPaid",
        "Status.Viewed",
        "Date.PaymentExpectedDate",
      ],
    },
    search_text: {
      type: "string",
      description: "Search invoices by invoice number or purchase order or customer name. Max-length [100]",
      optional: true,
    },
    sort_column: {
      type: "string",
      description: "Sort invoices. Allowed Values: `customer_name`, `invoice_number`, `date`, `due_date`, `total`, `balance` and `created_time`.",
      optional: true,
      options: [
        "customer_name",
        "invoice_number",
        "date",
        "due_date",
        "total",
        "balance",
        "created_time",
      ],
    },
    page: {
      type: "string",
      description: "By default first page will be listed. For navigating through pages, use the `page` parameter.",
      optional: true,
    },
    per_page: {
      type: "string",
      description: "The `per_page` parameter can be used to set the number of records that you want to receive in response.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Invoices_List_invoices

    if (!this.organization_id) {
      throw new Error("Must provide organization_id parameter.");
    }

    return await axios($, {
      method: "get",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/invoices?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      params: {
        invoice_number: this.invoice_number,
        item_name: this.item_name,
        item_id: this.item_id,
        item_description: this.item_description,
        reference_number: this.reference_number,
        customer_name: this.customer_name,
        recurring_invoice_id: this.recurring_invoice_id,
        email: this.email,
        total: this.total,
        balance: this.balance,
        custom_field: this.custom_field,
        date: this.date,
        due_date: this.due_date,
        last_modified_time: this.last_modified_time,
        status: this.status,
        customer_id: this.customer_id,
        filter_by: this.filter_by,
        search_text: this.search_text,
        sort_column: this.sort_column,
        page: this.page,
        per_page: this.per_page,
      },
    });
  },
};
