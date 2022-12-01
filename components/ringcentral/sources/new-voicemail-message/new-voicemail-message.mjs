import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "ringcentral-new-voicemail-message",
  name: "New Voicemail Message (Instant)",
  description: "Emit new event when a new voicemail message is received",
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
        "ringcentral-voicemail-message-event",
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
        timestamp,
        body: eventDetails,
      } = data;
      const { from: { phoneNumber: callerPhoneNumber } } = eventDetails;

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
