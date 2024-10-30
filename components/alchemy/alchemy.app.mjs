import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "alchemy",
  propDefinitions: {
    authToken: {
      type: "string",
      label: "Auth Token",
      description: "Find your [Alchemy auth token](https://docs.alchemy.com/reference/notify-api-faq#where-do-i-find-my-alchemy-auth-token) in the upper-right corner of your Webhooks dashboard by clicking the **AUTH TOKEN** button.",
    },
    network: {
      type: "string",
      label: "Network",
      description: "Network of the webhook",
      options: constants.NETWORKS,
    },
    query: {
      type: "string",
      label: "GraphQL Query",
      description: "Create a custom GraphQL query or select `Full Block Receipts` to get all log events for every new block",
      options: [
        {
          label: "Full Block Receipts",
          value: constants.FULL_BLOCK_RECEIPTS,
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://dashboard.alchemy.com/api";
    },
    _makeRequest({
      $ = this,
      path,
      authToken,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-Alchemy-Token": authToken,
        },
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/create-webhook",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/delete-webhook",
        ...opts,
      });
    },
  },
};
