// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "clockify-import-time-entries-to-invoice",
  name: "Import Time Entries to Invoice",
  description: "Imports the time entries tracked in a given period onto an existing Clockify invoice as line items, optionally alongside billable expenses. Use **List Invoices** to find the invoice, or **Create Invoice** to make one first. [See the documentation](https://docs.clockify.me/#tag/Invoice/operation/importTimeEntriesAndExpenses)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    invoiceId: {
      propDefinition: [
        clockify,
        "invoiceId",
      ],
    },
    importFrom: {
      propDefinition: [
        clockify,
        "importFrom",
      ],
      optional: false,
    },
    importTo: {
      propDefinition: [
        clockify,
        "importTo",
      ],
      optional: false,
    },
    projectIds: {
      propDefinition: [
        clockify,
        "projectIds",
      ],
    },
    roundTimeEntryDuration: {
      propDefinition: [
        clockify,
        "roundTimeEntryDuration",
      ],
    },
    timeEntryGroupType: {
      propDefinition: [
        clockify,
        "timeEntryGroupType",
      ],
    },
    timeEntryPrimaryGroupBy: {
      propDefinition: [
        clockify,
        "timeEntryPrimaryGroupBy",
      ],
    },
    timeEntrySecondaryGroupBy: {
      propDefinition: [
        clockify,
        "timeEntrySecondaryGroupBy",
      ],
    },
    timeEntryFieldsForDetailedGroup: {
      propDefinition: [
        clockify,
        "timeEntryFieldsForDetailedGroup",
      ],
    },
    importExpenses: {
      propDefinition: [
        clockify,
        "importExpenses",
      ],
    },
    expensesGroupType: {
      propDefinition: [
        clockify,
        "expensesGroupType",
      ],
    },
    expensesGroupBy: {
      propDefinition: [
        clockify,
        "expensesGroupBy",
      ],
    },
    expenseFieldsForDetailedGroup: {
      propDefinition: [
        clockify,
        "expenseFieldsForDetailedGroup",
      ],
    },
  },
  async run({ $ }) {
    const groupType = this.timeEntryGroupType ?? "DETAILED";

    if (groupType === "GROUPED" && !this.timeEntryPrimaryGroupBy) {
      throw new ConfigurationError("Set Time Entry Primary Group By when Time Entry Group Type is `GROUPED`.");
    }

    if (this.timeEntryPrimaryGroupBy
      && this.timeEntryPrimaryGroupBy === this.timeEntrySecondaryGroupBy) {
      throw new ConfigurationError("Time Entry Secondary Group By must differ from Time Entry Primary Group By.");
    }

    const response = await this.clockify.importInvoiceItems({
      $,
      workspaceId: this.workspaceId,
      invoiceId: this.invoiceId,
      data: {
        from: this.importFrom,
        to: this.importTo,
        importExpenses: this.importExpenses ?? false,
        roundTimeEntryDuration: this.roundTimeEntryDuration,
        timeEntryGroupType: groupType,
        timeEntryPrimaryGroupBy: this.timeEntryPrimaryGroupBy,
        timeEntrySecondaryGroupBy: this.timeEntrySecondaryGroupBy,
        timeEntryFieldsForDetailedGroup: this.timeEntryFieldsForDetailedGroup,
        expensesGroupType: this.expensesGroupType,
        expensesGroupBy: this.expensesGroupBy,
        expenseFieldsForDetailedGroup: this.expenseFieldsForDetailedGroup,
        projectFilter: utils.buildProjectFilter(this.projectIds),
      },
    });

    $.export("$summary", `Successfully imported tracked time into invoice with ID ${this.invoiceId}`);

    return response;
  },
};
