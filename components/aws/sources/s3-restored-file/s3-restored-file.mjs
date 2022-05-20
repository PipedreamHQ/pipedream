import base from "../common/s3.mjs";

export default {
  ...base,
  type: "source",
  key: "aws-s3-restored-file",
  name: "New Restored S3 File",
  description: "Emit new event when an file is restored into a S3 bucket",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...base.props,
    detectRestoreInitiation: {
      type: "boolean",
      label: "Detect Restore Initiation",
      description: "When enabled, this event source will also emit events whenever a restore is initiated",
      default: false,
    },
  },
  methods: {
    ...base.methods,
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
