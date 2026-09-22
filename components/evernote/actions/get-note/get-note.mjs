import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-get-note",
  name: "Get Note",
  description: "Get a note by ID. [See the documentation](https://dev.evernote.com/doc/reference/NoteStore.html#Fn_NoteStore_getNoteWithResultSpec)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    evernote,
    noteId: {
      propDefinition: [
        evernote,
        "noteId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.evernote.getNote({
      noteId: this.noteId,
      resultSpec: {
        withContent: true,
      },
    });
    $.export("$summary", `Successfully retrieved note with ID: ${this.noteId}`);
    return response;
  },
};
