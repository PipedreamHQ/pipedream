import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "tawk_to",
  propDefinitions: {
    type: {
      type: "string",
      label: "Type",
      description: "Type to filter property to",
      options: [
        "business",
        "profile",
      ],
    },
    propertyId: {
      type: "string",
      label: "Property ID",
      description: "Identifier of the property to watch",
      async options({ type }) {
        const { data } = await this.listProperties({
          data: {
            type,
          },
        });
        return data?.map(({
          propertyId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.tawk.to/v1";
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
        auth: {
          username: `${this.$auth.api_key}`,
          password: "f",
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    listProperties(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/property.list",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks.create",
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks.delete",
        ...opts,
      });
    },
  },
};
