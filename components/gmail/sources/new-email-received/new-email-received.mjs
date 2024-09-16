import gmail from "../../gmail.app.mjs";
import common from "../common/polling-history.mjs";
import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
  ConfigurationError,
} from "@pipedream/platform";
import { PubSub } from "@google-cloud/pubsub";
import { v4 as uuidv4 } from "uuid";
import verifyClient from "../common/verify-client-id.mjs";

export default {
  ...common,
  key: "gmail-new-email-received",
  name: "New Email Received",
  description: "Emit new event when a new email is received.",
  type: "source",
  version: "0.1.1",
  dedupe: "unique",
  props: {
    gmail,
    db: "$.service.db",
    triggerType: {
      type: "string",
      label: "Trigger Type",
      options: [
        "webhook",
        "polling",
      ],
      description:
        "Configuring this source as a `webhook` (instant) trigger requires a custom OAuth client. [Refer to the guide here to get started](https://pipedream.com/apps/gmail/triggers/new-email-received#getting-started).",
      reloadProps: true,
    },
    serviceAccountKeyJson: {
      type: "string",
      label: "Service Account Key JSON",
      optional: true,
      hidden: true,
      reloadProps: true,
    },
    serviceAccountKeyJsonInstructions: {
      type: "alert",
      alertType: "info",
      content: `1) [Create a service account in GCP](https://cloud.google.com/iam/docs/creating-managing-service-accounts) and set the following permission: **Pub/Sub Admin**
        \n2) [Generate a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
        \n3) Download the key details in JSON format
        \n4) Open the JSON in a text editor, and **copy and paste its contents here**.
      `,
      hidden: true,
    },
    topicType: {
      type: "string",
      label: "Pub/Sub Topic",
      description:
        "Do you have an existing Pub/Sub topic, or would you like to create a new one?",
      options: [
        "existing",
        "new",
      ],
      optional: true,
      hidden: true,
      reloadProps: true,
    },
    topic: {
      type: "string",
      label: "Pub/Sub Topic Name",
      description: "Select a Pub/Sub topic from your GCP account to watch",
      async options() {
        return this.getTopics();
      },
      optional: true,
      hidden: true,
      reloadProps: true,
    },
    label: {
      propDefinition: [
        gmail,
        "label",
      ],
      default: "INBOX",
      optional: true,
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
    latencyWarningAlert: {
      type: "alert",
      alertType: "warning",
      content:
        "Please allow up to 1 minute for deployment. We're setting up your real-time email notifications behind the scenes.",
      hidden: true,
    },
  },
  async additionalProps(props) {
    const newProps = {};
    if (this.triggerType === "polling") {
      newProps.timer = {
        type: "$.interface.timer",
        default: {
          intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
        },
      };
    }
    if (this.triggerType === "webhook") {
      // verify that a Custom OAuth client is being used
      const isValidClientId = await this.checkClientId();
      if (!isValidClientId) {
        throw new ConfigurationError(
          "Configuring this source as a `webhook` (instant) trigger requires a custom OAuth client. [Refer to the guide here to get started](https://pipedream.com/apps/gmail/triggers/new-email-received#getting-started).",
        );
      }

      newProps.http = "$.interface.http";
      newProps.timer = {
        type: "$.interface.timer",
        default: {
          intervalSeconds: 24 * 60 * 60,
        },
        hidden: true,
      };

      props.serviceAccountKeyJson.hidden = false;
      props.serviceAccountKeyJson.optional = false;
      props.serviceAccountKeyJsonInstructions.hidden = false;

      if (!this.serviceAccountKeyJson) {
        return newProps;
      }

      props.topicType.hidden = false;
      props.topicType.optional = false;

      if (!this.topicType) {
        return newProps;
      }

      // create topic prop
      let topicName = this.topic;
      if (this.topicType === "new") {
        const authKeyJSON = JSON.parse(this.serviceAccountKeyJson);
        const { project_id: projectId } = authKeyJSON;
        topicName = `projects/${projectId}/topics/${this.convertNameToValidPubSubTopicName(
          uuidv4(),
        )}`;
        props.topic.default = topicName;
        props.topic.reloadProps = false;
      } else {
        props.topic.hidden = false;
        props.topic.optional = false;
      }

      if (this.topic || this.topicType === "new") {
        const topic = await this.getOrCreateTopic(topicName);

        // Retrieves the IAM policy for the topic
        let hasPublisherRole;
        try {
          const [
            policy,
          ] = await topic.iam.getPolicy();
          hasPublisherRole = policy.bindings.find(
            ({
              members, role,
            }) =>
              members.includes(
                "serviceAccount:gmail-api-push@system.gserviceaccount.com",
              ) && role === "roles/pubsub.publisher",
          );
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
            return newProps;
          }
        }

        props.latencyWarningAlert.hidden = false;

        const historyId = await this.setupGmailNotifications(topicName);
        newProps.initialHistoryId = {
          type: "string",
          default: historyId,
          hidden: true,
        };
      }
    }
    props.label.hidden = false;
    return newProps;
  },
  hooks: {
    ...common.hooks,
    async activate() {
      if (this.triggerType === "polling") {
        return;
      }

      const sdkParams = this.sdkParams();
      const pubSubClient = new PubSub(sdkParams);

      const currentTopic = {
        name: this.topic,
      };

      // Create subscription
      const pushEndpoint = this.http.endpoint;
      const subscriptionName =
        this.convertNameToValidPubSubTopicName(pushEndpoint);
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
      if (this.triggerType === "polling") {
        return;
      }

      const sdkParams = this.sdkParams();
      const pubSubClient = new PubSub(sdkParams);

      const subscriptionName = this._getSubscriptionName();
      if (subscriptionName) {
        await pubSubClient.subscription(subscriptionName).delete();
      }
    },
  },
  methods: {
    ...verifyClient.methods,
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
      const authKeyJSON = JSON.parse(this.serviceAccountKeyJson);
      const {
        project_id: projectId, client_email, private_key,
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
      return (
        name
          // Must not start with `goog`. We add a `pd-` at the beginning if that's the case.
          .replace(/(^goog.*)/g, "pd-$1")
          // Must start with a letter, otherwise we add `pd-` at the beginning.
          .replace(/^(?![a-zA-Z]+)/, "pd-")
          // Only certain characters are allowed, the rest will be replaced with a `-`.
          .replace(/[^a-zA-Z0-9_\-.~+%]+/g, "-")
      );
    },
    makeRequest({
      $ = this, path, ...opts
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
            this.label || "INBOX",
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
        if (error.code === 6) {
          // Already exists
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
          subject: headers.find((h) => h.name.toLowerCase() === "subject")
            ?.value,
          from: headers.find((h) => h.name.toLowerCase() === "from")?.value,
          to: headers.find((h) => h.name.toLowerCase() === "to")?.value,
          date: headers.find((h) => h.name.toLowerCase() === "date")?.value,
          snippet: msg.snippet,
        };
      });
    },
    getHistoryTypes() {
      return [
        "messageAdded",
      ];
    },
    generateMeta(message) {
      return {
        id: message.id,
        summary: message.snippet,
        ts: message.internalDate,
      };
    },
    filterHistory(history) {
      return this.label
        ? history.filter(
          (item) =>
            item.messagesAdded?.length &&
              item.messagesAdded[0].message.labelIds &&
              item.messagesAdded[0].message.labelIds.includes(this.label),
        )
        : history.filter((item) => item.messagesAdded?.length);
    },
  },
  async run(event) {
    if (this.triggerType === "polling") {
      let lastHistoryId = this._getLastHistoryId();

      if (!lastHistoryId) {
        lastHistoryId = await this.getHistoryId();
      }
      await this.emitHistories(lastHistoryId);
    }

    if (this.triggerType === "webhook") {
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
          this._setLastProcessedHistoryId(this.initialHistoryId);
          return;
        }
      }

      // Extract the Pub/Sub message data
      const pubsubMessage = event.body.message;
      if (!pubsubMessage) {
        return;
      }
      const decodedData = JSON.parse(
        Buffer.from(pubsubMessage.data, "base64").toString(),
      );

      console.log("Decoded Pub/Sub data:", decodedData);

      const { historyId: receivedHistoryId } = decodedData;

      // Retrieve the last processed historyId
      const lastProcessedHistoryId = this._getLastProcessedHistoryId();
      console.log("Last processed historyId:", lastProcessedHistoryId);

      // Use the minimum of lastProcessedHistoryId and the received historyId
      const startHistoryId = Math.min(
        parseInt(lastProcessedHistoryId),
        parseInt(receivedHistoryId),
      );
      console.log("Using startHistoryId:", startHistoryId);

      // Fetch the history
      const historyResponse = await this.gmail.listHistory({
        startHistoryId,
        historyTypes: [
          "messageAdded",
        ],
        labelId: this.label,
      });

      console.log(
        "History response:",
        JSON.stringify(historyResponse, null, 2),
      );

      // Process history to find new messages
      const newMessages = [];
      if (historyResponse.history) {
        for (const historyItem of historyResponse.history) {
          if (historyItem.messagesAdded) {
            newMessages.push(
              ...historyItem.messagesAdded.map((msg) => msg.message),
            );
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
        this.$emit(
          {
            newEmailsCount: processedEmails.length,
            emails: processedEmails,
            lastProcessedHistoryId: latestHistoryId,
          },
          {
            id: processedEmails[0].id,
            summary: processedEmails[0].subject,
            ts: Date.now(),
          },
        );
      }
    }
  },
};
