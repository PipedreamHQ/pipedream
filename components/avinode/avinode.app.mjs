import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "avinode",
  propDefinitions: {},
  methods: {
    /**
     * API base URL (no trailing slash).
     * Uses `base_url` from the connected account or the Avinode sandbox default.
     */
    _baseUrl() {
      const raw =
        this.$auth.base_url?.toString?.() || "https://sandbox.avinode.com/api";
      return raw.replace(/\/+$/, "");
    },
    /**
     * Headers required by Avinode Marketplace / Trip Manager APIs.
     */
    _headers() {
      const accessToken = this.$auth.access_token?.toString?.();
      const apiToken = this.$auth.api_token?.toString?.();
      if (!accessToken) {
        throw new Error(
          "Authentication token is required. Add it in your Avinode connected account.",
        );
      }
      if (!apiToken) {
        throw new Error(
          "API token (X-Avinode-ApiToken) is required. Add it in your Avinode connected account.",
        );
      }
      const productName =
        this.$auth.product_name?.toString?.() || "Pipedream/1.0";
      const headers = {
        "Authorization": `Bearer ${accessToken}`,
        "X-Avinode-ApiToken": apiToken,
        "X-Avinode-Product": productName,
        "X-Avinode-SentTimestamp": new Date().toISOString(),
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
      const actAs = this.$auth.act_as_account?.toString?.();
      if (actAs) {
        headers["X-Avinode-ActAsAccount"] = actAs;
      }
      return headers;
    },
    /**
     * @param {object} opts
     * @param {*} [opts.$] - Pipedream context (`$`) for axios
     * @param {string} opts.path - Path beginning with `/`
     * @param {string} [opts.method]
     * @param {object} [opts.data]
     * @param {object} [opts.params] - Query string params (use `path` for repeated keys)
     */
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      data,
      params,
      ...args
    }) {
      const base = this._baseUrl();
      const p = path.startsWith("/")
        ? path
        : `/${path}`;
      return axios($, {
        url: `${base}${p}`,
        method,
        headers: this._headers(),
        data,
        params,
        ...args,
      });
    },
    /**
     * Create a trip (POST /trips).
     * @see https://developer.avinodegroup.com/reference/createtrip
     * @param {object} opts
     * @param {*} [opts.$]
     * @param {object} opts.data - Create trip request body
     * @returns {Promise<object>} Parsed JSON response body
     */
    async createTrip({
      $ = this,
      data,
    } = {}) {
      if (!data || typeof data !== "object") {
        throw new Error("Trip payload is required");
      }
      return this._makeRequest({
        $,
        path: "/trips",
        method: "POST",
        data,
      });
    },
  },
};
