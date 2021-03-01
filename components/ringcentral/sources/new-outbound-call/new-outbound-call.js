const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "ringcentral-new-outbound-call",
  name: "New Outbound Call (Instant)",
  description: "Emits an event on each outgoing call",
  version: "0.0.1",
  props: {
    ...common.props,
    extensionId: { propDefinition: [common.props.ringcentral, "extensionId"] },
  },
  methods: {
    ...common.methods,
    getSupportedNotificationTypes() {
      return new Set([
        "extension-telephony-sessions-event-outbound-call",
      ]);
    },
    generateMeta(data) {
      const {
        timestamp,
        body: eventDetails,
      } = data;
      const {
        telephonySessionId: id,
      } = eventDetails;
      const {
        to: {
          phoneNumber: calleePhoneNumber,
        },
      } = eventDetails.parties[0];

      const maskedCallerNumber = this.getMaskedNumber(calleePhoneNumber);
      const summary = `New outbound call to ${maskedCallerNumber}`;
      const ts = Date.parse(timestamp);

      return {
        id,
        summary,
        ts,
      };
    },
    isEventRelevant(event) {
      const { body: eventDetails } = event.body;
      const {
        status: { code: statusCode }
      } = eventDetails.parties[0];
      return statusCode === "Proceeding";
    },
  },
};
