import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "manychat",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user",
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "The tag to add to the user",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to deliver to the user",
    },
    customField: {
      type: "string",
      label: "Custom Field",
      description: "The name of the custom field",
    },
    value: {
      type: "string",
      label: "Value",
      description: "The value of the custom field",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.manychat.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async addTag({
      userId, tag,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/fb/subscriber/addTag",
        data: {
          subscriber_id: userId,
          tag,
        },
      });
    },
    async removeTag({
      userId, tag,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/fb/subscriber/removeTag",
        data: {
          subscriber_id: userId,
          tag,
        },
      });
    },
    async sendContent({
      userId, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/fb/sending/sendContent",
        data: {
          subscriber_id: userId,
          message,
        },
      });
    },
    async findByCustomField({
      customField, value,
    }) {
      return this._makeRequest({
        method: "GET",
        path: "/fb/subscriber/findByCustomField",
        params: {
          field: customField,
          value,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
