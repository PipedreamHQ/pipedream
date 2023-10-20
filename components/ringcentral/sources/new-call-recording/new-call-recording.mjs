import common from "../common/timer-based.mjs";

export default {
  ...common,
  key: "ringcentral-new-call-recording",
  name: "New Call Recording",
  description: "Emit new events when a call recording is created",
  type: "source",
  version: "0.1.5",
  props: {
    ...common.props,
    extensionId: {
      propDefinition: [
        common.props.ringcentral,
        "extensionId",
      ],
      type: "string",
      label: "Extension",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(data) {
      const {
        id,
        startTime: timestamp,
        direction,
      } = data;
      const ts = Date.parse(timestamp);

      const { phoneNumber } = direction === "Outbound"
        ? data.to
        : data.from;
      const maskedPhoneNumber = this.getMaskedNumber(phoneNumber);
      const summary = `New call recording (${maskedPhoneNumber})`;

      return {
        id,
        summary,
        ts,
      };
    },
    async processEvent(opts) {
      const {
        dateFrom,
        dateTo,
      } = opts;

      const callRecordingsScan = this.ringcentral.getCallRecordings(
        this.extensionId,
        dateFrom,
        dateTo,
      );
      for await (const record of callRecordingsScan) {
        const meta = this.generateMeta(record);
        this.$emit(record, meta);
      }
    },
  },
};
