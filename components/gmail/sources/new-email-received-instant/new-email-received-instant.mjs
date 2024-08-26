import gmail from "../../gmail.app.mjs";
import googleCloud from "../../../google_cloud/google_cloud.app.mjs";
import { axios } from "@pipedream/platform";
import { PubSub } from "@google-cloud/pubsub";

export default {
  key: "gmail-new-email-received-instant",
  name: "New Email Received (Instant)",
  description: "Emit new event when a new email is received.",
  version: "0.0.1",
  type: "source",
  props: {
    gmail,
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
  hooks: {
    async activate() {
      const sdkParams = this.googleCloud.sdkParams();
      const pubSubClient = new PubSub(sdkParams);

      // Create or retrieve topic
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

      // Create subscription
      const pushEndpoint = this.http.endpoint;
      const subscriptionName = this.convertNameToValidPubSubTopicName(pushEndpoint);
      const subscriptionOptions = {
        pushConfig: {
          pushEndpoint,
        },
      };
      const [
        subscriptionResult,
      ] = await pubSubClient
        .topic(currentTopic.name)
        .createSubscription(subscriptionName, subscriptionOptions);
      this._setSubscriptionName(subscriptionResult.name);

      // Grant publish permission to Gmail API service account
      try {
        const topic = pubSubClient.topic(currentTopic.name);
        await topic.iam.setPolicy({
          bindings: [
            {
              role: "roles/pubsub.publisher",
              members: [
                "serviceAccount:gmail-api-push@system.gserviceaccount.com",
              ],
            },
          ],
        });
        console.log("Permissions granted to Gmail API service account.");
      } catch (error) {
        console.error("Error granting permissions:", error);
        throw error;
      }

      // Set up Gmail push notifications using OAuth token
      const watchResponse = await this.makeRequest({
        method: "POST",
        path: "/users/me/watch",
        data: {
          topicName: currentTopic.name,
          labelIds: [
            "INBOX",
          ],
        },
      });

      console.log("Watch response:", watchResponse);
      this._setLastProcessedHistoryId(watchResponse.historyId);
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
    _getLastProcessedHistoryId() {
      return this.db.get("lastProcessedHistoryId");
    },
    _setLastProcessedHistoryId(lastProcessedHistoryId) {
      this.db.set("lastProcessedHistoryId", lastProcessedHistoryId);
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
    makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `https://gmail.googleapis.com/gmail/v1${path}`,
        headers: {
          Authorization: `Bearer ${this.gmail.getToken()}`,
        },
        ...opts,
      });
    },
  },
  async run(event) {
    // Extract the Pub/Sub message data
    const pubsubMessage = event.body.message;
    const decodedData = JSON.parse(Buffer.from(pubsubMessage.data, "base64").toString());

    console.log("Decoded Pub/Sub data:", decodedData);

    const {
      emailAddress, historyId: receivedHistoryId,
    } = decodedData;

    // Retrieve the last processed historyId
    const lastProcessedHistoryId = this._getLastProcessedHistoryId();
    console.log("Last processed historyId:", lastProcessedHistoryId);

    // Use the minimum of lastProcessedHistoryId and the received historyId
    const startHistoryId = Math.min(parseInt(lastProcessedHistoryId), parseInt(receivedHistoryId));
    console.log("Using startHistoryId:", startHistoryId);

    // Fetch the history
    const historyResponse = await this.makeRequest({
      path: `/users/${emailAddress}/history`,
      params: {
        startHistoryId,
      },
    });

    console.log("History response:", JSON.stringify(historyResponse, null, 2));

    // Process history to find new messages
    const newMessages = [];
    if (historyResponse.history) {
      for (const historyItem of historyResponse.history) {
        if (historyItem.messagesAdded) {
          newMessages.push(...historyItem.messagesAdded.map((msg) => msg.message));
        }
      }
    }

    console.log("New messages found:", newMessages.length);

    // Fetch full message details for new messages
    const messageDetails = await Promise.all(
      newMessages.map(async (message) => {
        const msgResponse = await this.makeRequest({
          path: `/users/${emailAddress}/messages/${message.id}`,
        });
        return msgResponse;
      }),
    );

    console.log("Fetched message details count:", messageDetails.length);

    // Process and structure the email data
    const processedEmails = messageDetails.map((msg) => {
      const headers = msg.payload.headers;
      return {
        id: msg.id,
        threadId: msg.threadId,
        subject: headers.find((h) => h.name.toLowerCase() === "subject")?.value,
        from: headers.find((h) => h.name.toLowerCase() === "from")?.value,
        to: headers.find((h) => h.name.toLowerCase() === "to")?.value,
        date: headers.find((h) => h.name.toLowerCase() === "date")?.value,
        snippet: msg.snippet,
      };
    });

    // Store the latest historyId in the data store
    const latestHistoryId = historyResponse.historyId || receivedHistoryId;
    this._setLastProcessedHistoryId(latestHistoryId);
    console.log("Updated lastProcessedHistoryId:", latestHistoryId);

    if (processedEmails?.length) {
      this.$emit({
        newEmailsCount: processedEmails.length,
        emails: processedEmails,
        lastProcessedHistoryId: latestHistoryId,
      }, {
        id: latestHistoryId,
        summary: processedEmails[0].subject,
        ts: Date.now(),
      });
    }
  },
};
