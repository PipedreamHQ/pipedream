import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "sendloop-new-hard-bounce",
  name: "New Hard Bounce",
  description: "Emit new event when a subscriber's status changes to 'hard bounce'.",
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
      return this.sendloop.listBounces;
    },
    getResourceType() {
      return "Data";
    },
    getData() {
      return {
        CampaignID: this.campaignId,
      };
    },
    isRelevant(data) {
      return data.BounceType === "Hard";
    },
    generateMeta(subscriber) {
      return {
        id: subscriber.SubscriberID,
        summary: `New Hard Bounce: ${subscriber.EmailAddress}`,
        ts: Date.now(),
      };
    },
  },
  sampleEmit,
};
