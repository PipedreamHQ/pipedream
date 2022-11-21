import common from "../common/http-based.mjs";
import messageTypes from "../common/message-types.mjs";

export default {
  ...common,
  key: "ringcentral-new-inbound-message",
  name: "New Inbound Message Event (Instant)",
  description: "Emit new event for each status change of inbound messages of a specific type",
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
      const summary = "New inbound message event";
      const ts = Date.parse(timestamp);
      return {
        id,
        summary,
        ts,
      };
    },
  },
};
