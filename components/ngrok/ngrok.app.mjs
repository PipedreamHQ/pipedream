import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ngrok",
  propDefinitions: {
    description: {
      type: "string",
      label: "Description",
      description: "What this edge will be used for.",
    },
    hostports: {
      type: "string[]",
      label: "Host Ports",
      description: "Hostports served by this edge. Eg: `example.com:443`",
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The metadata of the agent ingress. Arbitrary user-defined machine-readable data.",
      optional: true,
    },
    edgeId: {
      type: "string",
      label: "Edge ID",
      description: "The ID of the edge to update.",
      async options({ prevContext: { url } }) {
        if (url === null) {
          return [];
        }
        const {
          next_page_uri: nextPageUri,
          https_edges: edges,
        } = await this.listHTTPSEdges({
          url,
          params: {
            limit: 10,
          },
        });
        const options = edges.map(({
          id: value, description: label,
        }) => ({
          label,
          value,
        }));
        return {
          options,
          context: {
            url: nextPageUri,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://api.ngrok.com${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
        "Ngrok-Version": "2",
      };
    },
    _makeRequest({
      $ = this, url, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: url || this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    patch(args = {}) {
      return this._makeRequest({
        method: "PATCH",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "DELETE",
        ...args,
      });
    },
    listHTTPSEdges(args = {}) {
      return this._makeRequest({
        path: "/edges/https",
        ...args,
      });
    },
  },
};
