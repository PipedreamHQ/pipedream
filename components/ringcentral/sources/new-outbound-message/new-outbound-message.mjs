import common from "../common/http-based.mjs";
import messageTypes from "../common/message-types.mjs";

export default {
  ...common,
  key: "ringcentral-new-outbound-message",
  name: "New Outbound Message Event (Instant)",
  description: "Emit new event for each outbound message event. This only includes the event, not the actual message.",
  version: "0.1.3",
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
        "ringcentral-message-event-outbound",
      ]);
    },
    getPropValues() {
      return {
        extensionId: this.extensionId,
        messageType: this.messageType,
      };
    },
    async emitEvent(event) {
      const { body } = event

      const message = await this.ringcentral.getMessage({
        $,
        extensionId: this.extensionId,
        messageId: body.uuid,
      });

      this.$emit(message, {
        id: body.uuid,
        summary: `New outbound message received with ID ${body.uuid}`,
        ts: Date.parse(body.timestamp)
      })
    },
  },
};
