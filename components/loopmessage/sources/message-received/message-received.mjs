import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "loopmessage-message-received",
  name: "Message Received",
  description: "Trigger when a new message is received on LoopMessage platform. [See the documentation](https://docs.loopmessage.com/lookup-api/lookup/send-message#send-single-request)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(resource) {
      return {
        id: resource.message_id,
        summary: `New Message: ${resource.message_id}`,
        ts: Date.now(),
      };
    },
  },
};
