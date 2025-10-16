import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-credit-notes",
  name: "List Credit Notes",
  description: "Lists information from credit notes in the given tenant id as per filter parameters.",
  version: "0.2.1",
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
    try {
      const response = await this.xeroAccountingApi.listCreditNotes({
        $,
        tenantId: this.tenantId,
        modifiedSince: this.modifiedAfter,
        params: {
          Where: this.where,
          order: this.order,
          page: this.page,
        },
      });

      $.export("$summary", `Successfully fetched ${response.CreditNotes.length} credit notes`);
      return response;
    } catch (e) {
      $.export("$summary", "No credit notes found");
      return {};
    }
  },
};
