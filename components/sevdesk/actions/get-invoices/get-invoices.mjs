import app from "../../sevdesk.app.mjs";

export default {
  key: "sevdesk-get-invoices",
  name: "Get Invoices",
  description: "Retrieve invoices with optional filtering by status, invoice number, date range, and contact. [See the documentation](https://api.sevdesk.de/#tag/Invoice/operation/getInvoices)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    status: {
      type: "string",
      label: "Status",
      description: "Status of the invoices to filter by",
      options: [
        {
          label: "Draft",
          value: "100",
        },
        {
          label: "Open",
          value: "200",
        },
        {
          label: "Paid",
          value: "1000",
        },
      ],
      optional: true,
    },
    invoiceNumber: {
      type: "string",
      label: "Invoice Number",
      description: "Retrieve all invoices with this invoice number",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Retrieve all invoices with a date equal or higher (ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "Retrieve all invoices with a date equal or lower (ISO 8601 format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)",
      optional: true,
    },
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of invoices to retrieve",
      optional: true,
      min: 1,
      max: 999,
    },
  },
  methods: {
    convertDateToTimestamp(dateString) {
      if (!dateString) return undefined;

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${dateString}. Please use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)`);
      }

      return Math.floor(date.getTime() / 1000);
    },
  },
  async run({ $ }) {
    const {
      app,
      status,
      invoiceNumber,
      startDate,
      endDate,
      contactId,
      limit,
    } = this;

    let startTimestamp, endTimestamp;

    try {
      startTimestamp = this.convertDateToTimestamp(startDate);
      endTimestamp = this.convertDateToTimestamp(endDate);
    } catch (error) {
      throw new Error(`Date validation error: ${error.message}`);
    }

    if (startTimestamp && endTimestamp && startTimestamp > endTimestamp) {
      throw new Error("Start date cannot be later than end date");
    }

    const response = await app.listInvoices({
      $,
      params: {
        status,
        invoiceNumber,
        startDate: startTimestamp,
        endDate: endTimestamp,
        ...(contactId
          ? {
            "contact[id]": contactId,
            "contact[objectName]": "Contact",
          }
          : {}
        ),
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved ${response.objects?.length || 0} invoice(s)`);
    return response;
  },
};
