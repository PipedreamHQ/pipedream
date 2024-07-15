import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "waitlist",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the waitlist",
    },
    subscriberId: {
      type: "string",
      label: "Subscriber ID",
      description: "The ID of the subscriber",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getwaitlist.com/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getListDetails({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/waitlist/${listId}`,
        ...opts,
      });
    },
    async getSubscriberDetails({
      subscriberId, ...opts
    }) {
      return this._makeRequest({
        path: `/signup/${subscriberId}`,
        ...opts,
      });
    },
    async emitNewListEvent(listId) {
      const listDetails = await this.getListDetails({
        listId,
      });
      this.$emit(listDetails, {
        name: "new_list",
        summary: `New list created with ID: ${listId}`,
      });
    },
    async emitNewSubscriberEvent(subscriberId) {
      const subscriberDetails = await this.getSubscriberDetails({
        subscriberId,
      });
      this.$emit(subscriberDetails, {
        name: "new_subscriber",
        summary: `New subscriber added with ID: ${subscriberId}`,
      });
    },
  },
};
