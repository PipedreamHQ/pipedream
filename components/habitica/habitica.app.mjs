import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "habitica",
  propDefinitions: {
    group: {
      type: "string",
      label: "Group",
      description: "ID of the group to which the challenge belongs",
      async options({ type }) {
        const response = await this.getGroups({
          type,
        });
        const groups = response.data;
        return groups.map(({
          name, _id,
        }) => ({
          label: name,
          value: _id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Full name of the challenge",
    },
    shortName: {
      type: "string",
      label: "Short Name",
      description: "A shortened name for the challenge, to be used as a tag",
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "A short summary advertising the main purpose of the challenge",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A detailed description of the challenge",
      optional: true,
    },
    official: {
      type: "boolean",
      label: "Official",
      description: "Whether or not a challenge is an official Habitica challenge",
      optional: true,
    },
    prize: {
      type: "string",
      label: "Prize",
      description: "Number of gems offered as a prize to challenge winner",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Type of the group",
      options: constants.GROUP_TYPES,
    },
    challengeId: {
      type: "string",
      label: "Challenge ID",
      description: "ID of the challenge to update",
      async options({ page }) {
        const response = await this.getChallenges({
          params: {
            page: page,
          },
        });
        const challenges = response.data;
        return challenges.map(({
          name, _id,
        }) => ({
          label: name,
          value: _id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://habitica.com/api/v3";
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
          "x-client": "3a326108-1895-4c23-874e-37668c75f2ad-Pipedream",
          "x-api-user": `${this.$auth.user_id}`,
          "x-api-key": `${this.$auth.api_token}`,
        },
      });
    },
    async createChallenge(args = {}) {
      return this._makeRequest({
        path: "/challenges",
        method: "post",
        ...args,
      });
    },
    async deleteChallenge({
      challengeId, ...args
    }) {
      return this._makeRequest({
        path: `/challenges/${challengeId}`,
        method: "delete",
        ...args,
      });
    },
    async getChallenge({
      challengeId, ...args
    }) {
      return this._makeRequest({
        path: `/challenges/${challengeId}`,
        ...args,
      });
    },
    async getGroups({
      type, ...args
    }) {
      return this._makeRequest({
        path: "/groups",
        params: {
          type: type,
        },
        ...args,
      });
    },
    async getChallenges(args = {}) {
      return this._makeRequest({
        path: "/challenges/user",
        ...args,
      });
    },
  },
};
