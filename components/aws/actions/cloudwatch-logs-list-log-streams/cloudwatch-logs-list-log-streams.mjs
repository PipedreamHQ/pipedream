import common from "../../common/common-cloudwatch-logs.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-cloudwatch-logs-list-log-streams",
  name: "CloudWatch Logs - List Log Streams",
  description: toSingleLineString(`
    Lists the log streams in a CloudWatch log group, most recently active first.
    Use it to find the \`logStreamName\` for **CloudWatch Logs - Put Log Event**; run **CloudWatch Logs - List Log Groups** first for the group name.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 1, "logStreams": [{ "name": "2025/01/15/[$LATEST]abc123", "lastEventTimestamp": 1736935200000 }] }\`.
    [See the documentation](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_DescribeLogStreams.html)
  `),
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aws: common.props.aws,
    region: common.props.region,
    logGroupName: common.props.logGroupName,
    maxItems: {
      propDefinition: [
        common.props.aws,
        "maxItems",
      ],
    },
    nextToken: {
      propDefinition: [
        common.props.aws,
        "nextToken",
      ],
    },
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        logStreams, nextToken,
      } = await this.describeLogStreams({
        logGroupName: this.logGroupName,
        orderBy: "LastEventTime",
        descending: true,
        nextToken: token,
      });
      return {
        items: (logStreams ?? []).map((stream) => ({
          name: stream.logStreamName,
          lastEventTimestamp: stream.lastEventTimestamp,
        })),
        nextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("log stream", result));
    return listResult("logStreams", result);
  },
};
