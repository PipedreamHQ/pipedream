import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bubble",
  propDefinitions: {
    typeName: {
      type: "string",
      label: "Data Type Name",
      description: "The name of the data type (e.g., `customer`, `product`). The API will convert this to lowercase with spaces removed.",
    },
    thingId: {
      type: "string",
      label: "Thing ID",
      description: "The unique ID of the thing to retrieve or modify",
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "An object containing field names and their values (e.g., `{\"name\": \"John\", \"email\": \"john@example.com\"}`)",
    },
  },
  methods: {
    getUrl(path) {
      return `${this.$auth.root_url}${path}`;
    },
    getHeaders(headers) {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
        ...opts,
      });
    },
    createThing({
      typeName, ...opts
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/${typeName}`,
        ...opts,
      });
    },
    getThing({
      typeName, thingId, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/${typeName}/${thingId}`,
        ...opts,
      });
    },
    searchThings({
      typeName, ...opts
    } = {}) {
      return this._makeRequest({
        path: `/${typeName}`,
        ...opts,
      });
    },
  },
};
