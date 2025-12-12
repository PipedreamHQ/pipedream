import xeroAccountingApi from "../../xero_accounting_api.app.mjs";

export default {
  key: "xero_accounting_api-list-tracking-categories",
  name: "List tracking categories",
  description: "Lists information from tracking categories [See the documentation](https://developer.xero.com/documentation/api/accounting/trackingcategories).",
  version: "0.0.3",
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
  },
  async run({ $ }) {
    try {
      const response = await this.xeroAccountingApi.getTrackingCategories({
        $,
        tenantId: this.tenantId,
      });

      $.export("$summary", `Successfully fetched ${response.TrackingCategories.length} tracking categories`);
      return response;
    } catch (e) {
      $.export("$summary", "No tracking categories found");
      return {};
    }
  },
};
