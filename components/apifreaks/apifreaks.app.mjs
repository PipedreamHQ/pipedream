import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "apifreaks",
  propDefinitions: {
    country: {
      type: "string",
      label: "Country",
      description: "Country code in ISO 3166-1 alpha-2 format.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "Historical date in `YYYY-MM-DD` format.",
      optional: true,
    },
    destroy: {
      type: "string",
      label: "Destroy",
      description: "If set to `true`, the input file(s) will be permanently deleted from the server immediately after the output PDF is generated.",
      optional: true,
    },
    domainName: {
      type: "string",
      label: "Domain Name",
      description: "Domain name for WHOIS lookup",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "End date in `YYYY-MM-DD` format. Defaults to yesterday.",
      optional: true,
    },
    excludes: {
      type: "string",
      label: "Excludes",
      description: "Comma-separated list of fields to exclude from the response (except \"ip\").",
      optional: true,
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "Comma-separated list of fields to include in the response. Can include \"geo\".",
      optional: true,
    },
    fileId: {
      type: "string",
      label: "File Id",
      description: "The unique ID of a PDF file already uploaded to the API Freaks server. Use this as an alternative to uploading a new file directly.",
      optional: true,
    },
    imageSmoothing: {
      type: "string",
      label: "Image Smoothing",
      description: "Determines the smoothing options to apply during image conversion. Valid values are 'none', 'all' or a combination of 'text', 'line', and 'image' (comma-separated).If not provided, no smoothing will be applied.",
      optional: true,
    },
    ip: {
      type: "string",
      label: "Ip",
      description: "IP(v4 or v6) address for location inference.",
      optional: true,
    },
    lat: {
      type: "string",
      label: "Lat",
      description: "Latitude of the location.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "City name, place name, or full address.",
      optional: true,
    },
    long: {
      type: "string",
      label: "Long",
      description: "Longitude of the location.",
      optional: true,
    },
    page: {
      type: "string",
      label: "Page",
      description: "Page number for paginated results.",
      optional: true,
    },
    pages: {
      type: "string",
      label: "Pages",
      description: "Specifies the pages or ranges at which to split the PDF. Accepts individual page numbers (e.g., '1') and/or page ranges (e.g., '4-2', 'last'). Ranges can be ascending or descending. Use commas to separate entries and hyphens for ranges. Alternatively",
      optional: true,
    },
    resolution: {
      type: "string",
      label: "Resolution",
      description: "Specifies the resolution (in DPI) for the output images. Acceptable Range is from 20 to 1200.",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date in `YYYY-MM-DD` format.",
      optional: true,
    },
    symbols: {
      type: "string",
      label: "Symbols",
      description: "Comma-separated currency codes. Omit to get all available rates.",
      optional: true,
    },
    text: {
      type: "string",
      label: "Text",
      description: "Text to correct",
      optional: true,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "Timezone for the results.",
      optional: true,
    },
    webhookFailureNotification: {
      type: "string",
      label: "Webhook Failure Notification",
      description: "If true, a notification will also be sent by email in case the webhook request fails all the retries. The email notification will be sent to the requesting user or their organization’s admin if part of one.",
      optional: true,
    },
    webhookUrl: {
      type: "string",
      label: "Webhook Url",
      description: "The URL to which the webhook notification will be sent after the task is completed.",
      optional: true,
    },
  },
  methods: {
    /**
     * Base URL for all APIFreaks API requests.
     * @returns {string} The API base URL.
     */
    _baseUrl() {
      return "https://api.apifreaks.com";
    },
    /**
     * Builds the auth headers sent on every request.
     * @returns {object} Headers including the APIFreaks API key.
     */
    _headers() {
      return {
        "X-apiKey": `${this.$auth.api_key}`,
      };
    },
    /**
     * Makes an authenticated request to the APIFreaks API.
     * @param {object} opts - Request options.
     * @param {object} [opts.$] - The Pipedream step context ($).
     * @param {string} opts.path - Path appended to the base URL (e.g. "/v1.0/geolocation/lookup").
     * @param {object} [opts.params] - Query string parameters.
     * @param {object} [opts.data] - JSON request body (for POST requests).
     * @returns {Promise<object>} The parsed API response.
     */
    async _makeRequest({
      $ = this, path, params = {}, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params: {
          ...params,
          // APIFreaks accepts the key via header and/or query param; send both
          // for maximum compatibility across endpoints.
          apiKey: `${this.$auth.api_key}`,
        },
        ...args,
      });
    },
  },
};
