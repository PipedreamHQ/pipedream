import smallImprovements from "../../small_improvements.app.mjs";

export default {
  key: "small_improvements-create-meeting-notes",
  name: "Create Meeting Notes",
  description: "Create meeting notes in Small Improvements. [See the documentation](https://storage.googleapis.com/si-rest-api-docs/dist/index.html#meeting-note-resource)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    smallImprovements,
    participantId: {
      propDefinition: [
        smallImprovements,
        "participantId",
      ],
    },
    meetingId: {
      propDefinition: [
        smallImprovements,
        "meetingId",
        ({ participantId }) => ({
          participantId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note.",
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "The visibility of the note.",
      options: [
        "PRIVATE",
        "SHARED",
      ],
      optional: true,
    },
    draft: {
      type: "boolean",
      label: "Draft",
      description: "Whether the note is draft or not.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.smallImprovements.createMeetingNotes({
      $,
      meetingId: this.meetingId,
      data: {
        content: this.content,
        meetingId: this.meetingId,
        visibility: this.visibility,
        draft: this.draft,
      },
    });
    $.export("$summary", `Successfully created a note with Id: ${response.id}`);
    return response;
  },
};
