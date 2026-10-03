import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sibfly",
  propDefinitions: {
    address: {
      type: "string",
      label: "Address",
      description: "A US street address, for example `1100 Congress Ave, Austin, TX`. Provide this or latitude + longitude.",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Latitude",
      description: "Latitude (use together with Longitude instead of Address).",
      optional: true,
    },
    lon: {
      type: "string",
      label: "Longitude",
      description: "Longitude (use together with Latitude instead of Address).",
      optional: true,
    },
    dryRun: {
      type: "boolean",
      label: "Dry Run (Free Preview)",
      description: "Return a free coverage + price preview (`would_cost_usd`) without buying the report or being charged.",
      optional: true,
    },
    addresses: {
      type: "string[]",
      label: "Addresses",
      description: "A list of US addresses to check in a single batch (up to 1000). Only covered rows are billed.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://sibfly.com/api/v1";
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...args,
      });
    },
    _location({
      address, lat, lon,
    }) {
      if (address) {
        return { address };
      }
      return { lat, lon };
    },
    checkGroundMotion({
      address, lat, lon, dryRun, ...args
    } = {}) {
      const params = this._location({ address, lat, lon });
      if (dryRun) {
        params.dry_run = 1;
      }
      return this._makeRequest({
        path: "/motion",
        params,
        ...args,
      });
    },
    checkCoverage({
      address, lat, lon, ...args
    } = {}) {
      return this._makeRequest({
        path: "/coverage",
        params: this._location({ address, lat, lon }),
        ...args,
      });
    },
    checkPortfolio(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/motion/batch",
        ...args,
      });
    },
    getBalance(args = {}) {
      return this._makeRequest({
        path: "/balance",
        ...args,
      });
    },
  },
};
