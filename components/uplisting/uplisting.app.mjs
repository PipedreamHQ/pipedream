import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "uplisting",
  propDefinitions: {
    propertyId: {
      type: "string",
      label: "Property Id",
      description: "The id of the property that will be used to the booking.",
      async options({ page }) {
        const { data } = await this.listProperties({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, attributes: { name: label },
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl(version = "") {
      // Staging -> https://connect.staging-uplisting.io
      return `https://connect.uplisting.io${version
        ? `/${version}`
        : ""}`;
    },
    _getHeaders(headers = {}) {
      const base64_encoded_api_key = Buffer.from(this.$auth.api_key).toString("base64");
      return {
        "Authorization": `Basic ${base64_encoded_api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, version, ...opts
    }) {
      const config = {
        url: `${this._apiUrl(version)}/${path}`,
        headers: this._getHeaders(headers),
        ...opts,
      };

      return axios($, config);
    },
    createBooking(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "bookings",
        version: "v2",
        ...args,
      });
    },
    createHook(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "hooks",
        ...args,
      });
    },
    deleteHook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: `hooks/${id}`,
      });
    },
    listProperties(args = {}) {
      return this._makeRequest({
        path: "properties",
        ...args,
      });
    },
  },
};
