const aws = require("../../aws.app.js");

const {
  props,
  methods,
  ...base
} = require("../common/s3");

module.exports = {
  ...base,
  type: "source",
  key: "aws-deleted-s3-file",
  name: "New S3 File Deleted",
  description: "Emit new event whenever a file is deleted from an S3 bucket",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...props,
    ignoreDeleteMarkers: {
      propDefinition: [
        aws,
        "ignoreDeleteMarkers",
      ],
      default: false,
    },
  },
  methods: {
    ...methods,
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
