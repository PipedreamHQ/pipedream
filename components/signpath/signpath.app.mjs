import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "signpath",
  propDefinitions: {
    signingPolicySlug: {
      type: "string",
      label: "Signing Policy Slug",
      description: "Signing policy for which you want to create the signing request",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the signing request",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `https://app.signpath.io/API/v1/${this.$auth.organization_id}`;
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    getSigningRequestData({
      signingRequestId, ...opts
    }) {
      return this._makeRequest({
        path: `/SigningRequests/${signingRequestId}`,
        ...opts,
      });
    },
    submitSigningRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/SigningRequests/SubmitWithArtifact",
        ...opts,
      });
    },
    resubmitSigningRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/SigningRequests/Resubmit",
        ...opts,
      });
    },
  },
};
