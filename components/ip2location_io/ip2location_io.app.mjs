import { axios } from "@pipedream/platform";

const BASE_URL = "https://api.ip2location.io";
const DOMAINS_URL = "https://domains.ip2whois.com/domains";

export default {
  type: "app",
  app: "ip2location_io",
  propDefinitions: {
    format: {
      type: "string",
      label: "Format",
      description: "Format of the response message. If unspecified, `json` format will be used for the response message.",
      options: [
        "json",
        "xml",
      ],
      optional: true,
    },
  },
  methods: {
    _params(params = {}) {
      return {
        ...params,
        key: `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      url,
      params,
      ...args
    }) {
      return axios($, {
        url,
        params: this._params(params),
        ...args,
      });
    },
    /**
     * Lookup geolocation information for an IP address
     * @param {Object} args - The arguments for the request
     * @param {Object} [args.params] - The query parameters
     * @param {string} [args.params.ip] - The IP address to lookup (IPv4 or IPv6)
     * @param {string} [args.params.format] - Response format (json or xml)
     * @param {string} [args.params.lang] - Translation information(ISO639-1) for 
     *                                      continent, country, 
     *                                      region and city name
     * @returns {Promise<Object>} The hosted domain information
     */
    lookupIpAddress(args = {}) {
      return this._makeRequest({
        url: BASE_URL,
        ...args,
      });
    },
    /**
     * Lookup hosted domains for an IP address
     * @param {Object} args - The arguments for the request
     * @param {Object} [args.params] - The query parameters
     * @param {string} [args.params.ip] - The IP address to lookup (IPv4 or IPv6)
     * @param {string} [args.params.format] - Response format (json or xml)
     * @param {number} [args.params.page] - Page number for pagination
     * @returns {Promise<Object>} The hosted domain information
     */
    lookupHostedDomain(args = {}) {
      return this._makeRequest({
        url: DOMAINS_URL,
        ...args,
      });
    },
  },
};
