import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reward_sciences",
  propDefinitions: {
    idp: {
      type: "string",
      label: "IDP",
      description: "The identity provider can anything that represents the provider uniquely for your merchant. Examples: `CRM`, `internal-system`, `facebook`, `X` or whatever you prefer.",
    },
    identity: {
      type: "string",
      label: "Identity",
      description: "The identity field specifies a unique identifier for the user withing the context of the specified provider. Values are also arbitrary, they could represent a user ID within an external platform or anything that can uniquely identify a user within it.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rewardsciences.com";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Accept": "application/vnd.rewardsciences.v2+json",
          "Content-Type": "application/json",
          "Version": "HTTP/1.0",
        },
        ...opts,
      });
    },
    listParticipants(opts = {}) {
      return this._makeRequest({
        path: "/participants",
        ...opts,
      });
    },
    listActivities(opts = {}) {
      return this._makeRequest({
        path: "/activities",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    trackActivity(opts = {}) {
      return this._makeRequest({
        path: "/activities",
        method: "POST",
        ...opts,
      });
    },
    createUser({
      idp, identity, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/idps/${idp}/${encodeURIComponent(identity)}/user`,
        ...opts,
      });
    },
  },
};
