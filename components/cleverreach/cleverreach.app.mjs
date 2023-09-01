import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cleverreach",
  propDefinitions: {
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the mailing list",
      async options() {
        const { data } = await this.listGroups();
        return data.map((group) => ({
          value: group.id,
          label: group.name,
        }));
      },
    },
    receiverId: {
      type: "string",
      label: "Subscriber ID",
      description: "The ID of the subscriber",
      async options({ groupId }) {
        const { data } = await this.listReceivers({
          groupId,
        });
        return data.map((receiver) => ({
          value: receiver.id,
          label: receiver.email,
        }));
      },
    },
    receiverData: {
      type: "object",
      label: "Receiver Data",
      description: "The data of the receiver (subscriber)",
    },
  },
  methods: {
    async _makeRequest($ = this, opts) {
      const {
        method = "get",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `https://rest.cleverreach.com/v3${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createSubscriber($, params) {
      const {
        groupId, receiverData,
      } = params;
      return this._makeRequest($, {
        method: "POST",
        path: `/groups/${groupId}/receivers`,
        data: receiverData,
      });
    },
    async updateSubscriber($, params) {
      const {
        groupId, receiverId, receiverData,
      } = params;
      return this._makeRequest($, {
        method: "PUT",
        path: `/groups/${groupId}/receivers/${receiverId}`,
        data: receiverData,
      });
    },
    async listReceivers($, params) {
      const { groupId } = params;
      return this._makeRequest($, {
        method: "GET",
        path: `/groups/${groupId}/receivers`,
      });
    },
    async listGroups($) {
      return this._makeRequest($, {
        method: "GET",
        path: "/groups",
      });
    },
  },
};
