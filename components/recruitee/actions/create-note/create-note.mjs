import app from "../../recruitee.app.mjs";

export default {
  name: "Create Note",
  description: "Create a new note for a candidate. [See the documentation](https://api.recruitee.com/docs/index.html#note.web.note-note.web.note)",
  key: "recruitee-create-note",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    candidateId: {
      propDefinition: [
        app,
        "candidateId",
      ],
      optional: false,
    },
    body: {
      type: "string",
      label: "body",
      description: "The body of the note",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the note",
      options: [
        "public",
        "private",
      ],
      default: "public",
    },
  },
  async run({ $ }) {
    const payload = {
      body: this.body,
      visibility: {
        level: this.visibility,
      },
    };
    const response = await this.app.createNote({
      $,
      candidateId: this.candidateId,
      data: {
        note: payload,
      },
    });
    $.export("$summary", `Successfully created note with ID \`${response.note.id}\``);
    return response;
  },
};
