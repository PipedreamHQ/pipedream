import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "dealmachine",
  propDefinitions: {
    leadId: {
      type: "string",
      label: "Lead Id",
      description: "The Id of the lead.",
      async options({ page }) {
        const { data } = await this.listLeads({
          params: {
            after: page * LIMIT,
          },
        });

        return data.map(({
          id: value, property_address_full: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tagIds: {
      type: "string[]",
      label: "Tag Ids",
      description: "The id of the tags.",
      async options() {
        const { data } = await this.listTags();

        return data.map(({
          id: value, label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.dealmachine.com/public/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    addLead(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "leads/",
        ...args,
      });
    },
    addTagsToLead({
      leadId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `leads/${leadId}/add-tags`,
        ...args,
      });
    },
    createNote({
      leadId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `leads/${leadId}/create-note`,
        ...args,
      });
    },
    listLeads(args = {}) {
      return this._makeRequest({
        path: "leads/",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "tags/",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.after = page * LIMIT;
        page++;
        const { data } = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = !(data.length < LIMIT);

      } while (hasMore);
    },
  },
};
