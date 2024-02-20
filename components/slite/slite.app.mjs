import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "slite",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the document",
    },
    markdown: {
      type: "string",
      label: "Markdown",
      description: "The markdown content of the document.",
    },
    noteId: {
      type: "string",
      label: "Note ID",
      description: "The ID of a note",
      useQuery: true,
      async options({
        page, query, parentNoteId,
      }) {
        try {
          const { hits } = await this.searchNotes({
            params: {
              query,
              parentNoteId,
              page,
            },
          });
          return hits.map(({
            id: value, title: label,
          }) => ({
            label,
            value,
          }));
        } catch (error) {
          return [];
        }
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: {
          ...headers,
          "accept": "application/json",
          "x-slite-api-key": this.$auth.api_key,
        },
      });
    },
    post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "PUT",
        ...args,
      });
    },
    searchNotes(args = {}) {
      return this._makeRequest({
        path: "/search-notes",
        ...args,
      });
    },
  },
};
