import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cleverreach",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The group (mailing list) of the subscriber",
      async options() {
        const groups = await this.listGroups();
        return groups.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    receiverId: {
      type: "string",
      label: "Subscriber ID",
      description: "The receiver (subscriber) to be updated",
      async options({ groupId }) {
        const receivers = await this.listReceivers({
          groupId,
        });
        return receivers.map(({
          id, email,
        }) => ({
          value: id,
          label: email,
        }));
      },
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of this subscriber",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for this subscriber",
      optional: true,
    },
    additionalData: {
      type: "object",
      label: "Additional Data",
      description: "Any additional params to be passed to the request. [See the documentation](https://rest.cleverreach.com/explorer/v3/#!/groups-v3/update__put) for available fields",
      optional: true,
    },
  },
  methods: {
    async _makeRequest(opts) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `https://rest.cleverreach.com${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createWebhook(data) {
      return this._makeRequest({
        method: "POST",
        path: "/hooks/eventhook",
        data,
      });
    },
    async deleteWebhook(event) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/eventhook/${event}`,
      });
    },
    async createSubscriber({
      groupId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/v3/groups/${groupId}/receivers`,
        ...args,
      });
    },
    async updateSubscriber({
      groupId, receiverId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/v3/groups/${groupId}/receivers/${receiverId}`,
        ...args,
      });
    },
    async listReceivers({
      groupId, ...args
    }) {
      return this._makeRequest({
        path: `/v3/groups/${groupId}/receivers`,
        ...args,
      });
    },
    async listGroups() {
      return this._makeRequest({
        path: "/v3/groups",
      });
    },
  },
};
