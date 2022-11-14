import common from "../common/http-based.mjs";
import messageTypes from "../common/message-types.mjs";

export default {
  ...common,
  key: "ringcentral-new-outbound-message",
  name: "New Outbound Message Event (Instant)",
  description: "Emit new event for each outbound message status update",
  version: "0.1.1",
  type: "source",
  props: {
    ...common.props,
    extensionId: {
      propDefinition: [
        common.props.ringcentral,
        "extensionId",
      ],
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of message to monitor for status changes",
      options: messageTypes,
    },
  },
  methods: {
    ...common.methods,
    getSupportedNotificationTypes() {
      return new Set([
        "ringcentral-message-event-inbound",
      ]);
    },
    getPropValues() {
      return {
        extensionId: this.extensionId,
        messageType: this.messageType,
      };
    },
    generateMeta(data) {
      const {
        timestamp,
        uuid: id,
      } = data;
      const summary = "New outbound message event";
      const ts = Date.parse(timestamp);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
