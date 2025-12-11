import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "callrail-phone-call-completed-instant",
  name: "Phone Call Completed (Instant)",
  description: "Emit new event when an inbound phone call has completed and its recording and transcription have completed and attached. It contains the full data about the call.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "**Note: This webhook should not be expected to be real-time, and has a maximum delay of 20 minutes after the hangup before it fires. The Post-Call Webhook will wait until recording, transcription, and call summaries (when applicable) have attached to the call before firing. This event has a maximum timeout of 20 minutes, at which time it will fire even if recording-related data is missing.**",
    },
  },
  methods: {
    ...common.methods,
    getConfigs(endpoint) {
      return {
        post_call_webhook: [
          endpoint,
        ],
      };
    },
    getSummary(details) {
      return `A new phone call with ID ${details.id} successfully completed`;
    },
  },
  sampleEmit,
};
