import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "more_trees_",
  propDefinitions: {
    treeTypeSlug: {
      type: "string",
      label: "Tree Type Slug",
      description: "The slug of the tree type",
      async options() {
        const { data: treeTypes } = await this.getTreeTypes();

        console.log(treeTypes);
        console.log(treeTypes[0]);

        return treeTypes[0].map((treeType) => ({
          label: treeType.name,
          value: treeType.tree_identifier,
        }));
      },
    },
  },
  methods: {
    _publicValidationKey() {
      return this.$auth.public_validation_key;
    },
    _apiUrl() {
      return "https://api.moretrees.eco/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: this._publicValidationKey(),
        },
        ...args,
      });
    },
    async plantTree(args = {}) {
      return this._makeRequest({
        path: "/basic/planttree",
        method: "post",
        ...args,
      });
    },
    async getTreeTypes(args = {}) {
      return this._makeRequest({
        path: "/basic/viewTypes",
        ...args,
      });
    },
    async getCarbonOffset(args = {}) {
      return this._makeRequest({
        path: "/basic/carbonOffset",
        ...args,
      });
    },
  },
};
