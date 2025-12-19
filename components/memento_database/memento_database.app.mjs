import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "memento_database",
  propDefinitions: {
    libraryId: {
      type: "string",
      label: "Library ID",
      description: "The ID of a library",
      async options() {
        const { libraries } = await this.listLibraries();
        return libraries?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    entryId: {
      type: "string",
      label: "Entry ID",
      description: "The ID of an entry",
      async options({
        libraryId, prevContext,
      }) {
        const {
          entries, nextPageToken,
        } = await this.listEntries({
          libraryId,
          params: {
            pageToken: prevContext?.pageToken,
          },
        });
        const options = entries?.map(({ id }) => ({
          value: id,
          label: `Entry ${id}`,
        })) || [];
        return {
          options,
          context: {
            pageToken: nextPageToken,
          },
        };
      },
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "An array of objects containing the fields of the entry. Note: The field IDs must already exist in the library. Example: `[{ \"id\": 1, \"value\": \"Record 1\" }, { \"id\": 2, \"value\": 1000 }]`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.mementodatabase.com/v1";
    },
    _makeRequest({
      $ = this, path, params, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          token: `${this.$auth.api_token}`,
        },
        ...opts,
      });
    },
    getLibrary({
      libraryId, ...opts
    }) {
      return this._makeRequest({
        path: `/libraries/${libraryId}`,
        ...opts,
      });
    },
    listLibraries(opts = {}) {
      return this._makeRequest({
        path: "/libraries",
        ...opts,
      });
    },
    listEntries({
      libraryId, ...opts
    }) {
      return this._makeRequest({
        path: `/libraries/${libraryId}/entries`,
        ...opts,
      });
    },
    createEntry({
      libraryId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/libraries/${libraryId}/entries`,
        ...opts,
      });
    },
    updateEntry({
      libraryId, entryId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/libraries/${libraryId}/entries/${entryId}`,
        ...opts,
      });
    },
  },
};
