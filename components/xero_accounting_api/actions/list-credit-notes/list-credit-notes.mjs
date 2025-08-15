import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-credit-notes",
  name: "List Credit Notes",
  description: "Lists information from credit notes in the given tenant id as per filter parameters.",
  version: "0.1.2",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    creditNoteIdentifier: {
      label: "Credit Note Identifier",
      type: "string",
      description: "Credit note identifier of the contact to get. Possible values: \n* **CreditNoteID** - The Xero identifier for a contact note e.g. 297c2dc5-cc47-4afd-8ec8-74990b8761e9\n* **CreditNoteNumber** -  Identifier for Credit Note CN-8743802",
      optional: true,
    },
    modifiedAfter: {
      label: "Modified After",
      type: "string",
      description: "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'.**\nA UTC timestamp (yyyy-mm-ddThh:mm:ss). Only credit notes or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
      optional: true,
    },
    where: {
      label: "Where",
      type: "string",
      description: "Filter by an any element ( see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified) )",
      optional: true,
    },
    order: {
      label: "Order",
      type: "string",
      description: "Order by any element returned ( see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering) )",
      optional: true,
    },
    page: {
      label: "Page",
      type: "string",
      description: "Up to 100 credit notes will be returned per call, with line items shown for each, when the page parameter is used e.g. page=1",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.xeroAccountingApi.listCreditNotes({
      $,
      tenantId: this.tenantId,
      creditNoteIdentifier: this.creditNoteIdentifier,
      modifiedAfter: this.modifiedAfter,
      params: {
        Where: this.where,
        order: this.order,
        page: this.page,
      },
    });

    $.export("$summary", `Successfully fetched credit notes with ID: ${this.creditNoteIdentifier}`);
    return response;
  },
};
