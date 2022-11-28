import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "ringcentral-missed-inbound-call",
  name: "New Missed Inbound Call (Instant)",
  description: "Emit new event each time an incoming call is missed",
  version: "0.1.2",
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
        "ringcentral-extension-telephony-sessions-event-missed-inbound-call",
        "ringcentral-account-telephony-sessions-event-missed-inbound-call",
      ]);
    },
    getPropValues() {
      return {
        extensionId: this.extensionId,
      };
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
