import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sendloop-new-email-opened",
  name: "New Email Opened",
  description: "Emit new event when a subscriber opens an email.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.sendloop,
        "campaignId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.sendloop.listEmailOpens;
    },
    getResourceType() {
      return "Data";
    },
    getData() {
      return {
        CampaignID: this.campaignId,
      };
    },
    generateMeta(data) {
      return {
        id: data.SubscriberID,
        summary: `New Email Open: ${data.SubscriberID}`,
        ts: Date.parse(data.OpenDate),
      };
    },
  },
  sampleEmit,
};
