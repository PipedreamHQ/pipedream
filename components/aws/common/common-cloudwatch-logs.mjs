import aws from "../aws.app.mjs";
import {
  CloudWatchLogsClient,
  DescribeLogStreamsCommand,
  DescribeLogGroupsCommand,
  PutLogEventsCommand,
  StartQueryCommand,
  GetQueryResultsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
    logGroupName: {
      type: "string",
      label: "CloudWatch Log Groups",
      description: "The name of the log group, e.g. `/aws/lambda/order-handler`. Run **CloudWatch Logs - List Log Groups** to find log group names.",
      async options({ prevContext }) {
        const {
          logGroups,
          nextToken,
        } = await this.describeLogGroups({
          nextToken: prevContext.nextToken,
        });
        const options = logGroups.map((group) => ({
          label: group.logGroupName,
          value: group.logGroupName,
        }));
        return {
          options,
          context: {
            nextToken,
          },
        };
      },
    },
    logStreamName: {
      type: "string",
      label: "CloudWatch Log Streams",
      description: "The name of the log stream, e.g. `2025/01/15/[$LATEST]abc123`. It must belong to the chosen log group (`logGroupName`). Run **CloudWatch Logs - List Log Streams** to find log stream names.",
    },
  },
  methods: {
    _clientCloudwatchLogs() {
      return this.aws.getAWSClient(CloudWatchLogsClient, this.region);
    },
    /**
     * This method describes CloudWatch Log groups
     *
     * @param {string} nextToken - The token for the next set of items to return.
     * (You received this token from a previous call.)
     * @returns {Promise<object>} An object containing the log groups and a nextToken
     * to use in subsequent calls (`logGroups` and `nextToken` respectively)
     */
    async describeLogGroups(params) {
      return this._clientCloudwatchLogs().send(new DescribeLogGroupsCommand(params));
    },
    /**
     * This method describes CloudWatch Log streams for a given log group
     *
     * @param {string} logGroupName - The name of the log group.
     * @param {string} nextToken - The token for the next set of items to return.
     * (You received this token from a previous call.)
     * @returns {Promise<object>} An object containing the log streams and a nextToken
     * to use in subsequent calls (`logStreams` and `nextToken` respectively)
     */
    async describeLogStreams(params) {
      return this._clientCloudwatchLogs().send(new DescribeLogStreamsCommand(params));
    },
    /**
     * This method uploads a batch of log events to the specified log stream.
     *
     * @param {string} logGroupName - The name of the log group.
     * @param {string} logStreamName - The name of the log stream.
     * @param {Array.<Object>} logEvents - An array of log events. Each log event
     * must contain a `timestamp` (the time the event occurred) and a `message`
     * @param {string} sequenceToken - The sequence token obtained from the
     * response of the previous PutLogEvents call
     * @returns {Promise<object>} An object containing the sequenceToken to use
     * to use in subsequent calls and rejected log events (`nextSequenceToken`
     * and `rejectedLogEventsInfo` respectively)
     */
    async putLogEvents(params) {
      return this._clientCloudwatchLogs().send(new PutLogEventsCommand(params));
    },
    async startQuery(params) {
      return this._clientCloudwatchLogs().send(new StartQueryCommand(params));
    },
    async getQueryResults(params) {
      return this._clientCloudwatchLogs().send(new GetQueryResultsCommand(params));
    },
  },
};
