import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "raindrop",
  propDefinitions: {
    raindropId: {
      type: "string",
      label: "Raindrop ID",
      description: "Existing raindrop ID",
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The collection ID",
      async options() {
        const { items } = await this.getCollections();
        return items.map((e) => ({
          value: e._id,
          label: e.title,
        }));
      },
    },
    expanded: {
      type: "boolean",
      label: "Expanded",
      description: "Whether the collection's sub-collections are expanded",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Name of the collection",
    },
    sort: {
      type: "integer",
      label: "Sort",
      description: "The order of collection (descending). Defines the position of the collection among all the collections with the same parent ID",
      optional: true,
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Collection and raindrops that it contains will be accessible without authentication?",
      optional: true,
    },
    view: {
      type: "string",
      label: "View",
      description: "View style of collection. Defaults to list",
      optional: true,
      options() {
        return [
          "list",
          "simple",
          "grid",
          "masonry",
        ];
      },
    },
    cover: {
      type: "string[]",
      label: "Cover",
      description: "Collection cover url",
      optional: true,
    },
  },
  methods: {
    async _makeRequest($ = this, opts) {
      const {
        method = "get",
        path,
        data,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: `https://api.raindrop.io/rest/v1${path}`,
        headers: {
          ...opts.headers,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    getCollections($) {
      return this._makeRequest($, {
        path: "/collections",
      });
    },
    postCollection($, collectionData) {
      return this._makeRequest($, {
        method: "POST",
        path: "/collection",
        data: collectionData,
      });
    },
    putCollection($, collectionId, collectionData) {
      return this._makeRequest($, {
        method: "PUT",
        path: `/collection/${collectionId}`,
        data: collectionData,
      });
    },
    deleteCollection($, collectionId) {
      return this._makeRequest($, {
        method: "DELETE",
        path: `/collection/${collectionId}`,
      });
    },
    getCollection($, collectionId) {
      return this._makeRequest($, {
        path: `/collection/${collectionId}`,
      });
    },
    getRaindrop($, raindropId) {
      return this._makeRequest($, {
        path: `/raindrop/${raindropId}`,
      });
    },
    getRaindrops($, collectionId, params) {
      return this._makeRequest($, {
        path: `/raindrops/${collectionId}`,
        params,
      });
    },
    postBookmark($, bookmarkData) {
      return this._makeRequest($, {
        method: "POST",
        path: "/raindrop",
        data: bookmarkData,
      });
    },
    putBookmark($, bookmarkId, bookmarkData) {
      return this._makeRequest($, {
        method: "PUT",
        path: `/raindrop/${bookmarkId}`,
        data: bookmarkData,
      });
    },
    deleteBookmark($, bookmarkId) {
      return this._makeRequest($, {
        method: "DELETE",
        path: `/raindrop/${bookmarkId}`,
      });
    },
    importFile($, formData) {
      return this._makeRequest($, {
        method: "POST",
        path: "/import/file",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
        data: formData,
      });
    },
  },
};
