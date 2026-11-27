import aws from "../aws.app.mjs";
import {
  SQSClient,
  ListQueuesCommand,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region tied to your SQS queue, e.g. `us-east-1` or `us-west-2`. Run **List AWS Region Options** to see the available regions.",
    },
    queueUrl: {
      type: "string",
      label: "SQS Queue URL",
      description: "The URL of the SQS Queue, e.g. `https://sqs.us-east-1.amazonaws.com/123456789012/my-queue`. Run **SQS - List Queues** to find queue URLs.",
    },
  },
  methods: {
    _clientSqs() {
      return this.aws.getAWSClient(SQSClient, this.region);
    },
    async sqsListQueues(params) {
      return this._clientSqs().send(new ListQueuesCommand(params));
    },
    async sqsSendMessage(params) {
      return this._clientSqs().send(new SendMessageCommand(params));
    },
  },
};
