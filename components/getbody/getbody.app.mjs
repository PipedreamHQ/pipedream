import { axios } from "@pipedream/platform";

const DOCS_URL = "https://getbody.md/llms.txt";

export default {
  type: "app",
  app: "getbody",
  propDefinitions: {
    robotType: {
      type: "string",
      label: "Robot Type",
      description: "The kind of robot, e.g. `arm` or `quadruped`",
      options: [
        "humanoid",
        "quadruped",
        "wheeled",
        "arm",
        "drone",
        "other",
      ],
      optional: true,
    },
    interfaceMode: {
      type: "string",
      label: "Body Kind",
      description: "`real` for physical hardware, `simulated` for a simulator",
      options: [
        "real",
        "simulated",
      ],
    },
  },
  methods: {
    /**
     * The base URL of GetBody's REST API (the `servers` URL in
     * https://getbody.md/openapi.json).
     *
     * @returns {string} The base URL
     */
    _baseUrl() {
      return "https://getbody.md/api";
    },
    /**
     * Make a request to GetBody's REST API. Turns GetBody's error responses
     * (`{code, error}`, and `retry_after` on 429) into readable errors.
     *
     * @param {object} opts - Options for the request
     * @param {object} [opts.$=this] - The Pipedream step context
     * @param {string} opts.path - The path, relative to the base URL
     * @returns {Promise<object>} The response data (or the full response when
     * `returnFullResponse` is set)
     */
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      try {
        return await axios($, {
          url: `${this._baseUrl()}${path}`,
          ...opts,
        });
      } catch (err) {
        const status = err.response?.status;
        const data = err.response?.data || {};
        if (status === 429) {
          const retryAfter = data.retry_after || err.response.headers?.["retry-after"];
          throw new Error(`GetBody rate limit reached: try again in ${retryAfter || "a few"} seconds. See ${DOCS_URL} for the limits.`);
        }
        if (status) {
          const detail = data.error || data.detail || JSON.stringify(data);
          throw new Error(`GetBody returned ${status}${data.code
            ? ` (${data.code})`
            : ""}: ${detail}`);
        }
        throw err;
      }
    },
    /**
     * Match a plain-language task to robots listed on GetBody. Books nothing;
     * the request is recorded so GetBody can follow up if nothing fits yet.
     *
     * @param {object} opts - Options for the request, including `data`
     * (`task`, and optionally `location`, `when` and `notify_email`)
     * @returns {Promise<object>} `{status, request_id, message, matches, booked}`
     */
    findRobotForTask(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/task-requests",
        ...opts,
      });
    },
    /**
     * List public listings (safe fields only). Totals come back in the
     * `X-Total-Count` and `X-Truncated` headers.
     *
     * @param {object} opts - Options for the request, including `params`
     * (filters, `limit` and `offset`)
     * @returns {Promise<object>} The full response (`data` is an array)
     */
    listPublicListings(opts = {}) {
      return this._makeRequest({
        path: "/listings/public",
        returnFullResponse: true,
        ...opts,
      });
    },
    /**
     * Suggest asking rates (USD) for a new listing.
     *
     * @param {object} opts - Options for the request, including `params`
     * (`interface_mode`, and optionally `robot_type` and `declared_value`)
     * @returns {Promise<object>} `{pricing, basis, similar_listings, note}`
     */
    suggestPrice(opts = {}) {
      return this._makeRequest({
        path: "/listings/price-suggestion",
        ...opts,
      });
    },
  },
};
