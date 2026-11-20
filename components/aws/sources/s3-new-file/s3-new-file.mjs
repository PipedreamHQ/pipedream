import base from "../common/s3.mjs";
import includeLink from "../common/include-link.mjs";

export default {
  ...base,
  type: "source",
  key: "aws-s3-new-file",
  name: "New S3 File",
  description: "Emit new event when a file is added to an S3 bucket",
  version: "0.2.1",
  dedupe: "unique",
  props: {
    ...base.props,
    ...includeLink.props,
  },
  methods: {
    ...base.methods,
    ...includeLink.methods,
    getEvents() {
      return [
        "s3:ObjectCreated:*",
      ];
    },
    generateMeta(data) {
      const { "x-amz-request-id": id } = data.responseElements;
      const { key } = data.s3.object;
      const { eventTime: isoTimestamp } = data;
      return {
        id,
        summary: `New file: '${key}'`,
        ts: Date.parse(isoTimestamp),
      };
    },
  },
};
