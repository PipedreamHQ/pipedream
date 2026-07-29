import granola from "../../granola.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "granola-get-note",
  name: "Get Note",
  description: "Retrieve a single meeting note by ID. Use **List Notes** to find note IDs. [See the documentation](https://docs.granola.ai/api-reference/get-note)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    granola,
    noteId: {
      propDefinition: [
        granola,
        "noteId",
      ],
    },
    includeTranscript: {
      type: "boolean",
      label: "Include Transcript",
      description: "Whether to include the note transcript in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      noteId, includeTranscript,
    } = this;

    const note = await this.granola.getNote({
      $,
      noteId,
      params: {
        include: includeTranscript
          ? constants.NOTE_INCLUDE.TRANSCRIPT
          : undefined,
      },
    });

    $.export("$summary", `Successfully retrieved note ${noteId}`);
    return note;
  },
};
