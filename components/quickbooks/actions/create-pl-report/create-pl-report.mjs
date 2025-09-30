import quickbooks from "../../quickbooks.app.mjs";
import {
  DATE_MACRO_OPTIONS, PAYMENT_METHOD_OPTIONS, ACCOUNT_TYPE_OPTIONS, PROFIT_LOSS_REPORT_COLUMNS,
} from "../../common/constants.mjs";

export default {
  key: "quickbooks-create-pl-report",
  name: "Create Profit and Loss Detail Report",
  description: "Creates a profit and loss report in Quickbooks Online. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/profitandloss#query-a-report)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    customerIds: {
      propDefinition: [
        quickbooks,
        "customer",
      ],
      type: "string[]",
      label: "Customer Ids",
      description: "Filters report contents to include information for specified customers",
      optional: true,
    },
    accountIds: {
      propDefinition: [
        quickbooks,
        "accountIds",
      ],
    },
    accountingMethod: {
      propDefinition: [
        quickbooks,
        "accountingMethod",
      ],
    },
    dateMacro: {
      type: "string",
      label: "Date Macro",
      description: "Predefined date range. Use if you want the report to cover a standard report date range; otherwise, use the `start_date` and `end_date` to cover an explicit report date range",
      options: DATE_MACRO_OPTIONS,
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the report, in the format `YYYY-MM-DD`. `start_date` must be less than `end_date`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the report, in the format `YYYY-MM-DD`. `start_date` must be less than `end_date`",
      optional: true,
    },
    adjustedGainLoss: {
      type: "string",
      label: "Adjusted Gain Loss",
      description: "Specifies whether unrealized gain and losses are included in the report",
      options: [
        "true",
        "false",
      ],
      optional: true,
    },
    classIds: {
      propDefinition: [
        quickbooks,
        "classIds",
      ],
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "Filters report contents based on payment method",
      options: PAYMENT_METHOD_OPTIONS,
      optional: true,
    },
    employeeIds: {
      propDefinition: [
        quickbooks,
        "employeeIds",
      ],
    },
    departmentIds: {
      propDefinition: [
        quickbooks,
        "departmentIds",
      ],
    },
    vendorIds: {
      propDefinition: [
        quickbooks,
        "vendorIds",
      ],
    },
    accountType: {
      type: "string",
      label: "Account Type",
      description: "Account type from which transactions are included in the report",
      options: ACCOUNT_TYPE_OPTIONS,
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The column type used in sorting report rows",
      options: PROFIT_LOSS_REPORT_COLUMNS,
      optional: true,
    },
    columns: {
      propDefinition: [
        quickbooks,
        "columns",
      ],
      options: PROFIT_LOSS_REPORT_COLUMNS,
    },
  },
  async run({ $ }) {
    const response = await this.quickbooks.getProfitLossReport({
      $,
      params: {
        customer: this.customerIds,
        account: this.accountIds,
        accounting_method: this.accountingMethod,
        date_macro: this.dateMacro,
        start_date: this.startDate,
        end_date: this.endDate,
        adjusted_gain_loss: this.adjustedGainLoss,
        class: this.classIds,
        payment_method: this.paymentMethod,
        employee: this.employeeIds,
        department: this.departmentIds,
        vendor: this.vendorIds,
        account_type: this.accountType,
        sort_by: this.sortBy,
        columns: this.columns,
      },
    });
    if (response) {
      $.export("summary", "Successfully created Profit and Loss Detail Report");
    }
    return response;
  },
};
