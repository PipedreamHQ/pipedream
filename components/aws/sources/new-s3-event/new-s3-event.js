const { props, methods, ...base } = require("../common/s3");

module.exports = {
  ...base,
  key: "aws-new-s3-event",
  name: "New S3 Event",
  description: "Captures and emits a collection of S3 events for a given bucket",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The type of events to watch",
      options: [
        // See the AWS docs for more information about the supported events
        // emitted by S3: https://amzn.to/3AtmKy1
        "s3:ObjectCreated:Put",
        "s3:ObjectCreated:Post",
        "s3:ObjectCreated:Copy",
        "s3:ObjectCreated:CompleteMultipartUpload",
        "s3:ObjectRemoved:Delete",
        "s3:ObjectRemoved:DeleteMarkerCreated",
        "s3:ObjectRestore:Post",
        "s3:ObjectRestore:Completed",
        "s3:ReducedRedundancyLostObject",
        "s3:Replication:OperationFailedReplication",
        "s3:Replication:OperationMissedThreshold",
        "s3:Replication:OperationReplicatedAfterThreshold",
        "s3:Replication:OperationNotTracked",
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
