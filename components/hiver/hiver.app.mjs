import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hiver",
  propDefinitions: {
    inboxId: {
      type: "string",
      label: "Inbox ID",
      description: "The ID of the Hiver inbox",
      async options({ prevContext }) {
        const response = await this.listInboxes({
          params: {
            limit: 50,
            next_page: prevContext?.nextPage ?? undefined,
          },
        });
        const options = response.results.map((inbox) => ({
          label: inbox.display_name,
          value: inbox.id,
        }));
        return {
          options,
          context: {
            nextPage: response.pagination?.next_page ?? null,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api2.hiverhq.com/v1";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this, path, headers = {}, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...opts,
      });
    },
    async listInboxes({ $ = this, params } = {}) {
      return this._makeRequest({
        $,
        path: "/inboxes",
        params,
      });
    },
    async getInbox({ $, inboxId }) {
      return this._makeRequest({
        $,
        path: `/inboxes/${inboxId}`,
      });
    },
    async listInboxUsers({ $, inboxId, params } = {}) {
      return this._makeRequest({
        $,
        path: `/inboxes/${inboxId}/users`,
        params,
      });
    },
    async listInboxTags({ $, inboxId, params } = {}) {
      return this._makeRequest({
        $,
        path: `/inboxes/${inboxId}/tags`,
        params,
      });
    },
    async listConversations({ $, inboxId, params } = {}) {
      return this._makeRequest({
        $,
        path: `/inboxes/${inboxId}/conversations`,
        params,
      });
    },
  },
};
