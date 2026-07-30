// x-pd-ai: optimized
import { defineAction } from "@pipedream/types";
import expensify from "../../app/expensify.app";
import { EXPENSE_LIST_FTL_TEMPLATE } from "../../common/constants";

export default defineAction({
  key: "expensify-list-expenses",
  name: "List Expenses",
  description: "List individual expenses (transactions) for an employee within a date range, returning a structured JSON array (each with amount, currency, merchant, created date, category, receiptURL, reportID). NOT a file. Implemented via the Report Exporter with an embedded Freemarker JSON template that flattens transactionList, read in memory. Use **List Policies** to discover valid IDs for the optional policyId filter. To read all expenses on one specific report, use **Get Report** instead. [See the documentation](https://integrations.expensify.com/Integration-Server/doc/#report-exporter)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    expensify,
    employeeEmail: {
      propDefinition: [
        expensify,
        "employeeEmail",
      ],
      description: "Employee email whose expenses to list.",
    },
    startDate: {
      propDefinition: [
        expensify,
        "startDate",
      ],
      description: "Start of the date range, formatted yyyy-mm-dd (e.g. `2026-01-01`).",
      optional: false,
    },
    endDate: {
      propDefinition: [
        expensify,
        "endDate",
      ],
      description: "End of the date range, formatted yyyy-mm-dd (e.g. `2026-07-24`). Required by the API when the range exceeds one year.",
      optional: false,
    },
    policyId: {
      type: "string",
      label: "Policy ID",
      description: "Optional policy ID to filter by. Free-form string; run **List Policies** first to obtain valid IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fileName = await this.expensify.exportData({
      $,
      template: EXPENSE_LIST_FTL_TEMPLATE,
      inputSettings: {
        filters: {
          startDate: this.startDate,
          endDate: this.endDate,
          policyIDList: this.policyId,
        },
        employeeEmail: this.employeeEmail,
      },
    });

    const fileBuffer = await this.expensify.downloadFile({
      $,
      fileName,
    });

    const expenses = JSON.parse(Buffer.from(fileBuffer).toString("utf8"));

    $.export("$summary", `Found ${expenses.length} expense(s) for ${this.employeeEmail}`);
    return expenses;
  },
});
