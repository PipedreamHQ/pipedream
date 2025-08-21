import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-manual-journals",
  name: "List Manual Journals",
  description: "Lists information from manual journals in the given tenant id as per filter parameters.",
  version: "0.2.0",
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
      description: "The ModifiedAfter filter is actually an HTTP header: **'If-Modified-Since'**. A UTC timestamp (yyyy-mm-ddThh:mm:ss) . Only manual journals created or modified since this timestamp will be returned e.g. 2009-11-12T00:00:00",
      optional: true,
    },
    where: {
      label: "Where",
      type: "string",
      description: "Filter by an any element (*see [Filters](https://developer.xero.com/documentation/api/requests-and-responses#get-modified)*)",
      optional: true,
    },
    order: {
      label: "Order",
      type: "string",
      description: "Order by any element returned (*see [Order By](https://developer.xero.com/documentation/api/requests-and-responses#ordering)*)",
      optional: true,
    },
    page: {
      label: "Page",
      type: "string",
      description: "Up to 100 manual journals will be returned per call, with journal lines shown for each, when the page parameter is used e.g. page=1",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.listManualJournals({
        $,
        tenantId: this.tenantId,
        modifiedSince: this.modifiedAfter,
        params: {
          Where: this.where,
          order: this.order,
          page: this.page,
        },
      });

      $.export("$summary", `Successfully fetched ${response.ManualJournals.length} manual journals`);
      return response;
    } catch (e) {
      $.export("$summary", "No manual journals found");
      return {};
    }
  },
};
