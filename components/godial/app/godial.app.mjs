import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "godial",
  propDefinitions: {
    teamId: {
      label: "Team ID",
      description: "The team ID",
      type: "string",
      async options() {
        const teams = await this.getTeams();

        return teams.map((team) => ({
          value: team.id,
          label: team.name,
        }));
      },
    },
    listId: {
      label: "List ID",
      description: "The list ID",
      type: "string",
      async options() {
        const lists = await this.getLists();

        return lists.map((list) => ({
          value: list.id,
          label: list.name,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://enterprise.godial.cc/meta/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          access_token: this._apiToken(),
        },
      });
    },
    async addList(args = {}) {
      return this._makeRequest({
        path: "/externals/lists/add",
        method: "post",
        ...args,
      });
    },
    async addContact(args = {}) {
      return this._makeRequest({
        path: "/externals/contact/add",
        method: "post",
        ...args,
      });
    },
    async addMember(args = {}) {
      return this._makeRequest({
        path: "/externals/accounts/add",
        method: "post",
        ...args,
      });
    },
    async getTeams(args = {}) {
      return this._makeRequest({
        path: "/externals/team/list",
        ...args,
      });
    },
    async getLists(args = {}) {
      return this._makeRequest({
        path: "/externals/lists/list",
        ...args,
      });
    },
    async getContacts({
      listId, ...args
    }) {
      return this._makeRequest({
        path: `/externals/contact/list/${listId}`,
        ...args,
      });
    },
  },
};
