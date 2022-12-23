import aws from "../aws.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import {
  DynamoDBStreamsClient,
  DescribeStreamCommand,
  GetRecordsCommand,
  GetShardIteratorCommand,
  ListStreamsCommand,
} from "@aws-sdk/client-dynamodb-streams";

export default {
  props: {
    aws,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
  },
  methods: {
    _clientDynamodbStreams() {
      return this.aws.getAWSClient(DynamoDBStreamsClient, this.region);
    },
    async listStreams(params) {
      return this._clientDynamodbStreams().send(new ListStreamsCommand(params));
    },
    async listShards(params) {
      return this._clientDynamodbStreams().send(new DescribeStreamCommand(params));
    },
    async getShardIterator(params) {
      return this._clientDynamodbStreams().send(new GetShardIteratorCommand(params));
    },
    async getRecords(params) {
      return this._clientDynamodbStreams().send(new GetRecordsCommand(params));
    },
    async isStreamEnabled(streamArn) {
      const { StreamDescription: streamDescription } = await this.listShards({
        StreamArn: streamArn,
      });
      const openShards = streamDescription.Shards.filter((shard) =>
        !shard.SequenceNumberRange?.EndingSequenceNumber);
      return openShards.length > 0;
    },
    async listEnabledStreams(params) {
      const enabledStreams = [];

      const {
        Streams,
        LastEvaluatedStreamArn,
      } = await this.listStreams(params);

      for (const stream of Streams) {
        if (await this.isStreamEnabled(stream.StreamArn)) {
          enabledStreams.push(stream);
        }
      }
      return {
        streams: enabledStreams,
        lastEvaluatedStreamArn: LastEvaluatedStreamArn,
      };
    },
  },
};
