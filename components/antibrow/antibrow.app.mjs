import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "antibrow",
  propDefinitions: {
    profileName: {
      type: "string",
      label: "Profile Name",
      description: "Name of a cloud-synced AntiBrow profile",
      async options() {
        const { profiles } = await this.listProfiles({});
        return profiles?.map(({ name }) => name) ?? [];
      },
    },
    proxyId: {
      type: "string",
      label: "Managed Proxy",
      description: "A managed proxy assigned to your account. The engine derives timezone, locale and geolocation from the exit IP.",
      optional: true,
      async options() {
        const { proxies } = await this.listProxies({});
        return proxies?.map(({ id, displayName }) => ({
          label: displayName ?? id,
          value: id,
        })) ?? [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://antibrow.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
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
    getAccount(opts = {}) {
      return this._makeRequest({
        path: "/account",
        ...opts,
      });
    },
    listProfiles(opts = {}) {
      return this._makeRequest({
        path: "/profiles",
        ...opts,
      });
    },
    getProfile({
      name, ...opts
    }) {
      return this._makeRequest({
        path: `/profiles/${encodeURIComponent(name)}`,
        ...opts,
      });
    },
    createProfile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/profiles",
        ...opts,
      });
    },
    deleteProfile({
      name, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/profiles/${encodeURIComponent(name)}`,
        ...opts,
      });
    },
    listProxies(opts = {}) {
      return this._makeRequest({
        path: "/proxies",
        ...opts,
      });
    },
  },
};
