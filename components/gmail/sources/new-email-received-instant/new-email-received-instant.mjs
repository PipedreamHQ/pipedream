import { axios } from "@pipedream/platform";
import { PubSub } from "@google-cloud/pubsub";
import { v4 as uuidv4 } from "uuid";
import common from "../common/verify-client-id.mjs";

export default {
  key: "gmail-new-email-received-instant",
  name: "New Email Received (Instant)",
  description: "Emit new event when a new email is received.",
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    http: "$.interface.http",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 24 * 60 * 60,
      },
      hidden: true,
    },
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
    label: {
      propDefinition: [
        common.props.gmail,
        "label",
      ],
      default: "INBOX",
      optional: true,
    },
    keyAlert: {
      type: "alert",
      alertType: "error",
      content: `No Service Account Key JSON found. Please reconnect your Gmail account in Pipedream, and add a Service Account Key JSON.
      \nIn order to receive real-time push notifications for changes to your email inbox, you will need to first enable the Google Cloud Pub/Sub API within your Google Cloud console.
      \n
      \n1. Navigate to the [Cloud Pub/Sub API](https://console.cloud.google.com/apis/library/pubsub.googleapis.com) and click “Enable.”
      \n2. Under “API and Services”, click “Credentials”
      \n3. Click “Create Credentials”, then “Service Account”
      \n4. Name your service account, e.g. “Gmail PubSub Handler”, and optionally provide a description, e.g. “Used for configuring Pub/Sub API with Gmail on Pipedream.”
      \n5. Click on your newly created service account. Under the heading “Keys”, click “Add Key” then “Create Key”, Key Type: JSON. The private key will be saved to your computer; be sure to store this securely. 
      `,
      hidden: true,
    },
    permissionAlert: {
      type: "alert",
      alertType: "error",
      content: `Unable to grant publish permission to Gmail API service account.
      \n1. Navigate to your [Google Cloud PubSub Topics List](https://console.cloud.google.com/cloudpubsub)
      \n2. Select "View Permissions" for the topic you intend to use for this source.
      \n3. Click "ADD PRINCIPAL"
      \n4. Select "Pub/Sub Publisher" for the Role.
      \n5. Enter \`serviceAccount:gmail-api-push@system.gserviceaccount.com\` as the principal. 
      \n6. Click "Save"
      `,
      hidden: true,
    },
  },
  async additionalProps(props) {
    const isValidClientId = await this.checkClientId();
    if (!isValidClientId) {
      props.appAlert.alertType = "error";
      props.appAlert.content = "You must use a custom OAuth client to use this component. Please see [here](https://pipedream.com/docs/connected-accounts/oauth-clients) for more details.";
      props.appAlert.hidden = false;
      return {};
    }

    const { key_json: key } = this.gmail.$auth;
    if (!key) {
      props.keyAlert.hidden = false;
    }
    let topicName = this.topic;
    const topicProp = {
      type: "string",
      label: "Pub/Sub Topic Name",
      description: "Select a Pub/Sub topic from your GCP account to watch",
      options: async () => {
        return this.getTopics();
      },
      reloadProps: true,
    };
    if (this.topicType === "new") {
      const authKeyJSON = JSON.parse(key);
      const { project_id: projectId } = authKeyJSON;
      topicName = `projects/${projectId}/topics/${this.convertNameToValidPubSubTopicName(uuidv4())}`;
      topicProp.default = topicName;
      topicProp.hidden = true;
      topicProp.reloadProps = false;
    }

    const newProps = {
      topic: topicProp,
    };

    if (this.topic || this.topicType === "new") {
      const topic = await this.getOrCreateTopic(topicName);

      // Retrieves the IAM policy for the topic
      let hasPublisherRole;
      try {
        const [
          policy,
        ] = await topic.iam.getPolicy();
        hasPublisherRole = policy.bindings.find(({
          members, role,
        }) => members.includes("serviceAccount:gmail-api-push@system.gserviceaccount.com") && role === "roles/pubsub.publisher");
      } catch {
        console.log("Could not retrieve iam policy");
      }

      if (!hasPublisherRole) {
        // Grant publish permission to Gmail API service account
        try {
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
        } catch {
          props.permissionAlert.hidden = false;
        }
      }

      const historyId = await this.setupGmailNotifications(topicName);
      newProps.initialHistoryId = {
        type: "string",
        default: historyId,
        hidden: true,
      };
    }

    return newProps;
  },
  hooks: {
    async deploy() {
      this._setLastProcessedHistoryId(this.initialHistoryId);
    },
    async activate() {
      const sdkParams = this.sdkParams();
      const pubSubClient = new PubSub(sdkParams);

      const currentTopic = {
        name: this.topic,
      };

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
    },
    async deactivate() {
      const sdkParams = this.sdkParams();
      const pubSubClient = new PubSub(sdkParams);

      const subscriptionName = this._getSubscriptionName();
      if (subscriptionName) {
        await pubSubClient.subscription(subscriptionName).delete();
      }
    },
  },
  methods: {
    ...common.methods,
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
    sdkParams() {
      const authKeyJSON = JSON.parse(this.gmail.$auth.key_json);
      const {
        project_id: projectId,
        client_email,
        private_key,
      } = authKeyJSON;
      const sdkParams = {
        credentials: {
          client_email,
          private_key,
        },
        projectId,
      };
      return sdkParams;
    },
    async getTopics() {
      const sdkParams = this.sdkParams();
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
    async setupGmailNotifications(topicName) {
      // Set up Gmail push notifications using OAuth token
      const watchResponse = await this.makeRequest({
        method: "POST",
        path: "/users/me/watch",
        data: {
          topicName,
          labelIds: [
            "INBOX",
          ],
        },
      });
      console.log("Watch response:", watchResponse);
      return watchResponse.historyId;
    },
    async getOrCreateTopic(name) {
      const sdkParams = this.sdkParams();
      const pubSubClient = new PubSub(sdkParams);
      const topicName = name || this.topic;
      // Create or get Pub/Sub topic
      let topic;
      try {
        [
          topic,
        ] = await pubSubClient.createTopic(topicName);
        console.log(`Topic ${topicName} created.`);
      } catch (error) {
        if (error.code === 6) { // Already exists
          topic = pubSubClient.topic(topicName);
        } else {
          throw error;
        }
      }
      return topic;
    },
    processEmails(messageDetails) {
      // Process and structure the email data
      return messageDetails.map((msg) => {
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
    },
  },
  async run(event) {
    if (event.timestamp) {
      // event was triggered by timer
      const topicName = this._getTopicName();
      if (topicName) {
        // renew Gmail push notifications
        await this.setupGmailNotifications(topicName);
        return;
      } else {
        // first run, no need to renew push notifications
        this._setTopicName(this.topic);
        return;
      }
    }

    // Extract the Pub/Sub message data
    const pubsubMessage = event.body.message;
    const decodedData = JSON.parse(Buffer.from(pubsubMessage.data, "base64").toString());

    console.log("Decoded Pub/Sub data:", decodedData);

    const { historyId: receivedHistoryId } = decodedData;

    // Retrieve the last processed historyId
    const lastProcessedHistoryId = this._getLastProcessedHistoryId();
    console.log("Last processed historyId:", lastProcessedHistoryId);

    // Use the minimum of lastProcessedHistoryId and the received historyId
    const startHistoryId = Math.min(parseInt(lastProcessedHistoryId), parseInt(receivedHistoryId));
    console.log("Using startHistoryId:", startHistoryId);

    // Fetch the history
    const historyResponse = await this.gmail.listHistory({
      startHistoryId,
      historyTypes: [
        "messageAdded",
      ],
      labelId: this.label,
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
    const newMessageIds = newMessages?.map(({ id }) => id) || [];
    const messageDetails = await this.gmail.getMessages(newMessageIds);

    console.log("Fetched message details count:", messageDetails.length);

    const processedEmails = this.processEmails(messageDetails);

    // Store the latest historyId in the db
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
