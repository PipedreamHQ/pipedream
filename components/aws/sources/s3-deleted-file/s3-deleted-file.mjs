import base from "../common/s3.mjs";

export default {
  ...base,
  type: "source",
  key: "aws-s3-deleted-file",
  name: "New Deleted S3 File",
  description: "Emit new event when a file is deleted from a S3 bucket",
  version: "0.1.5",
  dedupe: "unique",
  props: {
    ...base.props,
    ignoreDeleteMarkers: {
      type: "boolean",
      label: "Ignore Delete Markers",
      description: "When ignoring delete markers this will only emit events for permanently deleted files",
      default: false,
    },
  },
  methods: {
    ...base.methods,
    getEvents() {
      return [
        this.ignoreDeleteMarkers
          ? "s3:ObjectRemoved:Delete"
          : "s3:ObjectRemoved:*",
      ];
    },
    generateMeta(data) {
      const { "x-amz-request-id": id } = data.responseElements;
      const { key } = data.s3.object;
      const { eventTime: isoTimestamp } = data;
      return {
        id,
        summary: `Deleted file: '${key}'`,
        ts: Date.parse(isoTimestamp),
      };
    },
  },
};
