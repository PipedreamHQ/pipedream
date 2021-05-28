const common = require("../common/http-based");

module.exports = {
  ...common,
  key: "ringcentral-new-voicemail-message",
  name: "New Voicemail Message (Instant)",
  description: "Emits an event when a new voicemail message is received",
  version: "0.0.1",
  props: {
    ...common.props,
    extensionId: { propDefinition: [common.props.ringcentral, "extensionId"] },
  },
  methods: {
    ...common.methods,
    getSupportedNotificationTypes() {
      return new Set([
        "voicemail-message-event",
      ]);
    },
    generateMeta(data) {
      const {
        uuid: id,
        timestamp,
        body: eventDetails,
      } = data;
      const {
        from: {
          phoneNumber: callerPhoneNumber,
        },
      } = eventDetails;

      const maskedCallerNumber = this.getMaskedNumber(callerPhoneNumber);
      const summary = `New voicemail from ${maskedCallerNumber}`;
      const ts = Date.parse(timestamp);

      return {
        id,
        summary,
        ts,
      };
    },
  },
};
