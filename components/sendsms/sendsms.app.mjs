import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendsms",
  propDefinitions: {
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "The ID of the group to add the contact to.",
      async options({ page }) {
        const { details } = await this.listGroups({
          params: {
            page,
          },
        });

        return details.map(({
          id, name: label,
        }) => ({
          label,
          value: parseInt(id),
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sendsms.ro/json";
    },
    _params(params) {
      return {
        ...params,
        username: `${this.$auth.username}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, params, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        params: this._params(params),
      });
    },
    listGroups({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          ...params,
          action: "address_book_groups_get_list",
        },
        ...opts,
      });
    },
    sendSms({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          action: "message_send",
          ...params,
        },
        ...opts,
      });
    },
    sendSmsGDPR({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          action: "message_send_gdpr",
          ...params,
        },
        ...opts,
      });
    },
    checkBlocklist({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          action: "blocklist_check",
          ...params,
        },
        ...opts,
      });
    },
    addContact({
      params, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          action: "address_book_contact_add",
          ...params,
        },
        ...opts,
      });
    },
  },
};
