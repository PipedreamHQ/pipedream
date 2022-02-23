import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-cloudwatch-logs-put-log-event",
  name: "CloudWatch Logs - Put Log Event",
  description: toSingleLineString(`
    Uploads a log event to the specified log stream.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-logs/classes/putlogeventscommand.html)
  `),
  version: "0.1.0",
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
    message: {
      type: "string",
      label: "Message",
      description: "The event message",
    },
    timestamp: {
      type: "integer",
      label: "Timestamp",
      description: "The Unix timestamp for when the event occurred, in milliseconds",
    },
    sequenceToken: {
      type: "string",
      label: "Sequence token",
      description: toSingleLineString(`
        The sequence token obtained from the response of the previous \`PutLogEvents\` call.
        An upload in a newly created log stream does not need a sequence token.
        **You can also get the sequence token using \`DescribeLogStreams\`**.
        If you call \`PutLogEvents\` twice within a narrow time period using the same value for sequenceToken,
        both calls might be successful or one might be rejected.
      `),
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.aws.cloudWatchLogsPutLogEvents(this.region, {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: [
        {
          message: this.message,
          timestamp: this.timestamp,
        },
      ],
      sequenceToken: this.sequenceToken,
    });
    if (response.rejectedLogEventsInfo) {
      $.export("$summary", "Log event was rejected");
    } else {
      $.export("$summary", "Successfully stored log");
    }
    return response;
  },
};
