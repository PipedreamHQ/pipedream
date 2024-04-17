import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "letterdrop",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the blog post",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the blog post",
    },
    images: {
      type: "string[]",
      label: "Images",
      description: "URLs of images to include in the blog post",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags to associate with the blog post",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the subscriber",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the subscriber",
      optional: true,
    },
    subscriptionTier: {
      type: "string",
      label: "Subscription Tier",
      description: "The subscription tier of the subscriber",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.letterdrop.com/api/v1";
    },
    async _makeRequest({
      $ = this, method = "GET", path, headers, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async addSubscriber({
      email, name, subscriptionTier,
    }) {
      const data = {
        email,
        additionalData: {},
        welcomeEmail: true,
      };

      if (name) data.additionalData.name = name;
      if (subscriptionTier) data.additionalData.type = subscriptionTier;

      return this._makeRequest({
        method: "POST",
        path: "/subscriber/add",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    },
    async removeSubscriber({ email }) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriber/remove",
        params: {
          email,
        },
      });
    },
    async draftPost({
      title, content, images, tags,
    }) {
      const data = {
        title,
        html: content,
        images: images || [],
        tags: tags || [],
      };

      return this._makeRequest({
        method: "POST",
        path: "/post/draft",
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    },
  },
  version: "0.0.{{ts}}",
};
