import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "attio",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The identifier of a list",
      async options() {
        const { data } = await this.listLists();
        return data?.map(({
          id, name: label,
        }) => ({
          value: id.list_id,
          label,
        })) || [];
      },
    },
    entryId: {
      type: "string",
      label: "Entry ID",
      description: "The identifier of a list entry",
      async options({
        listId, page,
      }) {
        const { data } = await this.listEntries({
          listId,
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map(({ id }) => id.entry_id) || [];
      },
    },
    objectId: {
      type: "string",
      label: "Object ID",
      description: "The identifier of an object",
      async options() {
        const { data } = await this.listObjects();
        return data?.map(({
          id, singular_noun: label,
        }) => ({
          value: id.object_id,
          label,
        })) || [];
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Identifier of a record",
      async options({
        objectId, page,
      }) {
        const { data } = await this.listRecords({
          objectId,
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data?.map(({ id }) => id.record_id) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.attio.com/v2";
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    listEntries({
      listId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/lists/${listId}/entries/query`,
        ...opts,
      });
    },
    listObjects(opts = {}) {
      return this._makeRequest({
        path: "/objects",
        ...opts,
      });
    },
    listRecords({
      objectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/objects/${objectId}/records/query`,
        ...opts,
      });
    },
    createNote(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/notes",
        ...opts,
      });
    },
    upsertRecord({
      objectType, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/objects/${objectType}/records`,
        ...opts,
      });
    },
    deleteListEntry({
      listId, entryId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/lists/${listId}/entries/${entryId}`,
        ...opts,
      });
    },
  },
};
