import quickbooks from "../../quickbooks.app.mjs";
import { DATE_MACRO_OPTIONS } from "../../common/constants.mjs";
import { commaSeparateArray } from "../../common/utils.mjs";

export default {
  key: "quickbooks-get-cash-flow-report",
  name: "Get Cash Flow Report",
  description: "Retrieves the cash flow report from Quickbooks Online. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/cashflow#query-a-report)",
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
    vendor: {
      propDefinition: [
        quickbooks,
        "vendorIds",
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
  },
  async run({ $ }) {
    const {
      quickbooks,
      customer,
      vendor,
      dateMacro,
      startDate,
      endDate,
      classIds,
      item,
      sortOrder,
      summarizeColumnBy,
      department,
    } = this;

    const response = await quickbooks.getCashFlowReport({
      $,
      params: {
        customer: commaSeparateArray(customer),
        vendor: commaSeparateArray(vendor),
        date_macro: dateMacro,
        start_date: startDate,
        end_date: endDate,
        class: commaSeparateArray(classIds),
        item: commaSeparateArray(item),
        sort_order: sortOrder,
        summarize_column_by: summarizeColumnBy,
        department: commaSeparateArray(department),
      },
    });
    $.export("$summary", "Successfully retrieved Cash Flow Report");
    return response;
  },
};
