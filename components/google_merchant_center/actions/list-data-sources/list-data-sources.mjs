import googleMerchant from "../../google_merchant_center.app.mjs";

export default {
  key: "google_merchant_center-list-data-sources",
  name: "List Data Sources",
  description: "Lists the data sources in your Google Merchant Center account. Use it to find the **Data Source ID** for creating or updating products. [See the documentation](https://developers.google.com/merchant/api/reference/rest/datasources_v1/accounts.dataSources/list)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  ai: "optimized",
  type: "action",
  props: {
    googleMerchant,
  },
  async run({ $ }) {
    const dataSources = await this.googleMerchant.listAllDataSources({
      $,
    });
    $.export("$summary", `Successfully retrieved ${dataSources.length} data source${dataSources.length === 1
      ? ""
      : "s"}`);
    return dataSources;
  },
};
