import common from "../common/common.mjs";
import { campaign } from "../../common/resources/campaign.mjs";

export default {
  ...common,
  key: "google_ads-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event when a new campaign is created. [See the documentation](https://developers.google.com/google-ads/api/fields/v16/campaign)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fields: {
      type: "string[]",
      label: "Extra Fields",
      description: "Additional [campaign fields](https://developers.google.com/google-ads/api/fields/v16/campaign) to emit in the event",
      options: campaign.fields,
      optional: true,
      default: [
        "id",
        "name",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary() {
      return "New Campaign";
    },
    getItems() {
      // const {
      //   accountId, customerClientId, fields,
      // } = this;
      // return this.googleAds.getLeadFormData({
      //   accountId,
      //   customerClientId,
      //   leadFormId,
      // });
    },
  },
};
