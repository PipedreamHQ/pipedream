import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/contants.mjs";

export default {
  type: "app",
  app: "postalytics",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique identifier for a campaign",
      async options({ flagId }) {
        const campaigns = await this.listCampaigns();

        return campaigns.map(({
          endpoint, drop_id, name: label,
        }) => ({
          label,
          value: flagId
            ? drop_id
            : endpoint,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique identifier for a contact list",
      async options() {
        const data = await this.listLists();
        return data.map(({
          contact_list_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.postalytics.com/api/v1";
    },
    _auth() {
      return {
        "username": `${this.$auth.api_key}`,
        "password": "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        auth: this._auth(),
        ...opts,
      });
    },
    listContacts({
      listId, ...opts
    }) {
      return this._makeRequest({
        path: `/contacts/${listId}`,
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listCampaigns() {
      return this._makeRequest({
        path: "/campaigns",
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createHook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
      });
    },
    sendMailPiece({
      campaignId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/send/${campaignId}`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.start = (LIMIT * page) + page;
        params.limit = LIMIT;
        page++;

        let data;
        try {

          data = await fn({
            params,
            ...opts,
          });
        } catch (error) {
          if (error.message === "\"No contacts received\"") {
            return;
          }
          throw Error(error);
        }

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
