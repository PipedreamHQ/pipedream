import { defineAction } from "@pipedream/types";
import app from "../../app/expensify.app";
import utils from "../../common/utils";

export default defineAction({
  key: "expensify-create-report",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  name: "Create Report",
  description: "Creates a new report with transactions in a user's account. [See docs here](https://integrations.expensify.com/Integration-Server/doc/#report-creator)",
  type: "action",
  ai: "optimized",
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
      description: `The report's expense line items, as an **array of strings** where **each array element is a JSON string** describing one expense (do NOT pass raw JSON objects — each item must be a JSON-encoded string).

Each expense has these required fields:
- \`date\`: the expense date (format yyyy-mm-dd)
- \`currency\`: three-letter currency code (e.g. "USD", "EUR", "CAD")
- \`merchant\`: the merchant name
- \`amount\`: the amount in **integer cents** (e.g. 2500 = $25.00)

**Example** (array of two JSON strings):
\`\`\`json
[
  "{\\"date\\":\\"2024-01-15\\",\\"currency\\":\\"USD\\",\\"merchant\\":\\"Hotel ABC\\",\\"amount\\":15000}",
  "{\\"date\\":\\"2024-01-16\\",\\"currency\\":\\"USD\\",\\"merchant\\":\\"Restaurant XYZ\\",\\"amount\\":5000}"
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

