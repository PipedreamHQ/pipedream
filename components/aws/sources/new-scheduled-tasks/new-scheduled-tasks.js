const base = require("../common/scheduled");
const { toSingleLineString } = require("../common/utils");

module.exports = {
  ...base,
  key: "aws-new-scheduled-tasks",
  name: "New Scheduled Tasks",
  description: toSingleLineString(`
    Creates a Step Function State Machine to publish a message
    to an SNS topic at a specific timestamp. The SNS topic delivers
    the message to this Pipedream source, and the source emits it as a new event.
  `),
  version: "0.1.0",
  dedupe: "unique", // Dedupe on SNS message ID
  methods: {
    ...base.methods,
    getStateMachineDefinition() {
      const { PD_COMPONENT: componentId } = process.env;
      const topicArn = this.getTopicArn();
      return {
        Comment: `Task Scheduler for Pipedream component ${componentId}`,
        StartAt: "Wait",
        States: {
          Wait: {
            Comment: "Wait until specified timestamp",
            Type: "Wait",
            TimestampPath: "$.timestamp",
            Next: "SendMessageToSNS",
          },
          SendMessageToSNS: {
            Type: "Task",
            Resource: "arn:aws:states:::sns:publish",
            Parameters: {
              "TopicArn": topicArn,
              "Message.$": "$",
            },
            End: true,
          },
        },
      };
    },
    getStateMachinePermissions() {
      const topicArn = this.getTopicArn();
      const document = {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Action: [
              "sns:Publish",
            ],
            Resource: [
              topicArn,
            ],
          },
        ],
      };
      const name = "publish-messages-to-pipedream-sns-topic";
      return {
        document,
        name,
      };
    },
  },
};
