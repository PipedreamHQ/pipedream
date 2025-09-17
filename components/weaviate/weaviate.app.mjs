import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "weaviate",
  propDefinitions: {
    className: {
      type: "string",
      label: "Class Name",
      description: "The name of the class to create",
    },
    properties: {
      type: "string[]",
      label: "Properties",
      description: "The properties of the class. Each item must be a JSON object string, e.g.: `{ \"name\": \"title\", \"dataType\": [\"text\"], \"description\": \"Title of the object\" }`",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description of the class",
      optional: true,
    },
    multiTenancyEnabled: {
      type: "boolean",
      label: "Multi-tenancy Enabled",
      description: "Set to `true` to enable multi-tenancy for this class",
      optional: true,
    },
    vectorIndexType: {
      type: "string",
      label: "Vector Index Type",
      description: "Type of vector index to use",
      optional: true,
      options: constants.VECTOR_TYPES,
    },
    classId: {
      type: "string",
      label: "Class Name",
      description: "Name of the Class",
      async options() {
        const response = await this.getSchema();
        return response.classes.map(({ class: className }) => ({
          value: className,
          label: className,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.cluster_url}`;
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
          Authorization: `Bearer ${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async createClass(args = {}) {
      return this._makeRequest({
        path: "/v1/schema",
        method: "post",
        ...args,
      });
    },
    async deleteClass({
      classId, ...args
    }) {
      return this._makeRequest({
        path: `/v1/schema/${classId}`,
        method: "delete",
        ...args,
      });
    },
    async getSchema(args = {}) {
      return this._makeRequest({
        path: "/v1/schema",
        ...args,
      });
    },
  },
};
