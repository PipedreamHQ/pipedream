import common from "../common/http-based.mjs";
import messageTypes from "../common/message-types.mjs";

export default {
  ...common,
  key: "ringcentral-new-inbound-message",
  name: "New Inbound Message Event (Instant)",
  description: "Emit new event for each status change of inbound messages of a specific type",
  version: "0.1.4",
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
    async emitEvent(event) {
      const { body } = event

      const message = await this.ringcentral.getMessage({
        $,
        extensionId: this.extensionId,
        messageId: body.uuid,
      });

      this.$emit(message, {
        id: body.uuid,
        summary: `New inbound message received with ID ${body.uuid}`,
        ts: Date.parse(body.timestamp)
      })
    },
  },
};
