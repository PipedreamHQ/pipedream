const google_cloud = require("../../google_cloud.app.js");

module.exports = {
  key: "google_cloud-new-pubsub-messages",
  name: "New Pub/Sub Messages",
  description:
    `Creates a Pub/Sub topic in your GCP account.
    Messages published to this topic are emitted from the Pipedream source.`,
  version: "0.0.2",
  dedupe: "unique", // Dedupe on Pub/Sub message ID
  props: {
    google_cloud,
    http: "$.interface.http",
    db: "$.service.db",
    topic: {
      label: "Pub/Sub Topic Name",
      description:
        `**Pipedream will create a Pub/Sub topic with this name in your account**,
        converting it to a [valid Pub/Sub topic name](https://cloud.google.com/pubsub/docs/admin#resource_names).`,
      type: "string",
    },
  },
  methods: {
    convertNameToValidPubSubTopicName(name) {
      // For valid names, see https://cloud.google.com/pubsub/docs/admin#resource_names
      return name
        // Must not start with `goog`. We add a `pd-` at the beginning if that's the case.
        .replace(/(^goog.*)/g, 'pd-$1')
        // Must start with a letter, otherwise we add `pd-` at the beginning.
        .replace(/^(?![a-zA-Z]+)/, 'pd-')
        // Only certain characters are allowed, the rest will be replaced with a `-`.
        .replace(/[^a-zA-Z0-9_\-\.~\+%]+/g, '-');
    },
  },
  hooks: {
    async activate() {
      const sdkParams = this.google_cloud.sdkParams();
      const { PubSub } = require('@google-cloud/pubsub');
      const pubSubClient = new PubSub(sdkParams);

      const topicName = this.convertNameToValidPubSubTopicName(this.topic);
      console.log(`Creating Pub/Sub topic ${topicName}`);
      const [topic] = await pubSubClient.createTopic(topicName);
      this.db.set('topicName', topic.name);

      const pushEndpoint = this.http.endpoint;
      const subscriptionName = this.convertNameToValidPubSubTopicName(pushEndpoint);
      const subscriptionOptions = {
        pushConfig: {
          pushEndpoint,
        }
      };
      console.log(
        `Subscribing this source's URL to the Pub/Sub topic: ${pushEndpoint}
        (under name ${subscriptionName}).`
      );
      const [subscriptionResult] = await pubSubClient
        .topic(topic.name)
        .createSubscription(subscriptionName, subscriptionOptions);
      this.db.set('subscriptionName', subscriptionResult.name);
    },
    async deactivate() {
      const sdkParams = this.google_cloud.sdkParams();
      const { PubSub } = require('@google-cloud/pubsub');
      const pubSubClient = new PubSub(sdkParams);

      const subscriptionName = this.db.get('subscriptionName');
      if (subscriptionName) {
        await pubSubClient.subscription(subscriptionName).delete();
      }

      const topicName = this.db.get('topicName')
      if (topicName) {
        await pubSubClient.topic(topicName).delete();
      }
    },
  },
  async run(event) {
    const { data, messageId, publishTime } = event.body.message;

    if (!data) {
      console.warn('No message present, exiting');
      return;
    }
    const dataString = Buffer.from(data, 'base64').toString('utf-8');
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
        `Couldn't parse message as JSON. Emitting raw message. Error: ${err}`
      );
      dataObj = {
        rawMessage: dataString,
      };
    }
    this.$emit(dataObj, metadata);
  },
};
