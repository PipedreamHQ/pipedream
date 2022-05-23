import MailerLite from "mailerlite-api-v2-node";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "mailerlite",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email of the subscriber",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the subscriber",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Subscriber type. Defaults to `active`",
      optional: true,
      default: "active",
      options({ type }) {
        switch (type) {
        case "create":
          return constants.CREATE_TYPE_OPTIONS;
        case "update":
          return constants.UPDATE_TYPE_OPTIONS;
        case "subscriber":
          return constants.SUBSCRIBER_TYPE_OPTIONS;
        }
      },
    },
    status: {
      type: "string",
      label: "Status",
      description: "Limit to campaigns with the specified status. Defaults to `sent`",
      optional: true,
      options: constants.STATUS_OPTIONS,
    },
    subscriber: {
      type: "string",
      label: "Subscriber",
      description: "Subscriber to update",
      async options({
        group, type = "active", prevContext,
      }) {
        const limit = constants.PAGE_LIMIT;
        const { offset = 0 } = prevContext;
        const params = {
          type,
          limit,
          offset,
        };
        const subscribers = await this.listSubscribers(group, params);
        return {
          options: subscribers.map((subscriber) => ({
            label: subscriber.name,
            value: subscriber.email,
          })),
          context: {
            offset: offset + limit,
          },
        };
      },
    },
    group: {
      type: "string",
      label: "Group",
      description: "Group to add subscriber to",
      async options({ prevContext }) {
        const limit = constants.PAGE_LIMIT;
        const { offset = 0 } = prevContext;
        const params = {
          limit,
          offset,
        };
        const groups = await this.listGroups(params);
        return {
          options: groups.map((group) => ({
            label: group.name,
            value: group.id,
          })),
          context: {
            offset: offset + limit,
          },
        };
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Subscriber fields to update",
      optional: true,
      async options() {
        const fields = await this.listFields();
        return fields.map((field) => ({
          label: field.title,
          value: field.key,
        }))
        // API does not support updating email through updateSubscriber
          .filter((field) => field.value !== "email");
      },
    },
  },
  methods: {
    async _getClient() {
      const client = MailerLite.default;
      return client(this.$auth.api_key);
    },
    async listGroups(params) {
      const client = await this._getClient();
      return client.getGroups(params);
    },
    async listSubscribers(group, params = {}) {
      const client = await this._getClient();
      if (group) {
        const { type = "active" } = params;
        delete params.type;
        return client.getGroupSubscribersByType(group, type, params);
      }
      // getSubscribers returns active subscribers only
      return client.getSubscribers(params);
    },
    async listFields() {
      const client = await this._getClient();
      return client.getFields();
    },
    async listCampaigns(status = "sent") {
      const client = await this._getClient();
      return client.getCampaigns(status);
    },
    async createSubscriber(data) {
      const client = await this._getClient();
      return client.addSubscriber(data);
    },
    async updateSubscriber(data, subscriber) {
      const client = await this._getClient();
      return client.updateSubscriber(subscriber, data);
    },
    async addSubscriberToGroup(data, group) {
      const client = await this._getClient();
      return client.addSubscriberToGroup(group, data);
    },
    async removeSubscriberFromGroup(group, subscriber) {
      const client = await this._getClient();
      return client.removeGroupSubscriber(group, subscriber);
    },
  },
};
