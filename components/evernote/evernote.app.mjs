import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "evernote",
  version: "0.0.{{ts}}",
  propDefinitions: {
    notebookFilter: {
      type: "string",
      label: "Notebook",
      description: "Filter events by notebook",
      optional: true,
      async options() {
        const notebooks = await this.listNotebooks();
        return notebooks.map((notebook) => ({
          label: notebook.name,
          value: notebook.id,
        }));
      },
    },
    tagFilter: {
      type: "string",
      label: "Tag",
      description: "Filter events by tag",
      optional: true,
      async options() {
        const tags = await this.listTags();
        return tags.map((tag) => ({
          label: tag.name,
          value: tag.id,
        }));
      },
    },
    notebookIdFilter: {
      type: "string",
      label: "Notebook ID Filter",
      description: "Filter events by notebook ID",
      optional: true,
      async options() {
        const notebooks = await this.listNotebooks();
        return notebooks.map((notebook) => ({
          label: notebook.name,
          value: notebook.id,
        }));
      },
    },
    noteTitle: {
      type: "string",
      label: "Title",
      description: "Title of the note",
    },
    noteContent: {
      type: "string",
      label: "Content",
      description: "Content of the note in ENML format",
    },
    noteAdditionalFields: {
      type: "string[]",
      label: "Additional Fields",
      description: "Optional additional fields as JSON objects",
      optional: true,
    },
    noteId: {
      type: "string",
      label: "Note ID",
      description: "ID of the note to update",
    },
    noteUpdateFields: {
      type: "string[]",
      label: "Fields to Update",
      description: "Optional fields to update as JSON objects",
      optional: true,
    },
    notebookName: {
      type: "string",
      label: "Notebook Name",
      description: "Name of the new notebook",
    },
    notebookAdditionalFields: {
      type: "string[]",
      label: "Additional Fields",
      description: "Optional additional fields as JSON objects",
      optional: true,
    },
  },
  methods: {
    // Existing authKeys method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.evernote.com/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($ || this, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.access_token}`,
          "Content-Type": "application/json",
        },
        ...otherOpts,
      });
    },
    async listNotebooks(opts = {}) {
      return this._makeRequest({
        path: "/notebooks",
        ...opts,
      });
    },
    async listTags(opts = {}) {
      return this._makeRequest({
        path: "/tags",
        ...opts,
      });
    },
    async createNote(opts = {}) {
      const additionalFields = this.noteAdditionalFields
        ? this.noteAdditionalFields.reduce((acc, field) => {
          const parsed = JSON.parse(field);
          return {
            ...acc,
            ...parsed,
          };
        }, {})
        : {};
      return this._makeRequest({
        method: "POST",
        path: "/notes",
        data: {
          title: this.noteTitle,
          content: this.noteContent,
          ...additionalFields,
        },
        ...opts,
      });
    },
    async updateNote(opts = {}) {
      if (!this.noteId) {
        throw new Error("Note ID is required to update a note.");
      }
      const updateFields = this.noteUpdateFields
        ? this.noteUpdateFields.reduce((acc, field) => {
          const parsed = JSON.parse(field);
          return {
            ...acc,
            ...parsed,
          };
        }, {})
        : {};
      return this._makeRequest({
        method: "PUT",
        path: `/notes/${this.noteId}`,
        data: {
          ...updateFields,
        },
        ...opts,
      });
    },
    async createNotebook(opts = {}) {
      const additionalFields = this.notebookAdditionalFields
        ? this.notebookAdditionalFields.reduce((acc, field) => {
          const parsed = JSON.parse(field);
          return {
            ...acc,
            ...parsed,
          };
        }, {})
        : {};
      return this._makeRequest({
        method: "POST",
        path: "/notebooks",
        data: {
          name: this.notebookName,
          ...additionalFields,
        },
        ...opts,
      });
    },
    async emitNewNoteEvent(note) {
      this.$emit(note, {
        summary: `New note created: ${note.title}`,
        id: note.id,
        labels: [
          "new_note",
        ],
      });
    },
    async emitNewTagEvent(tag) {
      this.$emit(tag, {
        summary: `New tag created: ${tag.name}`,
        id: tag.id,
        labels: [
          "new_tag",
        ],
      });
    },
    async emitNewNotebookEvent(notebook) {
      this.$emit(notebook, {
        summary: `New notebook created: ${notebook.name}`,
        id: notebook.id,
        labels: [
          "new_notebook",
        ],
      });
    },
    async paginate(fn, opts = {}) {
      let results = [];
      let hasMore = true;
      let page = 1;
      while (hasMore) {
        const response = await fn({
          ...opts,
          page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          results = results.concat(response);
          page += 1;
        }
      }
      return results;
    },
  },
};
