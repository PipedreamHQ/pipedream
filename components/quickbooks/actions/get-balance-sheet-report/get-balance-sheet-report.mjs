import quickbooks from "../../quickbooks.app.mjs";
import { DATE_MACRO_OPTIONS } from "../../common/constants.mjs";
import {
  commaSeparateArray,
  booleanToString,
} from "../../common/utils.mjs";

export default {
  key: "quickbooks-get-balance-sheet-report",
  name: "Get Balance Sheet Report",
  description: "Retrieves the balance sheet report from Quickbooks Online. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/balancesheet#query-a-report)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    quickbooks,
    customer: {
      type: "string[]",
      label: "Customer IDs",
      description: "Filters report contents to include information for specified customers",
      optional: true,
      propDefinition: [
        quickbooks,
        "customer",
      ],
    },
    qzurl: {
      type: "boolean",
      label: "Include Quick Zoom URL",
      description: "Specifies whether Quick Zoom URL information should be generated for rows in the report",
      optional: true,
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
      description: "Predefined date range. Use if you want the report to cover a standard report date range; otherwise, use the **Start Date** and **End Date** to cover an explicit report date range",
      options: DATE_MACRO_OPTIONS,
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the report, in the format `YYYY-MM-DD`. **Start Date** must be less than **End Date**",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the report, in the format `YYYY-MM-DD`. **Start Date** must be less than **End Date**",
      optional: true,
    },
    adjustedGainLoss: {
      type: "boolean",
      label: "Adjusted Gain Loss",
      description: "Specifies whether unrealized gain and losses are included in the report",
      optional: true,
    },
    classIds: {
      propDefinition: [
        quickbooks,
        "classIds",
      ],
    },
    item: {
      type: "string[]",
      label: "Item IDs",
      description: "Filters report contents to include information for specified items",
      optional: true,
      propDefinition: [
        quickbooks,
        "itemId",
      ],
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "The sort order for report results",
      options: [
        "ascend",
        "descend",
      ],
      optional: true,
    },
    summarizeColumnBy: {
      type: "string",
      label: "Summarize Column By",
      description: "The criteria by which to group the report results",
      options: [
        "Total",
        "Month",
        "Week",
        "Days",
        "Quarter",
        "Year",
        "Customers",
        "Vendors",
        "Classes",
        "Departments",
        "Employees",
        "ProductsAndServices",
      ],
      optional: true,
    },
    department: {
      propDefinition: [
        quickbooks,
        "departmentIds",
      ],
    },
    vendor: {
      propDefinition: [
        quickbooks,
        "vendorIds",
      ],
    },
  },
  async run({ $ }) {
    const {
      quickbooks,
      customer,
      qzurl,
      accountingMethod,
      dateMacro,
      startDate,
      endDate,
      adjustedGainLoss,
      classIds,
      item,
      sortOrder,
      summarizeColumnBy,
      department,
      vendor,
    } = this;

    const response = await quickbooks.getBalanceSheetReport({
      $,
      params: {
        customer: commaSeparateArray(customer),
        qzurl: booleanToString(qzurl),
        accounting_method: accountingMethod,
        date_macro: dateMacro,
        start_date: startDate,
        end_date: endDate,
        adjusted_gain_loss: booleanToString(adjustedGainLoss),
        class: commaSeparateArray(classIds),
        item: commaSeparateArray(item),
        sort_order: sortOrder,
        summarize_column_by: summarizeColumnBy,
        department: commaSeparateArray(department),
        vendor: commaSeparateArray(vendor),
      },
    });
    $.export("$summary", "Successfully retrieved Balance Sheet Report");
    return response;
  },
};
