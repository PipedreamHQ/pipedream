import common from "../../common/common-dynamodb-streams.mjs";

export default {
  ...common,
  key: "aws-new-dynamodb-stream-event",
  name: "New DynamoDB Stream Event",
  description: "Emit new event when a DynamoDB stream receives new events. [See the docs here](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_streams_GetRecords.html)",
  type: "source",
  version: "0.0.5",
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
      const {
        stream,
        _getShardIterators,
        _setShardIterators,
        listShards,
        getShardIterator,
      } = this;

      const shardIterators = _getShardIterators();

      const { StreamDescription: streamDescription } = await listShards({
        StreamArn: stream,
        Limit: 100,
      });

      if (streamDescription?.Shards?.length === 0) {
        throw new Error("No shards found in stream");
      }

      const activeShards =
        streamDescription.Shards
          .filter((shard) => !shard.SequenceNumberRange.EndingSequenceNumber);

      if (activeShards.length === 0) {
        throw new Error("No active shards found");
      }

      const shardIds = activeShards.map(({ ShardId }) => ShardId);

      for (const shardId of shardIds) {
        const { ShardIterator: shardIterator } = await getShardIterator({
          ShardId: shardId,
          StreamArn: stream,
          ShardIteratorType: "LATEST",
        });
        shardIterators[shardId] = shardIterator;
      }

      _setShardIterators(shardIterators);
    },
  },
  methods: {
    ...common.methods,
    _getShardIterators() {
      return this.db.get("shardIterators") || {};
    },
    _setShardIterators(value) {
      this.db.set("shardIterators", value);
    },
    generateMeta({
      eventID, eventName, dynamodb,
    }) {
      return {
        id: eventID,
        summary: `New Event: ${eventName}`,
        ts: Date.parse(dynamodb.ApproximateCreationDateTime),
      };
    },
  },
  async run() {
    const {
      stream,
      isStreamEnabled,
      _getShardIterators,
      _setShardIterators,
      getRecords,
      generateMeta,
    } = this;

    if (!(await isStreamEnabled(stream))) {
      throw new Error("Stream is no longer enabled.");
    }

    const shardIterators = _getShardIterators();

    for (const [
      shardId,
      shardIterator,
    ] of Object.entries(shardIterators)) {
      if (!shardIterator) {
        continue;
      }

      const {
        Records: records,
        NextShardIterator: nextShardIterator,
      } = await getRecords({
        ShardIterator: shardIterator,
        Limit: 100,
      });

      for (const record of records) {
        const meta = generateMeta(record);
        this.$emit(record, meta);
      }

      shardIterators[shardId] = nextShardIterator;
    }

    _setShardIterators(shardIterators);
  },
};
