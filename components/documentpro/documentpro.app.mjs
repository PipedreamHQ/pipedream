import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documentpro",
  propDefinitions: {
    document: {
      type: "string",
      label: "Document",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    parserId: {
      type: "string",
      label: "Parser ID",
      description: "The ID of the parser to use for uploading the document",
      async options() {
        const { items } = await this.getParsers();
        return items.map(({
          template_title: label, template_id: value,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.documentpro.ai";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "x-api-key": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path = "", headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    getParsers(opts = {}) {
      return this._makeRequest({
        path: "/v1/templates",
        ...opts,
      });
    },
    updateParser({
      parserId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/v1/templates/${parserId}`,
        ...opts,
      });
    },
    uploadDocument({
      parserId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/files/upload/${parserId}`,
        ...opts,
      });
    },
  },
};
