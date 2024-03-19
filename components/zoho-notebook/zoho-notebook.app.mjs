import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "note_management_app",
  propDefinitions: {
    notebookName: {
      type: "string",
      label: "Notebook Name",
      description: "The name of the new notebook",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color of the notebook cover",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "A brief summary of what the notebook is about",
      optional: true,
    },
    notebookId: {
      type: "string",
      label: "Notebook ID",
      description: "The identifier of the notebook where the note should be created",
    },
    notecardName: {
      type: "string",
      label: "Notecard Name",
      description: "The title of the notecard",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The main content of the notecard",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Any tags that should be associated with the notecard for easy searching",
      optional: true,
    },
    tag: {
      type: "string",
      label: "Tag",
      description: "Filter out notebooks that do not have the given tag",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.note_management_app.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createNotebook({
      notebookName, color, description,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/notebooks",
        data: {
          notebook_name: notebookName,
          color,
          description,
        },
      });
    },
    async createNotecard({
      notebookId, notecardName, content, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/notebooks/${notebookId}/notecards`,
        data: {
          notecard_name: notecardName,
          content,
          tags,
        },
      });
    },
    async getNotebooks({ tag }) {
      return this._makeRequest({
        path: "/notebooks",
        params: {
          tag,
        },
      });
    },
  },
};
