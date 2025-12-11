import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "callrail-phone-call-started-instant",
  name: "Phone Call Started (Instant)",
  description: "Emit new event when an  inbound phone call is received by CallRail. It contains the full data about the call.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "**Note: Your server will receive the call information before the call is connected, allowing you to develop real-time systems for your representatives, such as screen-pops or CRM database lookups.**",
    },
  },
  methods: {
    ...common.methods,
    getConfigs(endpoint) {
      return {
        pre_call_webhook: [
          endpoint,
        ],
      };
    },
    getSummary(details) {
      return `A new phone call with ID ${details.id} has been received by CallRail`;
    },
  },
  sampleEmit,
};
