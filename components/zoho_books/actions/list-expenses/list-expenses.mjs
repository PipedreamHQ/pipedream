// legacy_hash_id: a_gnir81// legacy_hash_id: a_RAiV28
import {
  FILTER_BY_OPTIONS,
  SORT_COLUMN_OPTIONS,
  STATUS_OPTIONS,
} from "../../common/constants.mjs";
import zohoBooks from "../../zoho_books.app.mjs";

export default {
  key: "zoho_books-list-expenses",
  name: "List Expenses",
  description: "List all the Expenses. [See the documentation](https://www.zoho.com/books/api/v3/expenses/#list-expenses)",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zohoBooks,
    description: {
      type: "string",
      label: "Description",
      description: "Search expenses by description.Variants `description_startswith` and `description_contains`. Max-length [100]",
      optional: true,
    },
    referenceNumber: {
      type: "string",
      label: "Reference Number",
      description: "Search expenses by reference number. Variants `reference_number_startswith` and `reference_number_contains`. Max-length [100]",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Search expenses by expense date. Variants `date_start`, `date_end`, `date_before` and `date_after`. Format [yyyy-mm-dd]",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Search expenses by expense status.",
      options: STATUS_OPTIONS,
      optional: true,
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Search expenses by amount.",
      optional: true,
    },
    accountName: {
      type: "string",
      label: "Account Name",
      description: "Search expenses by expense account name. Max-length [100]",
      optional: true,
    },
    customerName: {
      type: "string",
      label: "Customer Name",
      description: "Search expenses by customer name. Max-length [100]",
      optional: true,
    },
    vendorName: {
      type: "string",
      label: "Vendor Name",
      description: "Search expenses by vendor name.",
      optional: true,
    },
    customerId: {
      type: "string",
      label: "Customer Id",
      description: "ID of the expense account.",
      optional: true,
    },
    vendorId: {
      type: "string",
      label: "Vendor Id",
      description: "ID of the vendor the expense is made.",
      optional: true,
    },
    recurringExpenseId: {
      type: "string",
      label: "Recurring Expense Id",
      description: "Search expenses by recurring expense id.",
      optional: true,
    },
    paidThroughAccountId: {
      type: "string",
      label: "Paid Through Account Id",
      description: "Search expenses by paid through account id.",
      optional: true,
    },
    searchText: {
      type: "string",
      label: "Search Text",
      description: "Search expenses by account name or description or `customer name` or `vendor name`. Max-length [100]",
      optional: true,
    },
    sortColumn: {
      type: "string",
      label: "Sort Column",
      description: "Sort expenses.",
      optional: true,
      options: SORT_COLUMN_OPTIONS,
    },
    filterBy: {
      type: "string",
      label: "Filter By",
      description: "Filter expenses by expense status.",
      optional: true,
      options: FILTER_BY_OPTIONS,
    },
  },
  async run({ $ }) {
    const response = this.zohoBooks.paginate({
      fn: this.zohoBooks.listExpenses,
      fieldName: "expenses",
      params: {
        description: this.description,
        reference_number: this.referenceNumber,
        date: this.date,
        status: this.status,
        amount: this.amount,
        account_name: this.accountName,
        customer_name: this.customerName,
        vendor_name: this.vendorName,
        customer_id: this.customerId,
        vendor_id: this.vendorId,
        recurring_expense_id: this.recurringExpenseId,
        paid_through_account_id: this.paidThroughAccountId,
        search_text: this.searchText,
        sort_column: this.sortColumn,
        filter_by: this.filterBy,
      },
    });

    const responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully fetched ${responseArray.length} expenses(s)`);
    return responseArray;
  },
};
