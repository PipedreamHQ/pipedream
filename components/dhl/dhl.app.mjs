import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dhl",
  propDefinitions: {
    subscriptionId: {
      type: "string",
      label: "Subscription ID",
      description: "The ID of the subscription to get details for",
      async options() {
        const { subscriptions } = await this.listSubscriptions();
        return subscriptions?.map(({ subscriptionID }) => subscriptionID) || [];
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the subscription",
      options: constants.STATUS_OPTIONS,
    },
    callbackUrl: {
      type: "string",
      label: "Callback URL",
      description: "Your callback URL where DHL will post the timestamp notification to",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.api_url;
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "dhl-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    getTracking(opts = {}) {
      return this._makeRequest({
        path: "/track/shipments",
        ...opts,
      });
    },
    listSubscriptions(opts = {}) {
      return this._makeRequest({
        path: "/dgff/push/subscriptions",
        ...opts,
      });
    },
    getSubscriptionDetails({
      subscriberId, ...opts
    }) {
      return this._makeRequest({
        path: `/dgff/push/subscription/timestamp/${subscriberId}`,
        ...opts,
      });
    },
    createSubscription(opts = {}) {
      return this._makeRequest({
        path: "/dgff/push/subscription/timestamp",
        method: "POST",
        ...opts,
      });
    },
    updateSubscriptionStatus({
      subscriberId, ...opts
    }) {
      return this._makeRequest({
        path: `/dgff/push/subscription/timestamp/${subscriberId}`,
        method: "PATCH",
        ...opts,
      });
    },
    updateSubscriptionFilters({
      subscriberId, ...opts
    }) {
      return this._makeRequest({
        path: `/dgff/push/subscription/timestamp/${subscriberId}`,
        method: "PUT",
        ...opts,
      });
    },
  },
};
