import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "neuronwriter",
  propDefinitions: {
    queryId: {
      type: "string",
      label: "Query ID",
      description: "The ID of the query to fetch or manipulate.",
      async options() {
        const data = await this.listQueries({
          data: {
            project: this.$auth.project_id,
          },
        });

        return data.map(({
          query: value, source,
        }) => ({
          label: `${value} - Source: ${source}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.neuronwriter.com/neuron-api/0.5/writer";
    },
    _headers() {
      return {
        "X-API-KEY": this.$auth.api_key,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createNewQuery(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/new-query",
        ...opts,
      });
    },
    getQueryResults(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/get-query",
        ...opts,
      });
    },
    getContent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/get-content",
        ...opts,
      });
    },
    listQueries(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/list-queries",
        ...opts,
      });
    },
  },
};
