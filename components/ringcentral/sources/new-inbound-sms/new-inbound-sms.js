const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "ringcentral-new-inbound-sms",
  name: "New Inbound SMS (Instant)",
  description: "Emits an event on each incoming SMS",
  version: "0.0.1",
  props: {
    ...common.props,
    extensionId: { propDefinition: [common.props.ringcentral, "extensionId"] },
  },
  methods: {
    ...common.methods,
    getSupportedNotificationTypes() {
      return new Set([
        "instant-message-event",
      ]);
    },
    generateMeta(data) {
      const {
        uuid: id,
        body: eventDetails,
        timestamp,
      } = data;
      const ts = Date.parse(timestamp);

      const {
        from: {
          phoneNumber: senderPhoneNumber,
        },
      } = eventDetails;
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
