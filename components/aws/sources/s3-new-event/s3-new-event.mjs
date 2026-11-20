import base from "../common/s3.mjs";

export default {
  ...base,
  type: "source",
  key: "aws-s3-new-event",
  name: "New S3 Event",
  description: "Emit new S3 events for a given bucket",
  version: "0.1.5",
  dedupe: "unique",
  props: {
    ...base.props,
    eventTypes: {
      type: "string[]",
      label: "Event Types",
      description: "The type of events to watch",
      options: [
        // See the AWS docs for more information about the supported events emitted by S3: https://amzn.to/3AtmKy1
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
    ...base.methods,
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
        summary: `'${eventName}' for '${key}'`,
        ts: Date.parse(isoTimestamp),
      };
    },
  },
};
