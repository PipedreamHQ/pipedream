import { PubSub } from "@google-cloud/pubsub";
import googleCloud from "../../google_cloud.app.mjs";

export default {
  key: "google_cloud-new-pubsub-messages",
  name: "New Pub/Sub Messages",
  description: "Emit new Pub/Sub topic in your GCP account. Messages published to this topic are emitted from the Pipedream source.",
  version: "0.1.7",
  type: "source",
  dedupe: "unique", // Dedupe on Pub/Sub message ID
  props: {
    googleCloud,
    http: "$.interface.http",
    db: "$.service.db",
    topicType: {
      type: "string",
      label: "Type",
      description: "Do you have an existing Pub/Sub topic, or would you like to create a new one?",
      options: [
        "existing",
        "new",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const topic = {
      type: "string",
      label: "Pub/Sub Topic Name",
      description: "Select a Pub/Sub topic from your GCP account to watch",
      options: async () => {
        return this.getTopics();
      },
    };
    if (this.topicType === "new") {
      topic.description = "**Pipedream will create a Pub/Sub topic with this name in your account**, converting it to a [valid Pub/Sub topic name](https://cloud.google.com/pubsub/docs/admin#resource_names).";
      delete topic.options;
    }
    return {
      topic,
    };
  },
  methods: {
    _getTopicName() {
      return this.db.get("topicName");
    },
    _setTopicName(topicName) {
      this.db.set("topicName", topicName);
    },
    _getSubscriptionName() {
      return this.db.get("subscriptionName");
    },
    _setSubscriptionName(subscriptionName) {
      this.db.set("subscriptionName", subscriptionName);
    },
    async getTopics() {
      const sdkParams = this.googleCloud.sdkParams();
      const pubSubClient = new PubSub(sdkParams);
      const topics = (await pubSubClient.getTopics())[0];
      if (topics.length > 0) {
        return topics.map((topic) => topic.name);
      }
      return [];
    },
    convertNameToValidPubSubTopicName(name) {
      // For valid names, see https://cloud.google.com/pubsub/docs/admin#resource_names
      return name
        // Must not start with `goog`. We add a `pd-` at the beginning if that's the case.
        .replace(/(^goog.*)/g, "pd-$1")
        // Must start with a letter, otherwise we add `pd-` at the beginning.
        .replace(/^(?![a-zA-Z]+)/, "pd-")
        // Only certain characters are allowed, the rest will be replaced with a `-`.
        .replace(/[^a-zA-Z0-9_\-.~+%]+/g, "-");
    },
  },
  hooks: {
    async activate() {
      const sdkParams = this.googleCloud.sdkParams();
      const pubSubClient = new PubSub(sdkParams);

      const currentTopic = {
        name: this.topic,
      };
      if (this.topicType === "new") {
        const topicName = this.convertNameToValidPubSubTopicName(this.topic);
        console.log(`Creating Pub/Sub topic ${topicName}`);
        const [
          topic,
        ] = await pubSubClient.createTopic(topicName);
        currentTopic.name = topic.name;
      }
      this._setTopicName(currentTopic.name);

      const pushEndpoint = this.http.endpoint;
      const subscriptionName = this.convertNameToValidPubSubTopicName(pushEndpoint);
      const subscriptionOptions = {
        pushConfig: {
          pushEndpoint,
        },
      };
      console.log(
        `Subscribing this source's URL to the Pub/Sub topic: ${pushEndpoint}
        (under name ${subscriptionName}).`,
      );
      const [
        subscriptionResult,
      ] = await pubSubClient
        .topic(currentTopic.name)
        .createSubscription(subscriptionName, subscriptionOptions);
      this._setSubscriptionName(subscriptionResult.name);
    },
    async deactivate() {
      const sdkParams = this.googleCloud.sdkParams();
      const pubSubClient = new PubSub(sdkParams);

      const subscriptionName = this._getSubscriptionName();
      if (subscriptionName) {
        await pubSubClient.subscription(subscriptionName).delete();
      }

      if (this.topicType === "new") {
        const topicName = this._getTopicName();
        if (topicName) {
          await pubSubClient.topic(topicName).delete();
        }
      }
    },
  },
  async run(event) {
    const {
      data,
      messageId,
      publishTime,
    } = event.body.message;

    if (!data) {
      console.warn("No message present, exiting");
      return;
    }
    const dataString = Buffer.from(data, "base64").toString("utf-8");
    const metadata = {
      id: messageId,
      summary: dataString,
      ts: +new Date(publishTime),
    };

    let dataObj;
    try {
      dataObj = JSON.parse(dataString);
    } catch (err) {
      console.error(
        `Couldn't parse message as JSON. Emitting raw message. Error: ${err}`,
      );
      dataObj = {
        rawMessage: dataString,
      };
    }
    this.$emit(dataObj, metadata);
  },
};
