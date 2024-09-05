import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "signnow",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the template. You can find the ID by clicking on the template in the **SignNow Templates** page and copying the ID from the menu.",
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document. You can find the ID by clicking on the document in the **SignNow Documents** page and copying the ID from the menu.",
    },
    documentName: {
      type: "string",
      label: "Document Name",
      description: "The name of the document",
      optional: true,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    getUserInfo(args = {}) {
      return this._makeRequest({
        path: "/user",
        ...args,
      });
    },
    post(args = {}) {
      return this._makeRequest({
        ...args,
        method: "POST",
      });
    },
    put(args = {}) {
      return this._makeRequest({
        ...args,
        method: "PUT",
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        ...args,
        method: "DELETE",
      });
    },
  },
};
