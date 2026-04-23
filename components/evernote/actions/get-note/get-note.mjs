import evernote from "../../evernote.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "evernote-get-note",
  name: "Get Note",
  description: "Get a note by ID. [See the documentation](https://dev.evernote.com/doc/reference/NoteStore.html#Fn_NoteStore_getNoteWithResultSpec)",
  version: "0.0.1",
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
    let response;
    try {
      response = await this.evernote.getNote({
        noteId: this.noteId,
        resultSpec: {
          withContent: true,
        },
      });
    } catch ({
      parameter, message,
    }) {
      throw new ConfigurationError(message || parameter);
    }
    $.export("$summary", `Successfully retrieved note with ID: ${this.noteId}`);
    return response;
  },
};
