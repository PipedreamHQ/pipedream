import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "ringcentral-new-inbound-call",
  name: "New Inbound Call (Instant)",
  description: "Emit new event on each incoming call",
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
        "ringcentral-extension-telephony-sessions-event-inbound-call",
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
      const summary = `New inbound call from ${maskedCallerNumber}`;
      const ts = Date.parse(timestamp);

      return {
        id,
        summary,
        ts,
      };
    },
    isEventRelevant(event) {
      const { body: eventDetails } = event.body;
      const { status: { code: statusCode } } = eventDetails.parties[0];
      return [
        "Setup",
        "Proceeding",
        "Answered",
      ].includes(statusCode);
    },
  },
};
