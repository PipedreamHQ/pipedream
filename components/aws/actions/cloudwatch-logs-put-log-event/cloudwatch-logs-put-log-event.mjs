import common from "../../common/common-cloudwatch-logs.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-cloudwatch-logs-put-log-event",
  name: "CloudWatch Logs - Put Log Event",
  description: toSingleLineString(`
    Uploads a log event to the specified log stream.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch-logs/classes/putlogeventscommand.html)
  `),
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    logGroupName: common.props.logGroupName,
    logStreamName: common.props.logStreamName,
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
    const params = {
      logGroupName: this.logGroupName,
      logStreamName: this.logStreamName,
      logEvents: [
        {
          message: this.message,
          timestamp: this.timestamp,
        },
      ],
    };
    if (this.sequenceToken) {
      params.sequenceToken = this.sequenceToken;
    }
    const response = await this.putLogEvents(params);
    if (response.rejectedLogEventsInfo) {
      $.export("$summary", "Log event was rejected");
    } else {
      $.export("$summary", "Successfully stored log");
    }
    return response;
  },
};
