import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "needle",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The ID of the collection to search in.",
      async options() {
        const { result: collections } = await this.listCollections();
        return collections.map(({
          id: value,
          name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path, subdomain = "") {
      const baseUrl = constants.BASE_URL.replace(
        constants.SUBDOMAIN_PLACEHOLDER,
        subdomain,
      );
      return `${baseUrl}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "x-api-key": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      $ = this, path, headers, subdomain, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path, subdomain),
        headers: this.getHeaders(headers),
      });
    },
    post(args) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
    listCollections(args = {}) {
      return this.makeRequest({
        path: "/collections",
        ...args,
      });
    },
  },
};
