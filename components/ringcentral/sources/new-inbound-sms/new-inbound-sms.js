const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "ringcentral-new-inbound-sms",
  name: "New Inbound SMS (Instant)",
  description: "Emits an event on each incoming SMS",
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
        body: eventDetails,
        timestamp,
        uuid: id,
      } = data;
      const {
        from: {
          phoneNumber: senderPhoneNumber,
        },
      } = eventDetails.parties[0];

      const maskedCallerNumber = this.getMaskedNumber(senderPhoneNumber);
      const summary = `New inbound SMS from ${maskedCallerNumber}`;
      const ts = Date.parse(timestamp);

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
