import { algoliasearch } from "algoliasearch";

export default {
  type: "app",
  app: "algolia",
  propDefinitions: {
    indexName: {
      label: "Index Name",
      description: "The name of the index",
      type: "string",
      async options() {
        const { items: indexes } = await this.listIndices();
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
    listIndices() {
      return this._client().listIndices();
    },
  },
};
