import Evernote from "evernote";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "evernote",
  propDefinitions: {
    noteId: {
      type: "string",
      label: "Note ID",
      description: "ID of the note to update",
      async options({ page }) {
        const { notes } = await this.listNotes({
          offset: LIMIT * page,
          maxNotes: LIMIT,
        });
        return notes.map((note) => ({
          label: note.title,
          value: note.guid,
        }));
      },
    },
    notebookGuid: {
      type: "string",
      label: "Notebook ID",
      description: "The notebook ID that contains this note. If no Notebook ID is provided, the default notebook will be used instead.",
      async options() {
        const notebooks = await this.listNotebooks();
        return notebooks.map((notebook) => ({
          label: notebook.name,
          value: notebook.guid,
        }));
      },
    },
    tagGuids: {
      type: "string[]",
      label: "Tag IDs",
      description: "A list of tag IDs that are applied to this note.",
      async options() {
        const tags = await this.listTags();
        return tags.map((tag) => ({
          label: tag.name,
          value: tag.guid,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.evernote.com/v1";
    },
    client() {
      const client = new Evernote.Client({
        token: this.$auth.developer_token,
        sandbox: false,
      });
      return client.getNoteStore();
    },
    async list({ method }) {
      const noteStore = await this.client();
      return await noteStore[method]();
    },
    async post({
      method, ...opts
    }) {
      const noteStore = await this.client();
      return await noteStore[method]({
        ...opts,
      });
    },
    async listNotes({
      maxNotes, offset,
    }) {
      const noteStore = await this.client();
      return await noteStore.findNotesMetadata(
        new Evernote.NoteStore.NoteFilter({
          order: "created",
          ascending: false,
        }),
        offset,
        maxNotes,
        new Evernote.NoteStore.NotesMetadataResultSpec({
          includeTitle: true,
          includeContentLength: true,
          includeCreated: true,
          includeUpdated: true,
          includeDeleted: true,
          includeUpdateSequenceNum: true,
          includeNotebookGuid: true,
          includeTagGuids: true,
          includeAttributes: true,
          includeLargestResourceMime: true,
          includeLargestResourceSize: true,
        }),
      );
    },
    listNotebooks() {
      return this.list({
        method: "listNotebooks",
      });
    },
    listTags() {
      return this.list({
        method: "listTags",
      });
    },
    createNote(opts = {}) {
      return this.post({
        method: "createNote",
        ...opts,
      });
    },
    createNotebook(opts = {}) {
      return this.post({
        method: "createNotebook",
        ...opts,
      });
    },
    updateNote(opts = {}) {
      return this.post({
        method: "updateNote",
        ...opts,
      });
    },
  },
};
