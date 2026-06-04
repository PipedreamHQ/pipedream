import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deel",
  propDefinitions: {
    contractId: {
      type: "string",
      label: "Contract ID",
      description: "The unique identifier of the Deel contract. Use **List Contracts** to find contract IDs.",
    },
    workerId: {
      type: "string",
      label: "Worker ID",
      description: "The unique identifier of the Deel worker (employee). Obtain from a contract's worker details.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "ISO 3166-1 alpha-2 country code (e.g., `DE` for Germany, `GB` for United Kingdom, `US` for United States).",
    },
    clientTeamId: {
      type: "string",
      label: "Client Team ID",
      description: "The ID of the client team (department) for this contract. Retrieve from your Deel organization settings.",
    },
    clientLegalEntityId: {
      type: "string",
      label: "Client Legal Entity ID",
      description: "The ID of the client legal entity (company) for this contract. Retrieve from your Deel organization settings.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.letsdeel.com/rest/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      data,
      params,
      headers = {},
      ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        data,
        params,
        ...opts,
      });
    },
  },
};
