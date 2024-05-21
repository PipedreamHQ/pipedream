import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "appwrite",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team ID",
      description: "Team ID. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore",
      async options() {
        const response = await this.getTeams({});
        const teamsIds = response.teams;
        return teamsIds.map(({
          $id, name,
        }) => ({
          value: $id,
          label: name,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "User email",
    },
    password: {
      type: "string",
      label: "Password",
      description: "User password. Must be at least 8 characters",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Choose a custom ID. Valid chars are a-z, A-Z, 0-9, period, hyphen, and underscore",
    },
    name: {
      type: "string",
      label: "Name",
      description: "User name",
    },
    roles: {
      type: "string[]",
      label: "Roles",
      description: "Use this prop to set the roles in the team for the user who created it.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://cloud.appwrite.io/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "X-Appwrite-Project": `${this.$auth.project_id}`,
          "X-Appwrite-Key": `${this.$auth.api_key}`,
        },
      });
    },
    async createAccount(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/account",
        ...args,
      });
    },
    async createTeam(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/teams",
        ...args,
      });
    },
    async getMembers({
      teamId, ...args
    }) {
      return this._makeRequest({
        path: `/teams/${teamId}/memberships`,
        ...args,
      });
    },
    async getTeams(args = {}) {
      return this._makeRequest({
        path: "/teams",
        ...args,
      });
    },
  },
};
