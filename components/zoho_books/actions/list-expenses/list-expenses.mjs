// legacy_hash_id: a_gnir81
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_books-list-expenses",
  name: "List Expenses",
  description: "List all the Expenses.",
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
    description: {
      type: "string",
      description: "Search expenses by description.Variants `description_startswith` and `description_contains`. Max-length [100]",
      optional: true,
    },
    reference_number: {
      type: "string",
      description: "Search expenses by reference number. Variants `reference_number_startswith` and `reference_number_contains`. Max-length [100]",
      optional: true,
    },
    date: {
      type: "string",
      description: "Search expenses by expense date. Variants `date_start`, `date_end`, `date_before` and `date_after`. Format [yyyy-mm-dd]",
      optional: true,
    },
    status: {
      type: "string",
      description: "Search expenses by expense status. Allowed Values `unbilled`, `invoiced`, `reimbursed`, `non-billable` and `billable`.",
      optional: true,
      options: [
        "unbilled",
        "invoiced",
        "reimbursed",
        "non-billable",
        "billable",
      ],
    },
    amount: {
      type: "string",
      description: "Search expenses by amount. Variants: `amount_less_than`, `amount_less_equals`, `amount_greater_than` and `amount_greater_than`.",
      optional: true,
    },
    account_name: {
      type: "string",
      description: "Search expenses by expense account name. Variants `account_name_startswith` and `account_name_contains`. Max-length [100",
      optional: true,
    },
    customer_name: {
      type: "string",
      description: "Search expenses by customer name. Variants: `customer_name_startswith` and `customer_name_contains`. Max-length [100]",
      optional: true,
    },
    vendor_name: {
      type: "string",
      description: "Search expenses by vendor name. Variants: `vendor_name_startswith` and `vendor_name_contains`.",
      optional: true,
    },
    customer_id: {
      type: "string",
      description: "ID of the expense account.",
      optional: true,
    },
    vendor_id: {
      type: "string",
      description: "ID of the vendor the expense is made.",
      optional: true,
    },
    recurring_expense_id: {
      type: "string",
      description: "Search expenses by recurring expense id.",
      optional: true,
    },
    paid_through_account_id: {
      type: "string",
      description: "Search expenses by paid through account id.",
      optional: true,
    },
    search_text: {
      type: "string",
      description: "Search expenses by account name or description or `customer name` or `vendor name`. Max-length [100]",
      optional: true,
    },
    sort_column: {
      type: "string",
      description: "Sort expenses.Allowed Values `date`, `account_name`, `total`, `bcy_total`, `reference_number`, `customer_name` and `created_time`.",
      optional: true,
      options: [
        "date",
        "account_name",
        "total",
        "bcy_total",
        "reference_number",
        "customer_name",
        "created_time",
      ],
    },
    filter_by: {
      type: "string",
      description: "Filter expenses by expense status. Allowed Values `Status.All`, `Status.Billable`, `Status.Nonbillable`, `Status.Reimbursed`, `Status.Invoiced` and `Status.Unbilled`.",
      optional: true,
      options: [
        "Status.All",
        "Status.Billable",
        "Status.Nonbillable",
        "Status.Reimbursed",
        "Status.Invoiced",
        "Status.Unbilled",
      ],
    },
    page: {
      type: "string",
      description: "By default first page will be listed. For navigating through `pages`, use the `page` parameter.",
      optional: true,
    },
    per_page: {
      type: "string",
      description: "The `per_page` parameter can be used to set the number of records that you want to receive in response.",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://www.zoho.com/books/api/v3/#Expenses_List_Expenses

    if (!this.organization_id) {
      throw new Error("Must provide organization_id parameters.");
    }

    return await axios($, {
      method: "get",
      url: `https://books.${this.zoho_books.$auth.base_api_uri}/api/v3/expenses?organization_id=${this.organization_id}`,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.zoho_books.$auth.oauth_access_token}`,
      },
      params: {
        description: this.description,
        reference_number: this.reference_number,
        date: this.date,
        status: this.status,
        amount: this.amount,
        account_name: this.account_name,
        customer_name: this.customer_name,
        vendor_name: this.vendor_name,
        customer_id: this.customer_id,
        vendor_id: this.vendor_id,
        recurring_expense_id: this.recurring_expense_id,
        paid_through_account_id: this.paid_through_account_id,
        search_text: this.search_text,
        sort_column: this.sort_column,
        filter_by: this.filter_by,
        page: this.page,
        per_page: this.per_page,
      },
    });
  },
};
