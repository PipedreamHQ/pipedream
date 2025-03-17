import evernote from "../../evernote.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "evernote-update-note",
  name: "Update Note",
  description: "Updates an existing note in Evernote. [See the documentation](https://dev.evernote.com/doc/reference/notestore.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    evernote,
    noteId: {
      propDefinition: [
        "evernote",
        "noteId",
      ],
    },
    noteUpdateFields: {
      propDefinition: [
        "evernote",
        "noteUpdateFields",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.evernote.updateNote();
    $.export("$summary", `Note ${this.noteId} updated successfully.`);
    return response;
  },
};
