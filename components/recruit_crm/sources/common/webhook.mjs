import { ConfigurationError } from "@pipedream/platform";
import common from "./base.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  hooks: {
    async deploy() {
      const resourcesFn = this.getResourcesFn();
      const { [this.getResourcesName()]: resources } =
        await resourcesFn(this.getResourcesFnArgs());
      Array.from(resources)
        .reverse()
        .forEach(this.processResource);
    },
    async activate() {
      const response =
        await this.createSubscription({
          data: {
            event: this.getEventName(),
            target_url: this.http.endpoint,
          },
        });

      this.setSubscriptionId(response.id);
    },
    async deactivate() {
      const subscriptionId = this.getSubscriptionId();
      if (subscriptionId) {
        await this.deleteSubscription({
          subscriptionId,
        });
      }
    },
  },
  methods: {
    ...common.methods,
    setSubscriptionId(value) {
      this.db.set(constants.SUBSCRIPTION_ID, value);
    },
    getSubscriptionId() {
      return this.db.get(constants.SUBSCRIPTION_ID);
    },
    getResourcesName() {
      return "data";
    },
    getEventName() {
      throw new ConfigurationError("getEventName is not implemented");
    },
    getResourcesFn() {
      throw new ConfigurationError("getResourcesFn is not implemented");
    },
    getResourcesFnArgs() {
      throw new ConfigurationError("getResourcesFnArgs is not implemented");
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
