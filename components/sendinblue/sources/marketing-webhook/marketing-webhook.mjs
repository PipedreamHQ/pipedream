import common from "../common-webhook.mjs";
import options from "../../common/options.mjs";

export default {
  ...common,
  key: "sendinblue-marketing-webhook",
  name: "New Marketing Webhook (Instant)",
  description: "Emit new event when triggered by a marketing event",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    description: {
      type: "string",
      label: "Description",
      description: "Description of the webhook.",
    },
    events: {
      type: "string[]",
      label: "Events",
      description: "Events triggering the webhook.",
      options: options.marketingEventOptions,
    },
  },
  methods: {
    ...common.methods,
    getEventNames() {
      return this.events;
    },
    getHookDescription() {
      return this.description;
    },
    getEventType() {
      return "marketing";
    },
    generateMeta(body) {
      const meta = {
        ...body,
      };
      return meta;
    },
  },
};
