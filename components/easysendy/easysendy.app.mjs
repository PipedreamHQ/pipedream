import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "easysendy",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email address.",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique identifier of the list to which the subscriber is being added.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The subscriber's name.",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "An array of custom fields for the subscriber, in the format 'key:value'.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.easysendy.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, data, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async addSubscriber({
      listId, email, name, customFields,
    }) {
      const subscriberData = {
        EMAIL: email,
        ...(name && {
          FNAME: name.split(" ")[0],
          LNAME: name.split(" ").slice(1)
            .join(" "),
        }),
        ...(customFields && customFields.reduce((acc, field) => {
          const [
            key,
            value,
          ] = field.split(":");
          acc[key.trim()] = value.trim();
          return acc;
        }, {})),
      };
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/subscribers/bulk`,
        data: {
          array: [
            subscriberData,
          ],
        },
      });
    },
  },
};
