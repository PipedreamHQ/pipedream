import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "status_hero",
  propDefinitions: {
    memberId: {
      type: "string",
      label: "Member Id",
      description: "The ID of the team member",
      async options({ page }) {
        const resp = await this.getMembers({
          params: {
            page: page + 1,
          },
        });
        return resp?.members.map((member) => ({
          label: member.username,
          value: member.id,
        }));
      },
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the absence to create (in `YYYY-MM-DD` format)",
    },
  },
  methods: {
    _getUrl(path) {
      return `https://service.statushero.com/api/v1${path}`;
    },
    _getHeaders(headers = {}) {
      return {
        "X-Team-ID": `${this.$auth.team_id}`,
        "X-API-Key": `${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "@PipedreamHQ/pipedream v0.1",
        ...headers,
      };
    },
    async _makeRequest({
      $,
      path,
      headers,
      ...otherConfig
    } = {}) {
      const config = {
        url: this._getUrl(path),
        headers: this._getHeaders(headers),
        ...otherConfig,
      };
      return axios($ ?? this, config);
    },
    async getMembers(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/members",
        ...args,
      });
    },
    async addMemberAbsence({
      memberId,
      ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/member_absences/${memberId}`,
        ...args,
      });
    },
    async addTeamAbsence(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/team_absences",
        ...args,
      });
    },
    async getComments(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/comments",
        ...args,
      });
    },
    async getReactions(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/reactions",
        ...args,
      });
    },
    async getStatuses(args = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/statuses",
        ...args,
      });
    },
  },
};
