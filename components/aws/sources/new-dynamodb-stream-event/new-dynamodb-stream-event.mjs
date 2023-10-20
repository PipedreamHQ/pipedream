import common from "../../common/common-dynamodb-streams.mjs";

export default {
  ...common,
  key: "aws-new-dynamodb-stream-event",
  name: "New DynamoDB Stream Event",
  description: "Emit new event when a DynamoDB stream receives new events. [See the docs here](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_GetRecords.html)",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    stream: {
      type: "string",
      label: "Stream",
      description: "ARN of the Stream to watch for new events",
      async options({ prevContext }) {
        const {
          streams,
          lastEvaluatedStreamArn,
        } = await this.listEnabledStreams({
          ExclusiveStartStreamArn: prevContext.lastEvaluatedStreamArn,
        });
        const options = streams.map((stream) => ({
          label: `${stream.TableName} - Created ${stream.StreamLabel}`,
          value: stream.StreamArn,
        }));
        return {
          options,
          context: {
            lastEvaluatedStreamArn,
          },
        };
      },
    },
  },
  hooks: {
    async deploy() {
      const { StreamDescription: streamDescription } = await this.listShards({
        StreamArn: this.stream,
      });
      const shardId = streamDescription.Shards[streamDescription.Shards.length - 1].ShardId;
      const { ShardIterator: shardIterator } = await this.getShardIterator({
        ShardId: shardId,
        StreamArn: this.stream,
        ShardIteratorType: "LATEST",
      });
      this._setShardIterator(shardIterator);
    },
  },
  methods: {
    ...common.methods,
    _getShardIterator() {
      return this.db.get("shardIterator");
    },
    _setShardIterator(shardIterator) {
      this.db.set("shardIterator", shardIterator);
    },
    generateMeta({
      eventID, eventName, dynamodb,
    }) {
      return {
        id: eventID,
        summary: `New ${eventName} event`,
        ts: Date.parse(dynamodb.ApproximateCreationDateTime),
      };
    },
  },
  async run() {
    if (!(await this.isStreamEnabled(this.stream))) {
      throw new Error("Stream is no longer enabled.");
    }

    const shardIterator = this._getShardIterator();

    const {
      Records: records, NextShardIterator: nextShardIterator,
    } = await this.getRecords({
      ShardIterator: shardIterator,
    });

    for (const record of records) {
      const meta = this.generateMeta(record);
      this.$emit(record, meta);
    }

    this._setShardIterator(nextShardIterator);
  },
};
