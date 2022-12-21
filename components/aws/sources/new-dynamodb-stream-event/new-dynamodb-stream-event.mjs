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
          Streams,
          LastEvaluatedStreamArn,
        } = await this.listStreams({
          ExclusiveStartStreamArn: prevContext.lastEvaluatedStreamArn,
        });
        const options = Streams.map((stream) => ({
          label: stream.TableName,
          value: stream.StreamArn,
        }));
        return {
          options,
          context: {
            lastEvaluatedStreamArn: LastEvaluatedStreamArn,
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
