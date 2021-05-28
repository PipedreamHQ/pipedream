const common = require("../common/http-based");
const messageTypes = require("../common/message-types");

module.exports = {
  ...common,
  key: "ringcentral-new-inbound-message-event",
  name: "New Inbound Message Event (Instant)",
  description: "Emits an event for each status change of inbound messages of a specific type",
  version: "0.0.1",
  props: {
    ...common.props,
    extensionId: { propDefinition: [common.props.ringcentral, "extensionId"] },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The type of message to monitor for status changes",
      options({ page = 0}) {
        return page === 0 ? messageTypes : [];
      },
    },
  },
  methods: {
    ...common.methods,
    getSupportedNotificationTypes() {
      return new Set([
        "message-event-inbound",
      ]);
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
