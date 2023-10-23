import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flodesk",
  propDefinitions: {
    subscriberId: {
      type: "string",
      label: "Subscriber",
      description: "Identifier of the subscriber to update",
      async options({ page }) {
        const { data } = await this.listSubscribers({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    segmentIds: {
      type: "string[]",
      label: "Segments",
      description: "Array of segment Ids to add subscriber to",
      async options({ page }) {
        const { data } = await this.listSegments({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Custom fields to enter values for",
      withLabel: true,
      optional: true,
      async options({ page }) {
        const { data } = await this.listCustomFields({
          params: {
            page: page + 1,
          },
        });
        return data?.map(({
          key: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flodesk.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        path: `/webhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    listSegments(args = {}) {
      return this._makeRequest({
        path: "/segments",
        ...args,
      });
    },
    listSubscribers(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        ...args,
      });
    },
    listCustomFields(args = {}) {
      return this._makeRequest({
        path: "/custom-fields",
        ...args,
      });
    },
    findSubscriber({
      email, ...args
    }) {
      return this._makeRequest({
        path: `/subscribers/${email}`,
        ...args,
      });
    },
    addSubscriberToSegment({
      subscriberId, ...args
    }) {
      return this._makeRequest({
        path: `/subscribers/${subscriberId}/segments`,
        method: "POST",
        ...args,
      });
    },
    createOrUpdateSubscriber(args = {}) {
      return this._makeRequest({
        path: "/subscribers",
        method: "POST",
        ...args,
      });
    },
  },
};
