import common from "../../common/common-cloudwatch-logs.mjs";
import {
  props, collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-cloudwatch-logs-list-log-groups",
  name: "CloudWatch Logs - List Log Groups",
  description: toSingleLineString(`
    Lists the CloudWatch log groups in a region, optionally only those whose name starts with a prefix.
    Use it to find the \`logGroupName\` for **CloudWatch Logs - Put Log Event** and **CloudWatch Logs - List Log Streams**.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 1, "logGroups": [{ "name": "/aws/lambda/resize-image", "arn": "arn:aws:logs:us-east-1:123456789012:log-group:/aws/lambda/resize-image:*", "storedBytes": 20480 }] }\`.
    [See docs](https://docs.aws.amazon.com/AmazonCloudWatchLogs/latest/APIReference/API_DescribeLogGroups.html)
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
    logGroupNamePrefix: {
      type: "string",
      label: "Log Group Name Prefix",
      description: "Only list log groups whose name starts with this prefix, e.g. `/aws/lambda/`. Leave empty to list all log groups.",
      optional: true,
    },
    maxItems: props.maxItems,
    nextToken: props.nextToken,
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        logGroups, nextToken,
      } = await this.describeLogGroups({
        logGroupNamePrefix: this.logGroupNamePrefix || undefined,
        nextToken: token,
      });
      return {
        items: (logGroups ?? []).map((group) => ({
          name: group.logGroupName,
          arn: group.arn,
          storedBytes: group.storedBytes,
        })),
        nextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("log group", result));
    return listResult("logGroups", result);
  },
};
