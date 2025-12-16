import aws from "../aws.app.mjs";
import {
  SQSClient,
  ListQueuesCommand,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region tied to your SQS queue, e.g `us-east-1` or `us-west-2`",
    },
    queueUrl: {
      type: "string",
      label: "SQS Queue URL",
      description: "The URL of the SQS Queue",
      async options({ prevContext }) {
        const response = await this.sqsListQueues({
          NextToken: prevContext.nextToken,
        });
        return {
          options: response.QueueUrls,
          context: {
            nextToken: response.NextToken,
          },
        };
      },
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
    async sqsReceiveMessage(params) {
      return this._clientSqs().send(new ReceiveMessageCommand(params));
    },
    async sqsDeleteMessage(params) {
      return this._clientSqs().send(new DeleteMessageCommand(params));
    },
  },
};
