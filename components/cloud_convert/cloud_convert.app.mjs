import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "cloud_convert",
  propDefinitions: {
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the input task for the conversion, normally the import task.",
      async options({
        page, filters,
        mapper = ({
          id: value,
          result: { files } = {},
        }) => ({
          value,
          label: files?.map(({ filename }) => filename).join(", ") || value,
        }),
      }) {
        const { data } = await this.listTasks({
          params: {
            ...filters,
            page: page + 1,
          },
        });
        return data.map(mapper);
      },
    },
    conversionType: {
      type: "string",
      label: "Converstion Type",
      description: "The ID of the operation to perform.",
      async options({
        page, filters,
        mapper = ({ id: value }) => value,
      }) {
        const { data } = await this.listOperations({
          params: {
            ...filters,
            page: page + 1,
          },
        });
        return data.map(mapper);
      },
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "The properties to include in the response",
      optional: true,
      options: [
        "retries",
        "depends_on_tasks",
        "payload",
        "job",
      ],
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
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
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listTasks(args = {}) {
      return this._makeRequest({
        path: "/tasks",
        ...args,
      });
    },
    listOperations(args = {}) {
      return this._makeRequest({
        path: "/operations",
        ...args,
      });
    },
  },
};
