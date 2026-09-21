import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "clockify-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice for a client in a Clockify workspace. Set **Import From** and **Import To** to bill tracked time: the invoice is created and the time entries logged in that period are imported as line items. Leave both blank to create an empty invoice. The invoice is created first and the tracked time is imported in a second request, so if the import fails the invoice still exists and can be removed with **Delete Invoice** or retried. Chain **Update Invoice** afterwards to set the subject, note or status. [See the documentation](https://docs.clockify.me/#tag/Invoice/operation/createInvoice)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
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
    clientId: {
      propDefinition: [
        clockify,
        "clientId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: false,
    },
    number: {
      propDefinition: [
        clockify,
        "invoiceNumber",
      ],
    },
    issuedDate: {
      propDefinition: [
        clockify,
        "issuedDate",
      ],
    },
    dueDate: {
      propDefinition: [
        clockify,
        "dueDate",
      ],
    },
    currency: {
      propDefinition: [
        clockify,
        "currency",
      ],
    },
    timeViewMode: {
      type: "string",
      label: "Time View Mode",
      description: "How tracked time is presented on the invoice. `TIME_SENSITIVE_VIEW` lists entries individually, `AGGREGATED_TIME_VIEW` rolls them up",
      optional: true,
      options: constants.INVOICE_TIME_VIEW_MODE_OPTIONS,
    },
    importFrom: {
      type: "string",
      label: "Import From",
      description: "Start of the period to bill tracked time from, in ISO 8601 format. Set this and **Import To** to import the time entries logged in that period as line items. Example: `2026-08-01T00:00:00Z`",
      optional: true,
    },
    importTo: {
      type: "string",
      label: "Import To",
      description: "End of the period to bill tracked time from, in ISO 8601 format. Example: `2026-08-31T23:59:59Z`",
      optional: true,
    },
    projectIds: {
      type: "string[]",
      label: "Project IDs",
      description: "Only bill time tracked against these projects. Leave blank to bill every project in the period. Use the **List Projects** action to find the IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (Boolean(this.importFrom) !== Boolean(this.importTo)) {
      throw new ConfigurationError("Set both Import From and Import To to import tracked time, or leave both blank.");
    }

    const invoice = await this.clockify.createInvoice({
      $,
      workspaceId: this.workspaceId,
      data: {
        clientId: this.clientId,
        number: this.number,
        issuedDate: this.issuedDate,
        dueDate: this.dueDate,
        currency: this.currency,
        timeViewMode: this.timeViewMode,
      },
    });

    if (!this.importFrom) {
      $.export("$summary", `Successfully created invoice with ID ${invoice.id}`);

      return invoice;
    }

    const response = await this.clockify.importInvoiceItems({
      $,
      workspaceId: this.workspaceId,
      invoiceId: invoice.id,
      data: {
        from: this.importFrom,
        to: this.importTo,
        // Required by the endpoint. This action bills tracked time only, and lists one
        // line item per entry so the invoice reads back against the entries it came from
        importExpenses: false,
        timeEntryGroupType: "DETAILED",
        timeEntryFieldsForDetailedGroup: [
          "PROJECT",
          "DESCRIPTION",
        ],
        projectFilter: utils.buildProjectFilter(this.projectIds),
      },
    });

    $.export("$summary", `Successfully created invoice with ID ${invoice.id} and imported tracked time`);

    return response;
  },
};
