import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-cloudwatch-logs-put-log-events",
  name: "AWS - CloudWatch Logs - Put Log Events",
  description: toSingleLineString(`
    Uploads a batch of log events to the specified log stream.
    [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putLogEvents-property) for more information
  `),
  version: "0.0.2",
  type: "action",
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
      description: "The name of the log group you'd like to write logs to",
      propDefinition: [
        aws,
        "logGroupNames",
        (configuredProps) => ({
          region: configuredProps.region,
        }),
      ],
    },
    logStreamName: {
      type: "string",
      description: "The name of the log stream within your log group",
      propDefinition: [
        aws,
        "logStreamNames",
        (configuredProps) => ({
          logGroupName: configuredProps.logGroupName,
          region: configuredProps.region,
        }),
      ],
    },
    logEvents: {
      type: "string[]",
      label: "Log data",
      description: "An array of log events. Each log event must contain a `timestamp` (the time the event occurred) and a `message`. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putLogEvents-property)",
    },
    sequenceToken: {
      type: "string",
      label: "Sequence token",
      description: "The sequence token obtained from the response of the previous `PutLogEvents` call. An upload in a newly created log stream does not need a sequence token. **You can also get the sequence token using `DescribeLogStreams`**. If you call `PutLogEvents` twice within a narrow time period using the same value for sequenceToken, both calls might be successful or one might be rejected.",
      optional: true,
    },
  },
  async run({ $ }) {
    const length = this.logEvents.length;
    const data = await this.aws.cloudWatchLogsPutLogEvents(this.region, {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: this.logEvents.map((logEvent) => JSON.parse(logEvent)),
      sequenceToken: this.sequenceToken,
    });
    $.export("$summary", `Successfully stored ${length} log${length === 1
      ? ""
      : "s"}`);
    return data;
  },
};
