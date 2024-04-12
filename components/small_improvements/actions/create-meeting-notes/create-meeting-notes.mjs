import smallImprovements from "../../small_improvements.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "small_improvements-create-meeting-notes",
  name: "Create Meeting Notes",
  description: "Create meeting notes in Small Improvements. [See the documentation](https://storage.googleapis.com/si-rest-api-docs/dist/index.html#meeting-note-resource)",
  version: "0.0.1",
  type: "action",
  props: {
    smallImprovements,
    command: {
      propDefinition: [
        smallImprovements,
        "command",
      ],
    },
    meetingId: {
      propDefinition: [
        smallImprovements,
        "meetingId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.smallImprovements.createMeetingNotes({
      meetingId: this.meetingId,
      command: this.command,
    });
    $.export("$summary", `Successfully created meeting notes for meeting ID ${this.meetingId}`);
    return response;
  },
};
