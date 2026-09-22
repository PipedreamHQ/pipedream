import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sender",
  propDefinitions: {
    groupIds: {
      type: "string[]",
      label: "Group IDs",
      description: "The IDs of the groups",
      async options({ page }) {
        const { data } = await this.listGroups({
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    subscriberId: {
      type: "string[]",
      label: "Subscriber IDs",
      description: "Provide the new subscribers assigned to the group",
      async options({
        page, groupId = null,
      }) {
        const fn = groupId
          ? this.listGroupSubscribers
          : this.listSubscribers;

        const { data } = await fn({
          groupId,
          params: {
            page: page + 1,
          },
        });
        return data.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "First name of the subscriber",
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "Last name of the subscriber",
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the subscriber. Must include the country code: +370 or 00370 follow by a valid phone number",
    },
    triggerAutomation: {
      type: "boolean",
      label: "Trigger Automation",
      description: "This property is true by default. You can send it as false if you do not want to activate an automation",
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.sender.net/v2";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(),
      });
    },
    listGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    listGroupSubscribers({
      groupId, ...opts
    }) {
      return this._makeRequest({
        path: `/groups/${groupId}/subscribers`,
        ...opts,
      });
    },
    listSubscribers(opts = {}) {
      return this._makeRequest({
        path: "/subscribers",
        ...opts,
      });
    },
    addSubscriberToGroup({
      groupId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/subscribers/groups/${groupId}`,
        ...opts,
      });
    },
    removeSubscriberFromGroup({
      groupId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/subscribers/groups/${groupId}`,
        ...opts,
      });
    },
    createSubscriber(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscribers",
        ...opts,
      });
    },
    updateSubscriber({
      subscriberId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/subscribers/${subscriberId}`,
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/account/webhooks",
        ...opts,
      });
    },
    deleteHook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/account/webhooks/${webhookId}`,
      });
    },
  },
};
