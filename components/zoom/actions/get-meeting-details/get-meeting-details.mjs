import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-details",
  name: "Get Meeting Details",
  description: "Retrieves the details of a meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/meetings/{meetingId})",
  version: "0.3.5",
  type: "action",
  props: {
    zoom,
    meetingId: {
      propDefinition: [
        zoom,
        "meetingId",
      ],
    },
    occurrenceId: {
      propDefinition: [
        zoom,
        "occurrenceIds",
        (c) => ({
          meetingId: c.meetingId,
        }),
      ],
      type: "string",
      label: "Occurence ID",
      description: "Meeting occurrence ID. Provide this field to view meeting details of a particular occurrence of the recurring meeting.",
      optional: true,
    },
    showPreviousOccurrences: {
      type: "boolean",
      label: "Show Previous Occurrences",
      description: "Set this field's value to true to view meeting details of all previous occurrences of a recurring meeting.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zoom.getMeeting({
      $,
      meetingId: this.meetingId,
      params: {
        occurrence_id: this.occurrenceId,
        show_previous_occurrences: this.showPreviousOccurrences,
      },
    });
    $.export("$summary", `Successfully retreived details for meeting with ID: \`${this.meetingId}\``);
    return response;
  },
};
