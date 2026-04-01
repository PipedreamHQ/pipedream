import { axios } from "@pipedream/platform";

/**
 * Business Edge (CI, Inc.) — DevKey auth: `Authorization: Basic base64("DevKey:" + dev_key)`.
 * Configure the Pipedream app account with `base_url` (no trailing slash, e.g. https://hangerbolt.ci-inc.com) and `dev_key`.
 */
export default {
  type: "app",
  app: "business_edge",
  methods: {
    /**
     * Normalize configured base URL (no trailing slash).
     * @returns {string}
     */
    _baseUrl() {
      const raw = this.$auth?.base_url ?? "";
      return String(raw).replace(/\/+$/, "");
    },
    /**
     * Authorization header for DevKey (Basic `DevKey:<dev_key>`).
     * @returns {string}
     */
    _authorizationHeader() {
      const devKey = this.$auth?.dev_key ?? "";
      const token = Buffer.from(`DevKey:${devKey}`, "utf8").toString("base64");
      return `Basic ${token}`;
    },
    /**
     * Throws if the API body indicates failure (HTTP may still be 200).
     * @param {object} data Parsed JSON response body
     */
    _throwIfApiError(data) {
      if (!data || typeof data !== "object") {
        return;
      }
      if (data.Success !== false) {
        return;
      }
      throw new Error(`Business Edge API error: ${JSON.stringify(data)}`);
    },
    /**
     * POST JSON to a Business Edge export endpoint.
     * @param {object} opts
     * @param {object} opts.$ Pipedream context passed to axios
     * @param {string} opts.endpoint Path beginning with `/`, e.g. `/masterfiles/customerV3/export.json`
     * @param {object} opts.data Request body
     * @returns {Promise<object>}
     */
    async postExport({
      $, endpoint, data,
    }) {
      const url = `${this._baseUrl()}${endpoint}`;
      const response = await axios($, {
        method: "POST",
        url,
        headers: {
          Authorization: this._authorizationHeader(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        data,
      });
      this._throwIfApiError(response);
      return response;
    },
  },
};
