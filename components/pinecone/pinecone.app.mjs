import qs from "qs";
import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "pinecone",
  propDefinitions: {
    indexName: {
      type: "string",
      label: "Index Name",
      description: "The name of the index. E.g. `my-index.pinecone.io`",
      async options() {
        const { indexes } = await this.listIndexes();
        return indexes.map(({
          name: label, host: value,
        }) => ({
          label,
          value,
        }));
      },
    },
    prefix: {
      type: "string",
      label: "Prefix",
      description: "The vector IDs to fetch. Does not accept values containing spaces. E.g. `my-prefix`",
      optional: true,
    },
    namespace: {
      type: "string",
      label: "Namespace",
      description: "The namespace to use.",
      optional: true,
    },
    vectorId: {
      type: "string",
      label: "Vector ID",
      description: "The ID of the vector.",
    },
    vectorValues: {
      type: "string[]",
      label: "Vector Values",
      description: "The values of the vector.",
      optional: true,
    },
    vectorMetadata: {
      type: "object",
      label: "Vector Metadata",
      description: "The metadata of the vector. E.g. `{\"color\": \"red\"}`",
      optional: true,
    },
  },
  methods: {
    getBaseUrl({
      api, indexName,
    } = {}) {
      return api === constants.API.CONTROLLER
        ? constants.CONTROLLER_URL
        : constants.BASE_URL
          .replace(constants.INDEX_NAME_PLACEHOLDER, indexName);
    },
    getUrl({
      path, ...args
    } = {}) {
      const baseUrl = this.getBaseUrl(args);
      return `${baseUrl}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Api-Key": this.$auth.api_key,
        ...headers,
      };
    },
    paramsSerializer(params) {
      return qs.stringify(params, {
        arrayFormat: "repeat",
      });
    },
    makeRequest({
      step = this, api, headers, indexName, path, ...args
    } = {}) {
      const config = {
        ...args,
        paramsSerializer: this.paramsSerializer,
        headers: this.getHeaders(headers),
        url: this.getUrl({
          api,
          indexName,
          path,
        }),
      };
      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listIndexes(args = {}) {
      return this.makeRequest({
        api: constants.API.CONTROLLER,
        path: "/indexes",
        ...args,
      });
    },
  },
};
