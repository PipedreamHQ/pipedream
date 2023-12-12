import { axios } from "@pipedream/platform";
import faunadb from "faunadb";

const Client = faunadb.Client;

const {
  Paginate,
  Map,
  Lambda,
  Get,
  Var,
  Collection,
  Collections,
  Documents,
} = faunadb.query;

export default {
  type: "app",
  app: "faunadb",
  propDefinitions: {
    collections: {
      type: "string",
      label: "Collection",
      description: "The ID of a collection",
      async options() {
        const collections = await this.getCollections();
        return collections.map((collection) => collection.id);
      },
    },
  },
  methods: {
    _authToken() {
      return this.$auth.secret;
    },
    _apiUrl() {
      return "https://graphql.fauna.com";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this._authToken()}`,
      };
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: this._headers(),
        ...options,
      });
    },
    _createApiClient() {
      return new Client({
        secret: this._authToken(),
      });
    },
    async getCollections() {
      const client = this._createApiClient();

      const collections = [];
      const collectionsPaginator = client.paginate(Collections());

      await collectionsPaginator.each((page) => {
        collections.push(...page);
      });

      await client.close();
      return collections;
    },
    async getDocumentsInCollection({
      collectionName, documentField,
    }) {
      const client = this._createApiClient();

      const { data } = await client.query(
        Map(Paginate(Documents(Collection(collectionName))), Lambda("i", Get(Var("i")))),
      );

      await client.close();

      if (documentField) {
        return data.map((x) => x.data[documentField]);
      }

      return data;
    },
    async getEventsInCollectionAfterTs(collection, after) {
      const client = this._createApiClient();

      const paginationHelper = client.paginate(
        Documents(Collection(collection)),
        {
          after,
          events: true,
        },
      );

      const events = [];
      await paginationHelper.each((page) => {
        events.push(...page);
      });

      await client.close();
      return events;
    },
    async importGraphqlSchema({
      schema, $,
    }) {
      return this._makeRequest("import", {
        method: "POST",
        data: schema,
      }, $);
    },
    async executeGraphqlQuery(query, $) {
      return this._makeRequest("graphql", {
        method: "POST",
        data: {
          query,
        },
      }, $);
    },
  },
};
