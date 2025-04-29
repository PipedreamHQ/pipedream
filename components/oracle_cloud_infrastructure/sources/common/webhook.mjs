import ociOns from "oci-ons";
import ociEvents from "oci-events";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../oracle_cloud_infrastructure.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
    compartmentId: {
      propDefinition: [
        app,
        "compartmentId",
      ],
    },
  },
  hooks: {
    async activate() {
      const {
        http: { endpoint },
        compartmentId,
        getTopicName,
        getCondition,
        setTopicId,
        setSubscriptionId,
        setRuleId,
        createTopic,
        deleteTopic,
        createSubscription,
        deleteSubscription,
        createRule,
      } = this;

      let subscriptionResponse;

      const { notificationTopic: { topicId } } = await createTopic({
        createTopicDetails: {
          compartmentId,
          name: getTopicName(),
        },
      });

      setTopicId(topicId);

      try {
        subscriptionResponse = await createSubscription({
          createSubscriptionDetails: {
            topicId,
            compartmentId,
            protocol: "CUSTOM_HTTPS",
            endpoint,
          },
        });
      } catch (error) {
        await deleteTopic({
          topicId,
        });
      }

      const { subscription: { id: subscriptionId } } = subscriptionResponse;
      setSubscriptionId(subscriptionId);

      try {
        const { rule: { id: ruleId } } = await createRule({
          createRuleDetails: {
            compartmentId,
            displayName: getTopicName(),
            isEnabled: true,
            condition: getCondition(),
            actions: {
              actions: [
                {
                  isEnabled: true,
                  actionType: "ONS",
                  topicId,
                },
              ],
            },
          },
        });
        setRuleId(ruleId);

      } catch (error) {
        await deleteSubscription({
          subscriptionId,
        });
        await deleteTopic({
          topicId,
        });
      }
    },
    async deactivate() {
      const {
        getTopicId,
        getSubscriptionId,
        getRuleId,
        deleteTopic,
        deleteSubscription,
        deleteRule,
      } = this;

      const topicId = getTopicId();
      const subscriptionId = getSubscriptionId();
      const ruleId = getRuleId();

      if (ruleId) {
        await deleteRule({
          ruleId,
        });
      }
      if (subscriptionId) {
        await deleteSubscription({
          subscriptionId,
        });
      }
      if (topicId) {
        await deleteTopic({
          topicId,
        });
      }
    },
  },
  methods: {
    getNotificationControlPlaneClient() {
      return this.app.initClient(ociOns.NotificationControlPlaneClient);
    },
    getNotificationDataPlaneClient() {
      return this.app.initClient(ociOns.NotificationDataPlaneClient);
    },
    getEventsClient() {
      return this.app.initClient(ociEvents.EventsClient);
    },
    setTopicId(value) {
      this.db.set(constants.TOPIC_ID, value);
    },
    getTopicId() {
      return this.db.get(constants.TOPIC_ID);
    },
    setSubscriptionId(value) {
      this.db.set(constants.SUBSCRIPTION_ID, value);
    },
    getSubscriptionId() {
      return this.db.get(constants.SUBSCRIPTION_ID);
    },
    setRuleId(value) {
      this.db.set(constants.RULE_ID, value);
    },
    getRuleId() {
      return this.db.get(constants.RULE_ID);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getTopicName() {
      throw new ConfigurationError("getTopicName is not implemented");
    },
    getCondition() {
      throw new ConfigurationError("getCondition is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createTopic(args = {}) {
      return this.app.makeRequest({
        getClient: this.getNotificationControlPlaneClient,
        method: "createTopic",
        ...args,
      });
    },
    deleteTopic(args = {}) {
      return this.app.makeRequest({
        getClient: this.getNotificationControlPlaneClient,
        method: "deleteTopic",
        ...args,
      });
    },
    createSubscription(args = {}) {
      return this.app.makeRequest({
        getClient: this.getNotificationDataPlaneClient,
        method: "createSubscription",
        ...args,
      });
    },
    deleteSubscription(args = {}) {
      return this.app.makeRequest({
        getClient: this.getNotificationDataPlaneClient,
        method: "deleteSubscription",
        ...args,
      });
    },
    getConfirmSubscription(args = {}) {
      return this.app.makeRequest({
        getClient: this.getNotificationDataPlaneClient,
        method: "getConfirmSubscription",
        ...args,
      });
    },
    createRule(args = {}) {
      return this.app.makeRequest({
        getClient: this.getEventsClient,
        method: "createRule",
        ...args,
      });
    },
    deleteRule(args = {}) {
      return this.app.makeRequest({
        getClient: this.getEventsClient,
        method: "deleteRule",
        ...args,
      });
    },
  },
  async run({
    body, headers,
  }) {
    const {
      getConfirmSubscription,
      processResource,
    } = this;

    if (body.ConfirmationURL) {
      const subscriptionId = headers["x-oci-ns-subscriptionid"];;
      const { searchParams } = new URL(body.ConfirmationURL);

      const { confirmationResult: { message } } = await getConfirmSubscription({
        id: subscriptionId,
        token: searchParams.get("token"),
        protocol: "CUSTOM_HTTPS",
      });

      console.log(`Confirmation message: ${message}`);
      return;
    }

    processResource(body);
  },
};
