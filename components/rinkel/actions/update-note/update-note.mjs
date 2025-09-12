import rinkel from "../../rinkel.app.mjs";

export default {
  key: "rinkel-update-note",
  name: "Update Note",
  description: "Update a note on a call. [See the documentation](https://developers.rinkel.com/docs/api/update-a-note-in-a-call-detail-record)",
  version: "0.0.1",
  type: "action",
  props: {
    rinkel,
    callId: {
      propDefinition: [
        rinkel,
        "callId",
      ],
    },
    noteId: {
      propDefinition: [
        rinkel,
        "noteId",
        (c) => ({
          callId: c.callId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note",
    },
  },
  async run({ $ }) {
    const response = await this.rinkel.updateNote({
      $,
      callId: this.callId,
      noteId: this.noteId,
      data: {
        content: this.content,
      },
    });
    $.export("$summary", `Note updated for call ${this.callId}`);
    return response;
  },
};
