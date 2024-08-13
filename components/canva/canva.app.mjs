import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "canva",
  propDefinitions: {
    designId: {
      type: "string",
      label: "Design ID",
      description: "The ID of the design",
      async options({ prevContext }) {
        const params = prevContext?.continuation
          ? {
            continuation: prevContext.continuation,
          }
          : {};
        const {
          items, continuation,
        } = await this.listDesigns({
          params,
        });
        return {
          options: items?.map(({
            id: value, title: label,
          }) => ({
            value,
            label,
          })) || [],
          context: {
            continuation,
          },
        };
      },
    },
    title: {
      type: "string",
      label: "Title",
      description: "The name of the design",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to a file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
    },
    waitForCompletion: {
      type: "boolean",
      label: "Wait for Completion",
      description: "Set to `true` to poll the API in 3-second intervals until the job is completed",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.canva.com/rest/v1";
    },
    _auth() {
      return this.$auth.oauth_access_token;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `Bearer ${this._auth()}`,
        },
      });
    },
    listDesigns(opts = {}) {
      return this._makeRequest({
        path: "/designs",
        ...opts,
      });
    },
    getUploadJob({
      jobId, ...opts
    }) {
      return this._makeRequest({
        path: `/asset-uploads/${jobId}`,
        ...opts,
      });
    },
    uploadAsset(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/asset-uploads",
        ...opts,
      });
    },
    createDesign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/designs",
        ...opts,
      });
    },
    importDesign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/imports",
        ...opts,
      });
    },
    getDesignImportJob({
      importId, ...opts
    }) {
      return this._makeRequest({
        path: `/imports/${importId}`,
        ...opts,
      });
    },
    exportDesign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/exports",
        ...opts,
      });
    },
    getDesignExportJob({
      exportId, ...opts
    }) {
      return this._makeRequest({
        path: `/exports/${exportId}`,
        ...opts,
      });
    },
  },
};
