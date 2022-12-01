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

      for(const messageId of body.changes[0].newMessageIds){
        const message = await this.ringcentral.getMessage({
          $,
          accountId: body.accountId,
          extensionId: body.extensionId,
          messageId,
        });
  
        this.$emit(message, {
          id: message.id,
          summary: `New inbound message received with ID ${message.id}`,
          ts: Date.parse(body.lastUpdated),
        })
      }
    },
  },
};
