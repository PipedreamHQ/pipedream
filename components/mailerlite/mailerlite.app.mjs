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
      description: "Subscriber type",
      optional: true,
      options: constants.TYPE_OPTIONS,
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
        group, page,
      }) {
        const limit = constants.PAGE_LIMIT;
        const params = {
          limit,
          offset: (page - 1) * limit,
        };
        const subscribers = await this.listSubscribers(group, params);
        return subscribers.map((subscriber) => ({
          label: subscriber.name,
          value: subscriber.email,
        }));
      },
    },
    group: {
      type: "string",
      label: "Group",
      description: "Group to add subscriber to",
      async options({ page }) {
        const limit = constants.PAGE_LIMIT;
        const params = {
          limit,
          offset: (page - 1) * limit,
        };
        const groups = await this.listGroups(params);
        return groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
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
      return group
        ? client.getGroupSubscribers(group, params)
        : client.getSubscribers(params);
    },
    async listFields() {
      const client = await this._getClient();
      return client.getFields();
    },
    async listCampaigns(status = "sent") {
      const client = await this._getClient();
      return client.getCampaigns(status);
    },
    async createSubscriber(data) { console.log(data);
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
