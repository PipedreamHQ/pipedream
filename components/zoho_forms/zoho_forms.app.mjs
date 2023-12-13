import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_forms",
  propDefinitions: {
    base_url: {
      type: "string",
      label: "Base URL",
      description: "The base URL of your Creator account. E.g., 'creator.zoho.com' for Zoho's US DC, 'creator.zoho.eu' for Zoho's EU DC.",
    },
    account_owner_name: {
      type: "string",
      label: "Account Owner Name",
      description: "The username of the Creator account's owner.",
    },
    app_link_name: {
      type: "string",
      label: "Application Link Name",
      description: "The link name of the application from which you want to fetch the form meta information.",
    },
    environment: {
      type: "string",
      label: "Environment",
      description: "The environment stage (development/stage/production). By default, 'production' is considered.",
      options: [
        {
          label: "Development",
          value: "development",
        },
        {
          label: "Stage",
          value: "stage",
        },
        {
          label: "Production",
          value: "production",
        },
      ],
      optional: true,
      default: "production",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.base_url}`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async getForms({
      account_owner_name, app_link_name, environment,
    }) {
      const path = `/api/v2.1/${account_owner_name}/${app_link_name}/forms`;
      const headers = {};
      if (environment && environment !== "production") {
        headers["X-com-zoho-environment"] = environment;
      }
      return this._makeRequest({
        path,
        headers,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
