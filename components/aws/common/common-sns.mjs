import aws from "../aws.app.mjs";
import {
  SNSClient,
  ListTopicsCommand,
  PublishCommand,
  SubscribeCommand,
  UnsubscribeCommand,
  CreateTopicCommand,
  DeleteTopicCommand,
  SetTopicAttributesCommand,
} from "@aws-sdk/client-sns";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "Region tied to your SNS Topic, e.g. `us-east-1` or `us-west-2`",
    },
    topic: {
      type: "string",
      label: "SNS Topic",
      description: "The ARN of the SNS Topic",
      async options({ prevContext }) {
        const response = await this.snsListTopics({
          NextToken: prevContext.nextToken,
        });
        return {
          options: response.Topics.map((topic) => topic.TopicArn),
          context: {
            nextToken: response.NextToken,
          },
        };
      },
    },
  },
  methods: {
    _clientSns() {
      return this.aws.getAWSClient(SNSClient, this.region);
    },
    async snsListTopics(params) {
      return this._clientSns().send(new ListTopicsCommand(params));
    },
    async snsSendMessage(params) {
      return this._clientSns().send(new PublishCommand(params));
    },
    async createTopic(params) {
      return this._clientSns().send(new CreateTopicCommand(params));
    },
    async deleteTopic(params) {
      return this._clientSns().send(new DeleteTopicCommand(params));
    },
    async subscribeToTopic(params) {
      return this._clientSns().send(new SubscribeCommand(params));
    },
    async unsubscribeFromTopic(params) {
      return this._clientSns().send(new UnsubscribeCommand(params));
    },
    async setTopicAttributes(params) {
      return this._clientSns().send(new SetTopicAttributesCommand(params));
    },
  },
};
