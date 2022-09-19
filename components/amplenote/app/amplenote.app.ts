import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "amplenote",
  propDefinitions: {
    noteId: {
      label: "Note ID",
      description: "ID of the note",
      type: "string",
      async options() {
        const notes = await this.getNotes();

        return notes.map((note) => ({
          label: note.name,
          value: note.uuid,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.amplenote.com/v4";
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async getNotes({ $ = this } = {}) {
      const response = await this._makeRequest("notes", {
        method: "GET",
      }, $);

      return response.notes;
    },
    async createNote({
      $, data,
    }) {
      return this._makeRequest("notes", {
        method: "POST",
        data,
      }, $);
    },
    async createTask({
      $, noteId, data,
    }) {
      return this._makeRequest(`notes/${noteId}/actions`, {
        method: "POST",
        data,
      }, $);
    },
  },
});
