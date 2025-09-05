import { defineAction } from "@pipedream/types";
import app from "../../app/expensify.app";
import utils from "../../common/utils";

export default defineAction({
  key: "expensify-create-report",
  version: "0.0.1",
  name: "Create Report",
  description: "Creates a new report with transactions in a user's account. [See docs here](https://integrations.expensify.com/Integration-Server/doc/#report-creator)",
  type: "action",
  props: {
    app,
    employeeEmail: {
      description: "The report will be created in this account.",
      propDefinition: [
        app,
        "employeeEmail",
      ],
    },
    policyId: {
      propDefinition: [
        app,
        "policyId",
        ({ employeeEmail }) => ({
          userEmail: employeeEmail,
        }),
      ],
    },
    reportTitle: {
      label: "Report Title",
      description: "The title of the report that will be created.",
      type: "string",
    },
    expenses: {
      type: "string[]",
      label: "Expenses",
      description: `Array of expense objects to include in the report. Each expense should be a JSON object with the following required fields:

- \`date\`: The date the expense was made (format yyyy-mm-dd)
- \`currency\`: Three-letter currency code (e.g., "USD", "EUR", "CAD")
- \`merchant\`: The name of the merchant
- \`amount\`: The amount in cents (e.g., 2500 for $25.00)

**Example:**
\`\`\`json
[
  {
    "date": "2024-01-15",
    "currency": "USD", 
    "merchant": "Hotel ABC",
    "amount": 15000
  },
  {
    "date": "2024-01-16",
    "currency": "USD",
    "merchant": "Restaurant XYZ", 
    "amount": 5000
  }
]
\`\`\``,
    },
    reportFields: {
      type: "object",
      label: "Report Fields",
      description: `Custom fields for the report as a JSON object. Use this to set values for custom report fields in your Expensify policy.

- \`Key format\`: Field names should have all non-alphanumerical characters replaced with underscores (_)
- \`Value format\`: String values for the corresponding field

**Example:**
\`\`\`json
{
  "reason_of_trip": "Business meetings with clients",
  "employees": "3",
  "department": "Sales",
  "project_code": "PROJ_2024_001"
}
\`\`\``,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      policyId,
      employeeEmail,
      reportTitle,
      reportFields,
      expenses,
    } = this;

    const response = await this.app.createReport({
      $,
      data: {
        employeeEmail,
        policyID: policyId,
        report: {
          title: reportTitle,
          ...(reportFields && {
            fields: utils.parseJson(reportFields),
          }),
        },
        expenses: utils.parseArray(expenses),
      },
    });

    $.export("$summary", `Successfully created report \`${response.reportName}\` with ID \`${response.reportID}\``);

    return response;
  },
});

