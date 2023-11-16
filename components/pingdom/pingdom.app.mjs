import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pingdom",
  propDefinitions: {
    teamIds: {
      type: "integer[]",
      label: "Team Ids",
      description: "Teams to alert.",
      async options() {
        const { teams } = await this.listTeams();

        return teams.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    userIds: {
      type: "string[]",
      label: "User Ids",
      description: "User identifiers.",
      async options() {
        const { contacts } = await this.listContacts();

        return contacts.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pingdom.com/api/3.1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    createCheck(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/checks",
        ...opts,
      });
    },
    listActions(opts = {}) {
      return this._makeRequest({
        path: "/actions",
        ...opts,
      });
    },
    listChecks(opts = {}) {
      return this._makeRequest({
        path: "/checks",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/alerting/contacts",
        ...opts,
      });
    },
    listTeams(opts = {}) {
      return this._makeRequest({
        path: "/alerting/teams",
        ...opts,
      });
    },
  },
};
