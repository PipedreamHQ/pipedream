import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "detectify",
  propDefinitions: {
    domainToken: {
      type: "string",
      label: "Domain Token",
      description: "The asset token for the target domain",
      async options({ prevContext }) {
        const {
          assets, next_marker: marker,
        } = await this.listAssets({
          include_subdomains: true,
          marker: prevContext?.marker
            ? prevContext.marker
            : undefined,
        });
        return {
          options: assets?.map(({
            name, token,
          }) => ({
            label: name,
            value: token,
          })),
          context: {
            marker,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.detectify.com/rest/v2";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-Detectify-Key": `${this.$auth.api_key}`,
        },
      });
    },
    listAssets(opts = {}) {
      return this._makeRequest({
        path: "/assets/",
        ...opts,
      });
    },
    listScanProfilesForAsset({
      token, ...opts
    }) {
      return this._makeRequest({
        path: `/profiles/${token}/`,
        ...opts,
      });
    },
    listVulnerabilities(opts = {}) {
      return this._makeRequest({
        path: "/vulnerabilities/",
        ...opts,
      });
    },
  },
};
