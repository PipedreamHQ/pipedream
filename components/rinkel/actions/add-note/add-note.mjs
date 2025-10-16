import rinkel from "../../rinkel.app.mjs";

export default {
  key: "rinkel-add-note",
  name: "Add Note",
  description: "Add a note to a call. [See the documentation](https://developers.rinkel.com/docs/api/add-a-note-to-a-call-detail-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    rinkel,
    callId: {
      propDefinition: [
        rinkel,
        "callId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note",
    },
  },
  async run({ $ }) {
    const response = await this.rinkel.addNote({
      $,
      id: this.callId,
      data: {
        content: this.content,
      },
    });
    $.export("$summary", `Note added to call ${this.callId}`);
    return response;
  },
};
