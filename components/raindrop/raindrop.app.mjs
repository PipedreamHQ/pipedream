import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "raindrop",
  propDefinitions: {
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The collection ID",
      async options() {
        let { items } = await this.getCollections();
        items = items.map((e) => ({
          value: e._id,
          label: e.title,
        }));
        items.unshift(
          {
            value: 0,
            label: "All Bookmarks",
          },
          {
            value: -1,
            label: "Unsorted",
          },
          {
            value: -99,
            label: "Trash",
          },
        );
        return items;
      },
    },
    raindropId: {
      type: "string",
      label: "Bookmark ID",
      description: "Existing Bookmark ID",
      async options({
        prevContext, collectionId,
      }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const { items } = await this.getRaindrops(this, collectionId, {
          page,
        });
        return {
          options: items.map((e) => ({
            value: e._id,
            label: e.title,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Emit events when the specified tags are added to a bookmark",
      async options({ collectionId }) {
        const { items } = await this.getTags(this, collectionId);
        return items?.map(({ _id: id }) => id) || [];
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
        ...otherOpts,
        method,
        url: `https://api.raindrop.io/rest/v1${path}`,
        headers: {
          ...opts.headers,
          "user-agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
        params,
      });
    },
    async getCollections($) {
      return this._makeRequest($, {
        path: "/collections",
      });
    },
    async postCollection($, collectionData) {
      return this._makeRequest($, {
        method: "POST",
        path: "/collection",
        data: collectionData,
      });
    },
    async putCollection($, collectionId, collectionData) {
      return this._makeRequest($, {
        method: "PUT",
        path: `/collection/${collectionId}`,
        data: collectionData,
      });
    },
    async deleteCollection($, collectionId) {
      return this._makeRequest($, {
        method: "DELETE",
        path: `/collection/${collectionId}`,
      });
    },
    async getCollection($, collectionId) {
      return this._makeRequest($, {
        path: `/collection/${collectionId}`,
      });
    },
    async getRaindrop($, raindropId) {
      return this._makeRequest($, {
        path: `/raindrop/${raindropId}`,
      });
    },
    async getRaindrops($, collectionId, params) {
      return this._makeRequest($, {
        path: `/raindrops/${collectionId}`,
        params,
      });
    },
    async getTags($, collectionId) {
      return this._makeRequest($, {
        path: `/tags/${collectionId}`,
      });
    },
    async postBookmark($, bookmarkData) {
      return this._makeRequest($, {
        method: "POST",
        path: "/raindrop",
        data: bookmarkData,
      });
    },
    async putBookmark($, bookmarkId, bookmarkData) {
      return this._makeRequest($, {
        method: "PUT",
        path: `/raindrop/${bookmarkId}`,
        data: bookmarkData,
      });
    },
    async deleteBookmark($, bookmarkId) {
      return this._makeRequest($, {
        method: "DELETE",
        path: `/raindrop/${bookmarkId}`,
      });
    },
    async importFile($, formData) {
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
