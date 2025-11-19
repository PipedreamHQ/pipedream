import quickbooks from "../../quickbooks.app.mjs";
import { AP_AGING_REPORT_COLUMNS } from "../../common/constants.mjs";

export default {
  key: "quickbooks-create-ap-aging-report",
  name: "Create AP Aging Detail Report",
  description: "Creates an AP aging report in Quickbooks Online. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/apagingdetail#query-a-report)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quickbooks,
    shipvia: {
      type: "string",
      label: "Ship Via",
      description: "Filter by the shipping method",
      optional: true,
    },
    termIds: {
      propDefinition: [
        quickbooks,
        "termIds",
      ],
    },
    startDueDate: {
      type: "string",
      label: "Start Due Date",
      description: "The range of dates over which receivables are due, in the format `YYYY-MM-DD`. `start_duedate` must be less than `end_duedate`. If not specified, all data is returned.",
      optional: true,
    },
    endDueDate: {
      type: "string",
      label: "End Due Date",
      description: "The range of dates over which receivables are due, in the format `YYYY-MM-DD`. `start_duedate` must be less than `end_duedate`. If not specified, all data is returned.",
      optional: true,
    },
    accountingMethod: {
      propDefinition: [
        quickbooks,
        "accountingMethod",
      ],
    },
    reportDate: {
      type: "string",
      label: "Report Date",
      description: "Start date to use for the report, in the format `YYYY-MM-DD`",
      optional: true,
    },
    numPeriods: {
      type: "integer",
      label: "Num Periods",
      description: "The number of periods to be shown in the report",
      optional: true,
    },
    vendorIds: {
      propDefinition: [
        quickbooks,
        "vendorIds",
      ],
    },
    pastDue: {
      type: "integer",
      label: "Past Due",
      description: "Filters report contents based on minimum days past due",
      optional: true,
    },
    agingPeriod: {
      type: "integer",
      label: "Aging Period",
      description: "The number of days in the aging period",
      optional: true,
    },
    columns: {
      propDefinition: [
        quickbooks,
        "columns",
      ],
      options: AP_AGING_REPORT_COLUMNS,
    },
  },
  async run({ $ }) {
    const response = await this.quickbooks.getApAgingReport({
      $,
      params: {
        shipvia: this.shipvia,
        term: this.termIds,
        start_duedate: this.startDueDate,
        end_duedate: this.endDueDate,
        accounting_method: this.accountingMethod,
        report_date: this.reportDate,
        num_periods: this.numPeriods,
        vendor: this.vendorIds,
        past_due: this.pastDue,
        aging_period: this.agingPeriod,
        columns: this.columns,
      },
    });
    if (response) {
      $.export("summary", "Successfully created AP Aging Detail Report");
    }
    return response;
  },
};
