import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-get-tracking-category",
  name: "Get tracking category",
  description: "Get information from a tracking category by ID [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories#get-trackingcategories).",
  version: "0.0.1",
  type: "action",
  props: {
    xeroAccountingApi,
    tenantId: {
      propDefinition: [
        xeroAccountingApi,
        "tenantId",
      ],
    },
    trackingCategoryId: {
      propDefinition: [
        xeroAccountingApi,
        "trackingCategoryId",
        ({ tenantId }) => ({
          tenantId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xeroAccountingApi.getTrackingCategory({
      $,
      tenantId: this.tenantId,
      trackingCategoryId: this.trackingCategoryId,
    });

    $.export("$summary", `Successfully fetched tracking category with ID: ${this.trackingCategoryId}`);
    return response;
  },
};
