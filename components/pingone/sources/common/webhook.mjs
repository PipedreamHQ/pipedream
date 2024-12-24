import { ConfigurationError } from "@pipedream/platform";
import app from "../../pingone.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      const {
        createSubscription,
        http: { endpoint: url },
        setSubscriptionId,
        getSubscriptionData,
      } = this;

      const response =
        await createSubscription({
          data: {
            enabled: true,
            httpEndpoint: {
              url,
            },
            ...getSubscriptionData(),
          },
        });

      setSubscriptionId(response.id);
    },
    async deactivate() {
      const {
        deleteSubscription,
        getSubscriptionId,
      } = this;

      const webhookId = getSubscriptionId();
      if (webhookId) {
        await deleteSubscription({
          webhookId,
        });
      }
    },
  },
  methods: {
    setSubscriptionId(value) {
      this.db.set(constants.SUBSCRIPTION_ID, value);
    },
    getSubscriptionId() {
      return this.db.get(constants.SUBSCRIPTION_ID);
    },
    generateMeta() {
      throw new ConfigurationError("generateMeta is not implemented");
    },
    getSubscriptionData() {
      throw new ConfigurationError("getSubscriptionData is not implemented");
    },
    processResource(resource) {
      this.$emit(resource, this.generateMeta(resource));
    },
    createSubscription(args = {}) {
      return this.app.post({
        path: "/subscriptions",
        ...args,
      });
    },
    deleteSubscription({
      subscriptionId, ...args
    } = {}) {
      return this.app.delete({
        path: `/subscriptions/${subscriptionId}`,
        ...args,
      });
    },
  },
  async run({ body }) {
    this.http.respond({
      status: 200,
    });

    this.processResource(body);
  },
};
