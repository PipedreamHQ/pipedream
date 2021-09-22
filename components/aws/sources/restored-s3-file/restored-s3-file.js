const { props, methods, ...base } = require("../common/s3");

module.exports = {
  ...base,
  key: "aws-restored-s3-file",
  name: "Restored S3 File",
  description: "Emits and event whenever a file is restored into an S3 bucket",
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
