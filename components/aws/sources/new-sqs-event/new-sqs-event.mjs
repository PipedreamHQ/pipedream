import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import commonSqs from "../../common/common-sqs.mjs";

export default {
  ...commonSqs,
  key: "aws-new-sqs-event",
  name: "New SQS Messages",
  description: "Emit new events when new messages are available in an AWS SQS Queue. [See the documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...commonSqs.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      label: "Polling Schedule",
      description: "How often to poll the SQS queue for new messages",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    maxNumberOfMessages: {
      type: "integer",
      label: "Max Number of Messages",
      description: "The maximum number of messages to retrieve per poll (1-10)",
      default: 10,
      min: 1,
      max: 10,
    },
    visibilityTimeout: {
      type: "integer",
      label: "Visibility Timeout",
      description: "The duration (in seconds) that the received messages are hidden from subsequent retrieve requests",
      default: 30,
      optional: true,
    },
    waitTimeSeconds: {
      type: "integer",
      label: "Wait Time Seconds",
      description: "The duration (in seconds) for which the call waits for a message to arrive in the queue before returning (long polling). Set to 0 for short polling.",
      default: 20,
      min: 0,
      max: 20,
      optional: true,
    },
  },
  methods: {
    ...commonSqs.methods,
    generateMeta(message) {
      return {
        id: message.MessageId,
        summary: `New SQS Message: ${message.MessageId}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const {
      queueUrl,
      maxNumberOfMessages,
      visibilityTimeout,
      waitTimeSeconds,
    } = this;

    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: maxNumberOfMessages,
      WaitTimeSeconds: waitTimeSeconds,
    };

    if (visibilityTimeout) {
      params.VisibilityTimeout = visibilityTimeout;
    }

    const { Messages: messages } = await this.sqsReceiveMessage(params);

    if (!messages || messages.length === 0) {
      console.log("No new messages in queue");
      return;
    }

    console.log(`Received ${messages.length} message(s)`);

    for (const message of messages) {
      const meta = this.generateMeta(message);

      // Parse JSON body if possible
      let parsedMessage = message;
      try {
        if (message.Body) {
          parsedMessage = {
            ...message,
            ParsedBody: JSON.parse(message.Body),
          };
        }
      } catch (error) {
        // If parsing fails, keep the original message
        console.log(`Could not parse message body as JSON: ${error.message}`);
      }

      this.$emit(parsedMessage, meta);

      // Delete the message from the queue after emitting
      await this.sqsDeleteMessage({
        QueueUrl: queueUrl,
        ReceiptHandle: message.ReceiptHandle,
      });
    }
  },
};
