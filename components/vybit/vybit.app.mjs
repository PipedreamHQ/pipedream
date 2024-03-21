import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vybit",
  propDefinitions: {
    vybitId: {
      type: "string",
      label: "Vybit ID",
      description: "Select a Vybit, or provide a Vybit ID.",
      async options() {
        const item = await this.listVybits();
        return item?.map(({
          triggerKey, name,
        }) => ({
          label: name,
          value: triggerKey,
        }));
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Accept-Charset": "utf-8",
          "Authorization": `${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listVybits() {
      return this._makeRequest({
        url: "https://app.vybit.net/rest/vybits",
      });
    },
    async sendVybit({
      vybitId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        url: `https://vybit.net/trigger/${vybitId}`,
        ...args,
      });
    },
  },
};
