import base from "../common/s3.mjs";
import includeLink from "../common/include-link.mjs";

export default {
  ...base,
  type: "source",
  key: "aws-s3-restored-file",
  name: "New Restored S3 File",
  description: "Emit new event when a file is restored into an S3 bucket",
  version: "0.2.0",
  dedupe: "unique",
  props: {
    info: {
      type: "alert",
      alertType: "info",
      content: "Allows receipt of notifications for event initiation and completion when restoring objects from the **S3 Glacier Flexible Retrieval** storage class, **S3 Glacier Deep Archive** storage class, **S3 Intelligent-Tiering Archive Access tier**, and **S3 Intelligent-Tiering Deep Archive Access tier**.",
    },
    ...base.props,
    detectRestoreInitiation: {
      type: "boolean",
      label: "Detect Restore Initiation",
      description: "When enabled, this event source will also emit events whenever a restore is initiated",
      default: false,
    },
    ...includeLink.props,
  },
  methods: {
    ...base.methods,
    ...includeLink.methods,
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
