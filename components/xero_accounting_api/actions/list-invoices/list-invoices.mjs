import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-invoices",
  name: "List Invoices",
  description: "Lists information from invoices in the given tenant id as per filter parameters.",
  version: "0.3.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    modifiedAfter: {
      label: "Modified After",
      type: "string",
      description: "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only invoices created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
      optional: true,
    },
    ids: {
      label: "IDs",
      type: "string",
      description: "Filter by a comma-separated list of InvoicesIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    invoiceNumbers: {
      label: "Invoice Numbers",
      type: "string",
      description: "Filter by a comma-separated list of InvoiceNumbers. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    contactIds: {
      label: "Contact IDs",
      type: "string",
      description: "Filter by a comma-separated list of ContactIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    statuses: {
      label: "Statuses",
      type: "string",
      description: "Filter by a comma-separated list of Statuses. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    where: {
      label: "Where",
      type: "string",
      description: "Filter using the *where* parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/invoices#optimised-parameters) only.",
      optional: true,
    },
    createdByMyApp: {
      label: "Created By My App",
      type: "boolean",
      description: "When set to true you'll only retrieve Invoices created by your app.",
      optional: true,
    },
    order: {
      label: "Order",
      type: "string",
      description: "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) ).",
      optional: true,
    },
    page: {
      label: "Page",
      type: "string",
      description: "Up to 100 invoices will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.listInvoices({
        $,
        tenantId: this.tenantId,
        modifiedSince: this.modifiedAfter,
        params: {
          IDs: this.ids,
          InvoiceNumbers: this.invoiceNumbers,
          ContactIDs: this.contactIds,
          Statuses: this.statuses,
          Where: this.where,
          createdByMyApp: this.createdByMyApp,
          order: this.order,
          page: this.page,
        },
      });

      $.export("$summary", `Successfully fetched ${response.Invoices.length} invoices`);
      return response;
    } catch (e) {
      $.export("$summary", "No invoices found");
      return {};
    }
  },
};
