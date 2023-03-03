import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "ontraport",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form.",
      async options({ page }) {
        const { data } = await this.listFormBlocks({
          params: {
            page,
          },
        });
        return Object.entries(data)
          .map(([
            value,
            label,
          ]) => ({
            label,
            value,
          }));
      },
    },
    tagId: {
      type: "string",
      label: "Tag ID",
      description: "The ID of the tag.",
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page,
          },
        });
        return data.map(({
          tag_id: value, tag_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    productId: {
      type: "string",
      label: "Product ID",
      description: "The ID of the product.",
      async options({ page }) {
        const { data } = await this.listProducts({
          params: {
            page,
            listFields: "id,name",
          },
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      const {
        api_key: apiKey,
        api_appid: apiAppid,
      } = this.$auth;
      return {
        "Content-Type": "application/x-www-form-urlencoded",
        "Api-Key": apiKey,
        "Api-Appid": apiAppid,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {
      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    listFormBlocks(args = {}) {
      return this.makeRequest({
        path: "/Form/getAllFormBlocks",
        ...args,
      });
    },
    listTags(args = {}) {
      return this.makeRequest({
        path: "/Tags",
        ...args,
      });
    },
    listProducts(args = {}) {
      return this.makeRequest({
        path: "/Products",
        ...args,
      });
    },
  },
};
