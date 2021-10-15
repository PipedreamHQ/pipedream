const {
  props,
  methods,
  ...base
} = require("../common/s3");

module.exports = {
  ...base,
  type: "source",
  key: "aws-restored-s3-file",
  name: "New S3 File Restored",
  description: "Emit new S3 file restored event",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...props,
    detectRestoreInitiation: {
      type: "boolean",
      label: "Detect Restore Initiation",
      description: "When enabled, this event source will also emit events whenever a restore is initiated",
      default: false,
    },
  },
  methods: {
    ...methods,
    getEvents() {
      return [
        this.detectRestoreInitiation
          ? "s3:ObjectRestore:*"
          : "s3:ObjectRestore:Completed",
      ];
    },
    generateMeta(data) {
      const { "x-amz-request-id": id } = data.responseElements;
      const { key } = data.s3.object;
      const { eventTime: isoTimestamp } = data;
      return {
        id,
        summary: `Restored file: '${key}'`,
        ts: Date.parse(isoTimestamp),
      };
    },
  },
};
