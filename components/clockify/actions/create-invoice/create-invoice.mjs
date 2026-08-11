// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "clockify-create-invoice",
  name: "Create Invoice",
  description: "Creates a new invoice for a client in a Clockify workspace. Clockify's create endpoint accepts only the client, number, currency and the two dates — chain **Update Invoice** afterwards to set the subject, note or status. Line items and imported time are not exposed by this component, so use **List Time Entries** or **Get Time Entry Report** to look up the hours to bill and summarize them in the note you set via **Update Invoice**. [See the documentation](https://docs.clockify.me/#tag/Invoice)",
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
  },
  async run({ $ }) {
    const response = await this.clockify.createInvoice({
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

    $.export("$summary", `Successfully created invoice with ID ${response.id}`);

    return response;
  },
};
