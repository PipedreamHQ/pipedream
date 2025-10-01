import app from "../../mews.app.mjs";

export default {
  name: "Get Bill PDF",
  description: "Get a bill PDF by bill ID. [See the documentation](https://mews-systems.gitbook.io/connector-api/operations/bills#get-bill-pdf)",
  key: "mews-get-bill-pdf",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    billId: {
      optional: false,
      propDefinition: [
        app,
        "billId",
        () => ({
          data: {
            State: "Closed",
          },
        }),
      ],
      description: "Unique identifier of the Bill.",
    },
    billPrintEventId: {
      type: "string",
      label: "Bill Print Event ID",
      description: "Unique identifier of the Bill print event returned by previous invocation.",
      optional: true,
    },
    pdfTemplate: {
      type: "string",
      label: "PDF Template",
      description: "Bill PDF template type. If not specified, the default template is used.",
      optional: true,
      options: [
        {
          label: "Detailed - Detailed overview. Items are grouped by the reservation, item type and price, and consumption date.",
          value: "Detailed",
        },
        {
          label: "Consumption - Overview by date (no reservation details). Items of the same type and price are grouped by consumption date.",
          value: "Consumption",
        },
        {
          label: "Reservation - Overview by reservation (no date). Items of the same type and price are grouped by reservation.",
          value: "Reservation",
        },
        {
          label: "OrderItem - Consumption overview (not fiscal document). Items are grouped by the item type and price without reservation details and consumption date.",
          value: "OrderItem",
        },
        {
          label: "Guest - Overview by guest. Items are grouped by guest, reservation, consumption date, and item type.",
          value: "Guest",
        },
      ],
    },
    printReason: {
      type: "string",
      label: "Print Reason",
      description: "The reason for reprinting the bill with different template. Required for France LE. Max length 255 characters.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      billId,
      billPrintEventId,
      pdfTemplate,
      printReason,
    } = this;

    const response = await app.billsGetPdf({
      $,
      data: {
        BillId: billId,
        BillPrintEventId: billPrintEventId,
        PdfTemplate: pdfTemplate,
        PrintReason: printReason,
      },
    });

    $.export("$summary", `Successfully retrieved PDF for bill ${billId}`);
    return response;
  },
};
