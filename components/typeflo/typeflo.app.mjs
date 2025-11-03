import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "typeflo",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "Post title",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Main body content of the post",
    },
    slug: {
      type: "string",
      label: "Slug",
      description: "URL-friendly title for the post",
      optional: true,
    },
    excerpt: {
      type: "string",
      label: "Excerpt",
      description: "Short summary of the post",
      optional: true,
    },
    metatitle: {
      type: "string",
      label: "Meta Title",
      description: "SEO title of the post",
      optional: true,
    },
    metadescription: {
      type: "string",
      label: "Meta Description",
      description: "SEO description of the post",
      optional: true,
    },
    tocStatus: {
      type: "boolean",
      label: "TOC Status",
      description: "Enable or disable table of contents",
      optional: true,
    },
    scheduled: {
      type: "string",
      label: "Scheduled",
      description: "Scheduled publish date and time, i.e.: `28/08/2025 09:35 AM`",
      optional: true,
    },
    publishDate: {
      type: "string",
      label: "Publish Date",
      description: "Date when the post is published, i.e.: `01/01/2025`",
      optional: true,
    },
    isDraft: {
      type: "boolean",
      label: "Is Draft",
      description: "Whether the post is saved as draft",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
        },
      });
    },

    async createPost(args = {}) {
      return this._makeRequest({
        path: "/api/headless/admin/posts",
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.$auth.admin_api_key}`,
        },
        ...args,
      });
    },
  },
};
