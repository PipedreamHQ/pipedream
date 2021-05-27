const base = require("../common/s3");

module.exports = {
  ...base,
  key: "aws-deleted-s3-file",
  name: "Deleted S3 File",
  description: "Emits and event whenever a file is deleted from an S3 bucket",
  version: "0.0.1",
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
