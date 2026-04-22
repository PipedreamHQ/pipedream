import fellow from "../../fellow.app.mjs";

export default {
  key: "fellow-get-note-by-id",
  name: "Get Note by ID",
  description: "Get a note by its ID. [See the documentation](https://developers.fellow.ai/reference/apps_developer_api_api_get_note_by_id)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fellow,
    noteId: {
      propDefinition: [
        fellow,
        "noteId",
      ],
    },
  },
  async run({ $ }) {
    const result = await this.fellow.getNote({
      $,
      noteId: this.noteId,
    });
    $.export("$summary", `Successfully retrieved note ${this.noteId}`);
    return result;
  },
};
