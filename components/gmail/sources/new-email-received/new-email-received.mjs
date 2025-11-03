import { PubSub } from "@google-cloud/pubsub";
import {
  axios,
  ConfigurationError,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import { v4 as uuidv4 } from "uuid";
import gmail from "../../gmail.app.mjs";
import common from "../common/polling-history.mjs";
import verifyClient from "../common/verify-client-id.mjs";

export default {
  ...common,
  key: "gmail-new-email-received",
  name: "New Email Received",
  description: "Emit new event when a new email is received.",
  type: "source",
  version: "0.3.2",
  dedupe: "unique",
  props: {
    gmail,
    db: "$.service.db",
    triggerType: {
      type: "string",
      label: "Trigger Type",
      options: [
        "polling",
        "webhook",
      ],
      description:
        "Configuring this source as a `webhook` (instant) trigger requires a custom OAuth client. [Refer to the guide here to get started](https://pipedream.com/apps/gmail/#getting-started).",
      reloadProps: true,
      optional: true,
      default: "polling",
    },
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "How often to poll for new emails",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    withTextPayload: {
      type: "boolean",
      label: "Return payload as plaintext",
      description: "Convert the payload response into a single text field. **This reduces the size of the payload and makes it easier for LLMs work with.**",
      default: false,
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
    labels: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Labels",
      default: [
        "INBOX",
      ],
      optional: true,
    },
    excludeLabels: {
      propDefinition: [
        gmail,
        "label",
      ],
      type: "string[]",
      label: "Exclude Labels",
      description: "Emails with the specified labels will be excluded from results",
      optional: true,
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
  async additionalProps() {
    const newProps = {};

    // Handle webhook mode
    if (this.triggerType === "webhook") {
      // verify that a Custom OAuth client is being used only if webhook mode is selected
      const isValidClientId = await this.checkClientId();
      if (!isValidClientId) {
        throw new ConfigurationError(
          "Configuring this source as a `webhook` (instant) trigger requires a custom OAuth client. [Refer to the guide here to get started](https://pipedream.com/apps/gmail/#getting-started).",
        );
      }

      // Add HTTP interface and hidden timer for webhooks
      newProps.http = {
        type: "$.interface.http",
        customResponse: true,
      };
      newProps.timer = {
        type: "$.interface.timer",
        static: {
          intervalSeconds: 60 * 60, // 1 hour for webhook renewal
        },
        hidden: true,
      };

      // Make webhook-specific props visible
      newProps.serviceAccountKeyJson = {
        type: "string",
        label: "Service Account Key JSON",
        hidden: false,
        optional: false,
        reloadProps: true,
      };
      newProps.serviceAccountKeyJsonInstructions = {
        type: "alert",
        alertType: "info",
        content: `1) [Create a service account in GCP](https://cloud.google.com/iam/docs/creating-managing-service-accounts) and set the following permission: **Pub/Sub Admin**
          \n2) [Generate a service account key](https://cloud.google.com/iam/docs/creating-managing-service-account-keys)
          \n3) Download the key details in JSON format
          \n4) Open the JSON in a text editor, and **copy and paste its contents here**.
        `,
        hidden: false,
      };

      // Always show the topic type selection after service account key is provided
      newProps.topicType = {
        type: "string",
        label: "Pub/Sub Topic",
        description: "Do you have an existing Pub/Sub topic, or would you like to create a new one?",
        options: [
          "existing",
          "new",
        ],
        hidden: false,
        optional: false,
        reloadProps: true,
      };

      // Only proceed with topic operations if the service account key and topicType are provided
      if (!this.serviceAccountKeyJson || !this.topicType) {
        return newProps;
      }

      // Handle topic prop based on topicType selection
      try {
        const authKeyJSON = JSON.parse(this.serviceAccountKeyJson);

        if (this.topicType === "new") {
          // For new topics, generate a name and don't show selection
          const { project_id: projectId } = authKeyJSON;
          const topicName = `projects/${projectId}/topics/${this.convertNameToValidPubSubTopicName(
            uuidv4(),
          )}`;

          newProps.topic = {
            type: "string",
            default: topicName,
            hidden: true, // Hide this for new topics
          };

          // Store for later use
          this._topicName = topicName;

        } else if (this.topicType === "existing") {
          // For existing topics, show the dropdown
          newProps.topic = {
            type: "string",
            label: "Pub/Sub Topic Name",
            description: "Select a Pub/Sub topic from your GCP account to watch",
            options: async () => {
              try {
                // Using the PubSub client directly here to avoid potential method binding issues
                const sdkParams = {
                  credentials: {
                    client_email: authKeyJSON.client_email,
                    private_key: authKeyJSON.private_key,
                  },
                  projectId: authKeyJSON.project_id,
                };

                const pubSubClient = new PubSub(sdkParams);
                const topics = (await pubSubClient.getTopics())[0];
                if (topics.length > 0) {
                  return topics.map((topic) => topic.name);
                }
                return [];
              } catch (err) {
                console.log("Error fetching topics:", err);
                return [];
              }
            },
            hidden: false,
            optional: false,
            reloadProps: true,
          };
        }
      } catch (err) {
        console.log("Error with service account key JSON:", err);
        newProps.serviceAccountKeyJsonError = {
          type: "alert",
          alertType: "error",
          content: "Invalid service account key JSON. Please check your input and try again.",
          hidden: false,
        };
        return newProps;
      }

      // Only proceed with topic creation/configuration if required fields are set
      if ((this.topic && this.topicType === "existing") || this.topicType === "new") {
        try {
          // Get the appropriate topic name
          const topicName = this.topicType === "new"
            ? this._topicName
            : this.topic;

          if (!topicName) {
            // Skip topic creation/setup if no topic name is available yet
            return newProps;
          }

          // Create or get the topic using our helper method
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
          } catch (err) {
            console.log("Could not retrieve iam policy:", err);
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
            } catch (err) {
              console.log("Could not set permission:", err);
              newProps.permissionAlert = {
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
                hidden: false,
              };
              return newProps;
            }
          }

          newProps.latencyWarningAlert = {
            type: "alert",
            alertType: "warning",
            content:
              "Please allow up to 1 minute for deployment. We're setting up your real-time email notifications behind the scenes.",
            hidden: false,
          };

          // Setup Gmail notifications
          try {
            const {
              historyId, expiration,
            } = await this.setupGmailNotifications(topicName);
            newProps.initialHistoryId = {
              type: "string",
              default: historyId,
              hidden: true,
            };
            newProps.expiration = {
              type: "string",
              default: expiration,
              hidden: true,
            };
          } catch (err) {
            console.log("Error setting up Gmail notifications:", err);
            return newProps;
          }
        } catch (err) {
          console.log("Error with topic setup:", err);
          return newProps;
        }
      }
    }
    return newProps;
  },
  hooks: {
    ...common.hooks,
    async activate() {
      if (this.triggerType !== "webhook") {
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
      if (this.triggerType !== "webhook") {
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
    _getExpiration() {
      return this.db.get("expiration");
    },
    _setExpiration(expiration) {
      this.db.set("expiration", expiration);
    },
    _getLastReceivedTime() {
      return this.db.get("lastReceivedTime");
    },
    _setLastReceivedTime(lastReceivedTime) {
      this.db.set("lastReceivedTime", lastReceivedTime);
    },
    sdkParams() {
      try {
        const authKeyJSON = JSON.parse(this.serviceAccountKeyJson);
        const {
          project_id: projectId, client_email, private_key,
        } = authKeyJSON;

        if (!projectId || !client_email || !private_key) {
          throw new Error("Missing required fields in service account key JSON");
        }

        const sdkParams = {
          credentials: {
            client_email,
            private_key,
          },
          projectId,
        };
        return sdkParams;
      } catch (error) {
        console.log("Error parsing service account key:", error);
        throw new ConfigurationError("Invalid service account key JSON. Please check your input and try again.");
      }
    },
    async getTopics() {
      try {
        const sdkParams = this.sdkParams();
        const pubSubClient = new PubSub(sdkParams);
        const topics = (await pubSubClient.getTopics())[0];
        if (topics.length > 0) {
          return topics.map((topic) => topic.name);
        }
        return [];
      } catch (error) {
        console.log("Error fetching topics:", error);
        return [];
      }
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
          labelIds: this.labels || [
            "INBOX",
          ],
        },
      });
      console.log("Watch response:", watchResponse);
      return watchResponse;
    },
    async getOrCreateTopic(name) {
      try {
        const sdkParams = this.sdkParams();
        const pubSubClient = new PubSub(sdkParams);

        // Use provided name or fallback appropriately
        let topicName;
        if (name) {
          topicName = name;
        } else if (this.topicType === "new" && this._topicName) {
          topicName = this._topicName;
        } else {
          topicName = this.topic;
        }

        if (!topicName) {
          throw new Error("No topic name provided");
        }

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
            console.log(`Topic ${topicName} already exists.`);
            topic = pubSubClient.topic(topicName);
          } else {
            throw error;
          }
        }
        return topic;
      } catch (error) {
        console.log("Error in getOrCreateTopic:", error);
        throw error;
      }
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
        ts: +message.internalDate,
      };
    },
    filterHistory(history) {
      let filteredHistory = history.filter((item) => item.messagesAdded?.length);
      if (this.labels) {
        filteredHistory = filteredHistory.filter((item) =>
          item.messagesAdded[0].message.labelIds &&
          item.messagesAdded[0].message.labelIds.some((i) => this.labels.includes(i)));
      }
      if (this.excludeLabels) {
        filteredHistory = filteredHistory.filter((item) =>
          item.messagesAdded[0].message.labelIds &&
          !(item.messagesAdded[0].message.labelIds.some((i) => this.excludeLabels.includes(i))));
      }
      return filteredHistory;
    },
    async getMessageDetails(ids) {
      const messages = await Promise.all(ids.map(async (id) => {
        try {
          const message = await this.gmail.getMessage({
            id,
          });
          return message;
        } catch {
          console.log(`Could not find message ${id}`);
          return null;
        }
      }));
      return messages;
    },
    async getHistoryResponses(startHistoryId) {
      const historyResponses = [];
      for (const labelId of this.labels) {
        const response = await this.gmail.listHistory({
          startHistoryId,
          historyTypes: [
            "messageAdded",
          ],
          labelId,
        });
        historyResponses.push(response);
      }
      return historyResponses;
    },
  },
  async run(event) {
    // Default to polling if triggerType is not webhook
    if (this.triggerType !== "webhook") {
      let lastHistoryId = this._getLastHistoryId();

      if (!lastHistoryId) {
        lastHistoryId = await this.getHistoryId();
      }
      await this.emitHistories(lastHistoryId);
      return;
    }

    // Handle webhook case
    if (this.triggerType === "webhook") {
      if (event.timestamp) {
        // event was triggered by timer
        const topicName = this._getTopicName();
        if (topicName) {
          // renew Gmail push notifications if expiring within the next hour
          // or if no email has been received within the last hour
          const currentExpiration = this._getExpiration();
          const lastReceivedTime = this._getLastReceivedTime();
          if (
            (+currentExpiration < (event.timestamp + 3600) * 1000)
            || (lastReceivedTime < (event.timestamp - 3600) * 1000)
          ) {
            const { expiration } = await this.setupGmailNotifications(topicName);
            this._setExpiration(expiration);
          }
          return;
        } else {
          // first run, no need to renew push notifications
          this._setTopicName(this.topic);
          const initialHistoryId = this.initialHistoryId || this._getLastHistoryId();
          this._setLastProcessedHistoryId(initialHistoryId);
          this._setExpiration(this.expiration);
          return;
        }
      }

      this.http.respond({
        status: 200,
      });

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
      let startHistoryId = Math.min(
        parseInt(lastProcessedHistoryId),
        parseInt(receivedHistoryId),
      );
      console.log("Using startHistoryId:", startHistoryId);

      // Fetch the history
      let historyResponses;
      try {
        historyResponses = await this.getHistoryResponses(startHistoryId);
      } catch {
        // catch error thrown if startHistoryId is invalid or expired

        // emit recent messages to attempt to avoid missing any messages
        await this.emitRecentMessages();

        // set startHistoryId to the historyId received from the webhook
        startHistoryId = parseInt(receivedHistoryId);
        console.log("Using startHistoryId:", startHistoryId);
        historyResponses = await this.getHistoryResponses(startHistoryId);
      }

      console.log(
        "History responses:",
        JSON.stringify(historyResponses, null, 2),
      );

      // Process history to find new messages
      const newMessages = [];
      for (const historyResponse of historyResponses) {
        if (historyResponse.history) {
          const historyResponseFiltered = this.filterHistory(historyResponse.history);
          for (const historyItem of historyResponseFiltered) {
            newMessages.push(
              ...historyItem.messagesAdded.map((msg) => msg.message),
            );
          }
        }
      }

      console.log("New messages found:", newMessages.length);

      // Fetch full message details for new messages
      const newMessageIds = newMessages?.map(({ id }) => id) || [];
      const messageDetails = await this.getMessageDetails(newMessageIds);

      if (!messageDetails?.length) {
        return;
      }

      console.log("Fetched message details count:", messageDetails.length);

      // Store the latest historyId in the db
      let latestHistoryId = receivedHistoryId;
      for (const historyResponse of historyResponses) {
        latestHistoryId = Math.max(latestHistoryId, historyResponse.historyId);
      }
      this._setLastProcessedHistoryId(latestHistoryId);
      console.log("Updated lastProcessedHistoryId:", latestHistoryId);

      this._setLastReceivedTime(Date.now());

      messageDetails.forEach((message) => {
        if (message?.id) {
          this.emitEvent(message);
        }
      });
    }
  },
};
