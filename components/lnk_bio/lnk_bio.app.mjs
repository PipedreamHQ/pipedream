import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lnk_bio",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the new link",
    },
    link: {
      type: "string",
      label: "Link",
      description: "The URL of the new link",
    },
    image: {
      type: "string",
      label: "Image URL",
      description: "The URL of the image associated with the link",
      optional: true,
    },
    linkId: {
      type: "string",
      label: "Link ID",
      description: "The ID of the link to delete",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.lnk.bio";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createLink({
      title, link, image,
    }) {
      const body = {
        title,
        link,
      };
      if (image) {
        body.image = image;
      }
      return this._makeRequest({
        method: "POST",
        path: "/link",
        data: body,
      });
    },
    async deleteLink({ linkId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/link/${linkId}`,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: `0.0.${Date.now()}`,
};
