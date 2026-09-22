import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "granola",
  propDefinitions: {
    noteId: {
      type: "string",
      label: "Note ID",
      description: "The ID of the note (e.g. `not_1d3tmYTlCICgjy`). Run the **List Notes** action to find note IDs.",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Return notes in this folder and any of its child folders (e.g. `fol_4y6LduVdwSKC27`). Run the **List Folders** action to find folder IDs.",
      optional: true,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of results to return",
      default: constants.DEFAULT_MAX_RESULTS,
      min: 1,
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._headers(),
          ...headers,
        },
        ...args,
      });
    },
    listNotes(args = {}) {
      return this._makeRequest({
        path: "/notes",
        ...args,
      });
    },
    getNote({
      noteId, ...args
    }) {
      return this._makeRequest({
        path: `/notes/${noteId}`,
        ...args,
      });
    },
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/folders",
        ...args,
      });
    },
    async *paginate({
      $, fn, params = {}, resourceKey, max = constants.DEFAULT_MAX_RESULTS,
    }) {
      let count = 0;
      params.page_size = max > 0
        ? Math.min(constants.PAGE_SIZE, max)
        : constants.PAGE_SIZE;

      do {
        const response = await fn({
          $,
          params,
        });
        const items = response[resourceKey] || [];
        if (!items.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max > 0 && ++count >= max) {
            return;
          }
        }
        if (!response.hasMore) {
          return;
        }
        params.cursor = response.cursor;
      } while (true);
    },
  },
};
