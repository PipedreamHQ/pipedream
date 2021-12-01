import aws from "../../aws.app.mjs";

export default {
  name: "Cloudwatch Logs - Put Log Events",
  version: "0.0.1",
  key: "aws-cloudwatch-logs-put-log-events",
  description: "Uploads a batch of log events to the specified log stream. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putLogEvents-property) for more information",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
    logGroupName: {
      description: "The name of the log group you'd like to write logs to",
      type: "string",
      propDefinition: [
        aws,
        "logGroupNames",
        (configuredProps) => ({
          region: configuredProps.region,
        }),
      ],
    },
    logStreamName: {
      description: "The name of the log stream within your log group",
      type: "string",
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
      label: "Log data",
      description: "An array of log events. Each log event must contain a `timestamp` (the time the event occurred) and a `message`. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putLogEvents-property)",
      type: "string[]",
    },
    sequenceToken: {
      label: "Sequence token",
      description: "The sequence token obtained from the response of the previous `PutLogEvents` call. An upload in a newly created log stream does not need a sequence token. **You can also get the sequence token using `DescribeLogStreams`**. If you call `PutLogEvents` twice within a narrow time period using the same value for sequenceToken, both calls might be successful or one might be rejected.",
      type: "string",
      optional: true,
    },
  },
  type: "action",
  async run({ $ }) {
    const {
      logGroupName,
      logStreamName,
      logEvents,
      region,
      sequenceToken,
    } = this;
    const l = logEvents.length;
    if (!l) {
      throw new Error("No log data was written to CloudWatch. Please enter log data according to the format in the AWS docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatchLogs.html#putLogEvents-property");
    }
    const data = await this.aws.logsPutLogEvents(
      region,
      logGroupName,
      logStreamName,
      logEvents,
      sequenceToken,
    );
    $.export("$summary", `Successfully stored ${l} log${l === 1
      ? ""
      : "s"}`);
    return data;
  },
};
