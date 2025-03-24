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
        return data?.map(({
          id, values,
        }) => ({
          value: id.record_id,
          label: (values?.name?.length && (values.name[0].value || values.name[0].full_name))
            ?? (values?.domains?.length && values.domains[0].domain)
            ?? (values?.email_addresses?.length && values.email_addresses[0].email_address)
            ?? values?.id?.record_id,
        })) || [];
      },
    },
    attributeId: {
      type: "string",
      label: "Attribute ID",
      description: "The ID or slug of the attribute to use to check if a record already exists. The attribute must be unique.",
      async options({
        objectId, page,
      }) {
        const { data } = await this.listAttributes({
          objectId,
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return data
          ?.filter((attribute) => attribute.is_unique)
          ?.map(({
            id, title: label,
          }) => ({
            value: id.attribute_id,
            label,
          })) || [];
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
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${hookId}`,
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
    listAttributes({
      objectId, ...opts
    }) {
      return this._makeRequest({
        path: `/objects/${objectId}/attributes`,
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
      objectId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/objects/${objectId}/records`,
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
