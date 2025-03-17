import evernote from "../../evernote.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "evernote-create-note",
  name: "Create Note",
  description: "Creates a new note in Evernote. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    evernote,
    noteTitle: {
      propDefinition: [
        "evernote",
        "noteTitle",
      ],
    },
    noteContent: {
      propDefinition: [
        "evernote",
        "noteContent",
      ],
    },
    noteAdditionalFields: {
      propDefinition: [
        "evernote",
        "noteAdditionalFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const note = await this.evernote.createNote();
    $.export("$summary", `Created note "${note.title}" with ID ${note.id}`);
    return note;
  },
};
