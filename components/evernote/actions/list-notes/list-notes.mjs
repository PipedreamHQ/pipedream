import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-list-notes",
  name: "List Notes",
  description: "List all notes in Evernote. [See the documentation](https://dev.evernote.com/doc/reference/NoteStore.html#Fn_NoteStore_findNotesMetadata).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    evernote,
    notebookGuid: {
      propDefinition: [
        evernote,
        "notebookGuid",
      ],
      description: "The notebook ID that contains this note. Can use **List Notebooks** action to get the notebook ID.",
      optional: true,
    },
    maxNotes: {
      type: "integer",
      label: "Max Notes",
      description: "The maximum number of notes to return. Default is 100.",
      optional: true,
      min: 1,
      max: 100,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "The offset of the notes to return. Default is 0.",
      optional: true,
      min: 0,
    },
  },
  async run({ $ }) {
    const response = await this.evernote.listNotes({
      maxNotes: this.maxNotes,
      offset: this.offset,
      notebookGuid: this.notebookGuid,
    });
    $.export("$summary", "Successfully retrieved notes");
    return response;
  },
};
