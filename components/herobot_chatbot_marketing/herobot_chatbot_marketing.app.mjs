import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "herobot_chatbot_marketing",
  propDefinitions: {
    userId: {
      type: "string",
      label: "User ID",
      description: "The unique identifier for the user.",
    },
    contentMessage: {
      type: "string",
      label: "Content Message",
      description: "The message content to send to the user.",
    },
    tagName: {
      type: "string",
      label: "Tag Name",
      description: "The name of the tag.",
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The unique identifier for the tag.",
      optional: true,
    },
    customFieldName: {
      type: "string",
      label: "Custom Field Name",
      description: "The name of the custom field.",
    },
    customFieldType: {
      type: "string",
      label: "Custom Field Type",
      description: "The type of the custom field.",
      options: [
        {
          label: "Text",
          value: "text",
        },
        {
          label: "Number",
          value: "number",
        },
        {
          label: "Boolean",
          value: "boolean",
        },
        {
          label: "Date",
          value: "date",
        },
      ],
    },
    newUserDetails: {
      type: "object",
      label: "New User Details",
      description: "The details of the new user including required and optional properties.",
    },
    flowId: {
      type: "string",
      label: "Flow ID",
      description: "The unique identifier for the flow.",
      optional: true,
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The unique identifier for the product.",
      optional: true,
    },
    orderId: {
      type: "string",
      label: "Order ID",
      description: "The unique identifier for the order.",
      optional: true,
    },
    customFieldId: {
      type: "string",
      label: "Custom Field ID",
      description: "The unique identifier for the custom field.",
      optional: true,
    },
    customFieldValue: {
      type: "string",
      label: "Custom Field Value",
      description: "The value for the custom field.",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://my.herobot.app/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async sendMessage({
      userId, contentMessage,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}/send/text`,
        data: {
          message: contentMessage,
        },
      });
    },
    async createTag({ tagName }) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts/tags",
        data: {
          name: tagName,
        },
      });
    },
    async createUser({ newUserDetails }) {
      return this._makeRequest({
        method: "POST",
        path: "/users",
        data: newUserDetails,
      });
    },
    async createCustomField({
      customFieldName, customFieldType,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts/custom_fields",
        data: {
          name: customFieldName,
          type: customFieldType,
        },
      });
    },
    async addTagToUser({
      userId, tagId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}/tags/${tagId}`,
      });
    },
    async sendMessageToUser({
      userId, contentMessage,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/users/${userId}/send/text`,
        data: {
          text: contentMessage,
        },
      });
    },
    async getTags() {
      return this._makeRequest({
        path: "/accounts/tags",
      });
    },
    async getCustomFields() {
      return this._makeRequest({
        path: "/accounts/custom_fields",
      });
    },
  },
};
