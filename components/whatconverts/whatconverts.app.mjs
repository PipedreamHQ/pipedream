import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whatconverts",
  propDefinitions: {
    accountId: {
      type: "integer",
      label: "Account ID",
      description: "Your WhatConverts Account ID",
      optional: true,
      async options({ page }) {
        try {
          const { accounts } = await this.listAccounts({
            params: {
              page_number: page + 1,
            },
          });
          return accounts?.map(({
            account_id: value, account_name: label,
          }) => ({
            value,
            label,
          })) || [];
        } catch {
          return [];
        }
      },
    },
    profileId: {
      type: "integer",
      label: "Profile ID",
      description: "The ID of the profile the lead belongs to",
      optional: true,
      async options({
        page, accountId,
      }) {
        try {
          const { profiles } = await this.listProfiles({
            accountId,
            params: {
              page_number: page + 1,
            },
          });
          return profiles?.map(({
            profile_id: value, profile_name: label,
          }) => ({
            value,
            label,
          })) || [];
        } catch {
          return [];
        }
      },
    },
    leadType: {
      type: "string",
      label: "Lead Type",
      description: "Lead type to return for this request",
      options: [
        "appointment",
        "chat",
        "email",
        "event",
        "other",
        "phone_call",
        "text_message",
        "transaction",
        "web_form",
      ],
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.whatconverts.com/api/v1";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: {
          username: `${this.$auth.api_token}`,
          password: `${this.$auth.api_secret}`,
        },
        ...opts,
      });
    },
    listAccounts(opts = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...opts,
      });
    },
    listProfiles({
      accountId, ...opts
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/profiles`,
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads",
        ...opts,
      });
    },
    async *paginate({
      fn, params, resourceKey, max,
    }) {
      params = {
        ...params,
        leads_per_page: 2500,
        page_number: 1,
      };
      let hasMore, count = 0;
      do {
        const response = await fn({
          params,
        });
        const items = resourceKey
          ? response[resourceKey]
          : response;
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = params.page_number < response.total_pages;
        params.page_number++;
      } while (hasMore);
    },
  },
};
