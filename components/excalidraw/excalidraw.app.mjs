import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "excalidraw",
  propDefinitions: {
    sceneId: {
      type: "string",
      label: "Scene ID",
      description: "The unique identifier of the scene. Use **List Scenes** to find scene IDs. Example: `4towcktqVl9`.",
    },
    collectionId: {
      type: "string",
      label: "Collection ID",
      description: "The unique identifier of the collection. Use **List Collections** to find collection IDs. Example: `77i8dL6qc5t`.",
      optional: true,
    },
    sceneName: {
      type: "string",
      label: "Name",
      description: "The name of the scene.",
    },
    collectionName: {
      type: "string",
      label: "Name",
      description: "The name of the collection.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return.",
      optional: true,
      default: 100,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The number of items to skip before starting to collect the result set.",
      optional: true,
      min: 0,
      max: 9007199254740991,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.excalidraw.com/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      method = "GET",
      path,
      params,
      data,
      ...opts
    }) {
      return axios($, {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        params,
        data,
        ...opts,
      });
    },
    getWorkspace($) {
      return this._makeRequest({
        $,
        path: "/workspaces",
      });
    },
    listScenes({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/scenes",
        params,
      });
    },
    getScene({
      $, sceneId,
    }) {
      return this._makeRequest({
        $,
        path: `/scenes/${sceneId}`,
      });
    },
    getSceneContent({
      $, sceneId,
    }) {
      return this._makeRequest({
        $,
        path: `/scenes/${sceneId}/content`,
      });
    },
    listCollections({
      $, params,
    }) {
      return this._makeRequest({
        $,
        path: "/collections",
        params,
      });
    },
    async getDefaultCollectionId($) {
      const response = await this.listCollections({
        $,
        params: {
          limit: 100,
        },
      });
      const collections = response.data ?? [];
      const defaultCol = collections.find((c) => c.isDefault) ?? collections[0];
      return defaultCol?.id;
    },
    createScene({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/scenes",
        data,
      });
    },
    updateScene({
      $, sceneId, data,
    }) {
      return this._makeRequest({
        $,
        method: "PATCH",
        path: `/scenes/${sceneId}`,
        data,
      });
    },
    deleteScene({
      $, sceneId,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `/scenes/${sceneId}`,
      });
    },
    createCollection({
      $, data,
    }) {
      return this._makeRequest({
        $,
        method: "POST",
        path: "/collections",
        data,
      });
    },
  },
};
