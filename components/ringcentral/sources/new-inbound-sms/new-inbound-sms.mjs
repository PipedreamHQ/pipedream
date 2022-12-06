import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "ringcentral-new-inbound-sms",
  name: "New Inbound SMS (Instant)",
  description: "Emit new event on each incoming SMS",
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
  },
  methods: {
    ...common.methods,
    getSupportedNotificationTypes() {
      return new Set([
        "ringcentral-instant-message-event",
      ]);
    },
    getPropValues() {
      return {
        extensionId: this.extensionId,
      };
    },
    generateMeta(data) {
      const {
        uuid: id,
        body: eventDetails,
        timestamp,
      } = data;
      const ts = Date.parse(timestamp);

      const { from: { phoneNumber: senderPhoneNumber } } = eventDetails;
      const maskedCallerNumber = this.getMaskedNumber(senderPhoneNumber);
      const summary = `New inbound SMS from ${maskedCallerNumber}`;

      return {
        id,
        summary,
        ts,
      };
    },
    isEventRelevant(event) {
      const { body: eventDetails } = event.body;
      const { messageStatus } = eventDetails;
      return messageStatus === "Received";
    },
  },
};
