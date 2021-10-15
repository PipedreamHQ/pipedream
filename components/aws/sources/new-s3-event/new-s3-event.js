const aws = require("../../aws.app.js");
const {
  props,
  methods,
  ...base
} = require("../common/s3");

module.exports = {
  ...base,
  type: "source",
  key: "aws-new-s3-event",
  name: "New S3 Event",
  description: "Emit new S3 events for a given bucket",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...props,
    eventTypes: {
      propDefinition: [
        aws,
        "eventTypes",
      ],
    },
  },
  methods: {
    ...methods,
    getEvents() {
      return this.eventTypes;
    },
    generateMeta(data) {
      const { "x-amz-request-id": id } = data.responseElements;
      const { key } = data.s3.object;
      const {
        eventTime: isoTimestamp,
        eventName,
      } = data;
      return {
        id,
        summary: `New event '${eventName}' for '${key}'`,
        ts: Date.parse(isoTimestamp),
      };
    },
  },
};
