const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "ringcentral-missed-inbound-call",
  name: "New Missed Inbound Call (Instant)",
  description: "Emit new event each time an incoming call is missed",
  version: "0.0.1",
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
        "extension-telephony-sessions-event-missed-inbound-call",
      ]);
    },
    generateMeta(data) {
      const {
        timestamp,
        body: eventDetails,
      } = data;
      const { telephonySessionId: id } = eventDetails;
      const { from: { phoneNumber: callerPhoneNumber } } = eventDetails.parties[0];

      const maskedCallerNumber = this.getMaskedNumber(callerPhoneNumber);
      const summary = `Missed inbound call from ${maskedCallerNumber}`;
      const ts = Date.parse(timestamp);

      return {
        id,
        summary,
        ts,
      };
    },
  },
};
