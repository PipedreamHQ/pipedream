// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import clockify from "../../clockify.app.mjs";
import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "clockify-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice for a client in a Clockify workspace. Set **Import From** and **Import To** to bill tracked time: the invoice is created and the time entries logged in that period are imported as line items. Leave both blank to create an empty invoice. Chain **Update Invoice** afterwards to set the subject, note or status, and use **Import Time Entries to Invoice** if you need the full set of grouping options. [See the documentation](https://docs.clockify.me/#tag/Invoice/operation/createInvoice)",
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
      propDefinition: [
        clockify,
        "importFrom",
      ],
    },
    importTo: {
      propDefinition: [
        clockify,
        "importTo",
      ],
    },
    timeEntryGroupType: {
      propDefinition: [
        clockify,
        "timeEntryGroupType",
      ],
    },
    projectIds: {
      propDefinition: [
        clockify,
        "projectIds",
      ],
    },
    importExpenses: {
      propDefinition: [
        clockify,
        "importExpenses",
      ],
    },
    roundTimeEntryDuration: {
      propDefinition: [
        clockify,
        "roundTimeEntryDuration",
      ],
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

    const groupType = this.timeEntryGroupType ?? "DETAILED";

    let response;
    try {
      response = await this.clockify.importInvoiceItems({
        $,
        workspaceId: this.workspaceId,
        invoiceId: invoice.id,
        data: {
          from: this.importFrom,
          to: this.importTo,
          importExpenses: this.importExpenses ?? false,
          roundTimeEntryDuration: this.roundTimeEntryDuration,
          timeEntryGroupType: groupType,
          timeEntryFieldsForDetailedGroup: groupType === "DETAILED"
            ? [
              "PROJECT",
              "DESCRIPTION",
            ]
            : undefined,
          projectFilter: utils.buildProjectFilter(this.projectIds),
        },
      });
    } catch (error) {
      // The invoice already exists at this point, so surface its ID rather than leaving
      // the caller to discover a stray empty invoice
      throw new ConfigurationError(`Invoice ${invoice.id} was created, but importing tracked time failed: ${error.message}`);
    }

    $.export("$summary", `Successfully created invoice with ID ${invoice.id} and imported tracked time`);

    return response;
  },
};
