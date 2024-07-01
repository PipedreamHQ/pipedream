import common from "../common/common.mjs";
import { campaign } from "../../common/resources/campaign.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "google_ads-new-campaign-created",
  name: "New Campaign Created",
  description: "Emit new event when a new campaign is created. [See the documentation](https://developers.google.com/google-ads/api/fields/v16/campaign)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  props: {
    ...common.props,
    customerClientId: {
      ...common.props.customerClientId,
      optional: false,
    },
    fields: {
      type: "string[]",
      label: "Extra Fields",
      description: "Additional [campaign fields](https://developers.google.com/google-ads/api/fields/v16/campaign) to emit in the event",
      options: campaign.fields,
      optional: true,
      default: [
        "campaign.id",
        "campaign.name",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary({ name }) {
      return `New Campaign: "${name}"`;
    },
    async getItems(savedIds) {
      const {
        accountId, customerClientId, fields,
      } = this;
      const items = await this.googleAds.listCampaigns({
        accountId,
        customerClientId,
        query: {
          fields,
          savedIds,
        },
      });
      return items?.map(({ campaign }) => campaign);
    },
  },
};
