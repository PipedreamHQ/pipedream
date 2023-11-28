import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "manychat",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user.",
    },
    tagId: {
      type: "string",
      label: "Tag Id",
      description: "The ID of the tag to add to the user.",
      async options() {
        const { data } = await this.listTags();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customFieldId: {
      type: "string",
      label: "Custom Field Id",
      description: "The ID of the custom field.",
      async options() {
        const { data } = await this.listCustomFields();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customFieldValue: {
      type: "string",
      label: "Custom Field Value",
      description: "The value of the custom field to search for.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.manychat.com/fb";
    },
    getHeaders() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
        accept: "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this.getHeaders(),
        ...opts,
      });
    },
    addTag(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriber/addTag",
        ...opts,
      });
    },
    findByCustomField(opts = {}) {
      return this._makeRequest({
        path: "/subscriber/findByCustomField",
        ...opts,
      });
    },
    getInfo(opts = {}) {
      return this._makeRequest({
        path: "/subscriber/getInfo",
        ...opts,
      });
    },
    listCustomFields() {
      return this._makeRequest({
        path: "/page/getCustomFields",
      });
    },
    listTags() {
      return this._makeRequest({
        path: "/page/getTags",
      });
    },
    sendContent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sending/sendContent",
        ...opts,
      });
    },
  },
};
