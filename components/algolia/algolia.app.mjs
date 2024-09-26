import algoliasearch from "algoliasearch";

export default {
  type: "app",
  app: "algolia",
  propDefinitions: {
    indexName: {
      label: "Index Name",
      description: "The name of the index",
      type: "string",
      async options() {
        const indexes = await this.getIndexes();

        return indexes.map((index) => index.name);
      },
    },
  },
  methods: {
    _applicationId() {
      return this.$auth.application_id;
    },
    _apiKey() {
      return this.$auth.api_key;
    },
    _client() {
      return algoliasearch(this._applicationId(), this._apiKey());
    },
    _index(indexName) {
      return this._client().initIndex(indexName);
    },
    async getIndexes() {
      const response = await this._client().listIndices();

      return response.items;
    },
    async createObjects({
      indexName, objects, options,
    }) {
      return this._index(indexName).saveObjects(objects, options);
    },
    async deleteObjects({
      indexName, objectIds,
    }) {
      return this._index(indexName).deleteObjects(objectIds);
    },
  },
};
