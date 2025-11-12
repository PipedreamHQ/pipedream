import aws from "../../aws.app.mjs";
import { axios } from "@pipedream/platform";
import {
  RDSClient,
  DescribeEventCategoriesCommand,
  CreateEventSubscriptionCommand,
  DeleteEventSubscriptionCommand,
} from "@aws-sdk/client-rds";
import {
  SNSClient,
  ListTopicsCommand,
  SubscribeCommand,
  UnsubscribeCommand,
} from "@aws-sdk/client-sns";

export default {
  key: "aws-rds-new-event",
  name: "New Update to AWS RDS Database (Instant)",
  description: "Emit new event when there is an update to an AWS RDS Database.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    aws,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
    topic: {
      type: "string",
      label: "SNS Topic",
      description: "The ARN of the SNS Topic",
      async options({ prevContext }) {
        const response = await this._clientSns().send(new ListTopicsCommand({
          NextToken: prevContext.nextToken,
        }));
        return {
          options: response.Topics.map((topic) => topic.TopicArn),
          context: {
            nextToken: response.NextToken,
          },
        };
      },
    },
    name: {
      type: "string",
      label: "Subscription Name",
      description: "The name of the subscription",
    },
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "The type of source that is generating the events. If this value isn't specified, all events are returned.",
      async options() {
        const eventCategoriesList = await this._describeEventCategories();
        return eventCategoriesList.map(({ SourceType: type }) => type);
      },
    },
    eventCategories: {
      type: "string[]",
      label: "Event Categories",
      description: "A list of event categories that you want to subscribe to",
      async options() {
        if (!this.sourceType) {
          return [];
        }
        const eventCategoriesList = await this._describeEventCategories();
        const sourceType = eventCategoriesList
          .find(({ SourceType: type }) => type === this.sourceType);
        return sourceType.EventCategories;
      },
    },
  },
  hooks: {
    async activate() {
      await this._clientRds().send(new CreateEventSubscriptionCommand({
        SnsTopicArn: this.topic,
        SubscriptionName: this.name,
        Enabled: true,
        SourceType: this.sourceType,
        EventCategories: this.eventCategories,
      }));
      await this._clientSns().send(new SubscribeCommand({
        TopicArn: this.topic,
        Protocol: "https",
        Endpoint: this.http.endpoint,
      }));
    },
    async deactivate() {
      await this._clientRds().send(new DeleteEventSubscriptionCommand({
        SubscriptionName: this.name,
      }));
      const subscriptionArn = this._getSubscriptionArn();
      await this._clientSns().send(new UnsubscribeCommand({
        SubscriptionArn: subscriptionArn,
      }));
    },
  },
  methods: {
    _getSubscriptionArn() {
      return this.db.get("subscriptionArn");
    },
    _setSubscriptionArn(subscriptionArn) {
      this.db.set("subscriptionArn", subscriptionArn);
    },
    _clientRds() {
      return this.aws.getAWSClient(RDSClient, this.region);
    },
    _clientSns() {
      return this.aws.getAWSClient(SNSClient, this.region);
    },
    async _describeEventCategories() {
      const { EventCategoriesMapList: list } = await this._clientRds()
        .send(new DescribeEventCategoriesCommand());
      return list;
    },
    _isSubscriptionConfirmationEvent(body = {}) {
      const { Type: type } = body;
      return type === "SubscriptionConfirmation";
    },
    async _confirmSubscription({
      SubscribeURL: callbackUrl,
      TopicArn: topicArn,
    }) {
      console.log(`Confirming subscription to SNS topic '${topicArn}'`);
      const data = await axios(this, {
        url: callbackUrl,
      });
      const subscriptionArn = data
        .ConfirmSubscriptionResponse
        .ConfirmSubscriptionResult
        .SubscriptionArn;

      console.log(`Subscribed to SNS topic '${topicArn}'`);
      return subscriptionArn;
    },
    generateMeta(body) {
      const message = JSON.parse(body.Message);
      return {
        id: body.MessageId,
        summary: message["Event Message"],
        ts: Date.parse(body.Timestamp),
      };
    },
  },
  async run(event) {
    const { body } = event;
    if (this._isSubscriptionConfirmationEvent(body)) {
      const subscriptionArn = await this._confirmSubscription(body);
      this._setSubscriptionArn(subscriptionArn);
      return;
    }
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
