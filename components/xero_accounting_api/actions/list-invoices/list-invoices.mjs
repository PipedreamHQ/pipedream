// legacy_hash_id: a_3Liezo
import { axios } from "@pipedream/platform";

export default {
  key: "xero_accounting_api-list-invoices",
  name: "List Invoices",
  description: "Lists information from invoices in the given tenant id as per filter parameters.",
  version: "0.2.1",
  type: "action",
  props: {
    xero_accounting_api: {
      type: "app",
      app: "xero_accounting_api",
    },
    tenant_id: {
      type: "string",
      description: "Id of the organization tenant to use on the Xero Accounting API. See [Get Tenant Connections](https://pipedream.com/@sergio/xero-accounting-api-get-tenant-connections-p_OKCzOgn/edit) for a workflow example on how to pull this data.",
    },
    invoice_identifier: {
      type: "string",
      description: "An invoice identifier. Possible values:\n\n* **InvoiceID** - The Xero identifier for an Invoice e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **InvoiceNumber** - The InvoiceNumber e.g. INV-01514",
      optional: true,
    },
    modified_after: {
      type: "string",
      description: "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only invoices created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
      optional: true,
    },
    ids: {
      type: "string",
      description: "Filter by a comma-separated list of InvoicesIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    invoice_numbers: {
      type: "string",
      description: "Filter by a comma-separated list of InvoiceNumbers. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    contact_ids: {
      type: "string",
      description: "Filter by a comma-separated list of ContactIDs. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    statuses: {
      type: "string",
      description: "Filter by a comma-separated list of Statuses. See [details](https://developer.xero.com/documentation/api/invoices#optimised-queryparameters).",
      optional: true,
    },
    where: {
      type: "string",
      description: "Filter using the *where* parameter. We recommend you limit filtering to the [optimised elements](https://developer.xero.com/documentation/api/invoices#optimised-parameters) only.",
      optional: true,
    },
    created_by_my_app: {
      type: "boolean",
      description: "When set to true you'll only retrieve Invoices created by your app.",
      optional: true,
    },
    order: {
      type: "string",
      description: "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) ).",
      optional: true,
    },
    page: {
      type: "string",
      description: "Up to 100 invoices will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs: https://developer.xero.com/documentation/api/invoices#get

    if (!this.tenant_id) {
      throw new Error("Must provide tenant_id parameter.");
    }

    const invoiceIdentifier = this.invoice_identifier || "";

    var headers = {
      "Authorization": `Bearer ${this.xero_accounting_api.$auth.oauth_access_token}`,
      "xero-tenant-id": this.tenant_id,
    };

    if (this.modified_after) {
      headers["If-Modified-Since"] = this.modified_after;
    }

    return await axios($, {
      url: `https://api.xero.com/api.xro/2.0/Invoices/${invoiceIdentifier}`,
      headers,
      params: {
        IDs: this.ids,
        InvoiceNumbers: this.invoice_numbers,
        ContactIDs: this.contact_ids,
        Statuses: this.statuses,
        Where: this.where,
        createdByMyApp: this.created_by_my_app,
        order: this.order,
        page: this.page,
      },
    });
  },
};
