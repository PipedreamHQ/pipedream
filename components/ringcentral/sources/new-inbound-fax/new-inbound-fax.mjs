import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "ringcentral-new-inbound-fax",
  name: "New Inbound Fax (Instant)",
  description: "Emit new event on each incoming fax",
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
        "ringcentral-inbound-fax-event",
      ]);
    },
    getPropValues() {
      return {
        extensionId: this.extensionId,
      };
    },
    generateMeta(data) {
      const {
        body: eventDetails,
        timestamp,
        uuid: id,
      } = data;
      const { from: { phoneNumber: callerPhoneNumber } } = eventDetails;

      const maskedCallerNumber = this.getMaskedNumber(callerPhoneNumber);
      const summary = `New inbound fax from ${maskedCallerNumber}`;
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
