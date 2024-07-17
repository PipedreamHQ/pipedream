import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "waitlist",
  propDefinitions: {
    waitlistId: {
      type: "string",
      label: "Waitlist Id",
      description: "The ID of your waitlist.",
      async options() {
        const waitlists = await this.listWaitlists();

        return waitlists.map(({
          id: value, waitlist_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getwaitlist.com/api/v1";
    },
    _headers() {
      return {
        "Content-Type": "application/json",
        "api-key": `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    listWaitlists(opts = {}) {
      return this._makeRequest({
        path: "/waitlist",
        ...opts,
      });
    },
    listSignups({
      waitlistId, ...opts
    }) {
      return this._makeRequest({
        path: `/signup/waitlist/${waitlistId}`,
        ...opts,
      });
    },
  },
};
