import common from "../common/common.mjs";

export default {
  ...common,
  key: "google_ads-create-report",
  name: "Create Report",
  description: "Generates a report from your Google Ads data. [See the documentation](https://developers.google.com/google-ads/api/fields/v16/overview)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
  },
  async run({ $ }) {
    // const updateMask = [
    //   "name",
    //   "description",
    //   ...Object.keys(this.additionalFields ?? {}),
    // ].filter((key) => this[key] !== undefined);
    const response = await this.googleAds.createReport({
      $,
      accountId: this.accountId,
      customerClientId: this.customerClientId,
    });

    $.export("$summary", `Created report with ID ${response.id}`);
    return response;
  },
};
