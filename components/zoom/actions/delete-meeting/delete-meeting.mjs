import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-delete-meeting",
  name: "Delete Meeting",
  description: "Delete a meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/meetings/delete/meetings/{meetingId})",
  version: "0.0.4",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zoom,
    meetingId: {
      propDefinition: [
        zoom,
        "meetingId",
      ],
      description: "The ID of the meeting to delete",
      optional: false,
    },
    occurrenceId: {
      propDefinition: [
        zoom,
        "occurrenceId",
        ({ meetingId }) => ({
          meetingId,
        }),
      ],
    },
    scheduleForReminder: {
      type: "boolean",
      label: "Schedule for Reminder",
      description: "If `true`, notify host and alternative host about the meeting cancellation via email. If `false`, do not send any email notification.",
      optional: true,
    },
    cancelMeetingReminder: {
      type: "boolean",
      label: "Cancel Meeting Reminder",
      description: "If `true`, notify registrants about the meeting cancellation via email. If `false`, do not send any email notification to meeting registrants.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zoom.deleteMeeting({
      $,
      meetingId: this.meetingId,
      params: {
        occurrence_id: this.occurrenceId,
        schedule_for_reminder: this.scheduleForReminder,
        cancel_meeting_reminder: this.cancelMeetingReminder,
      },
    });

    if (this.occurrenceId) {
      $.export("$summary", `The occurrence "${this.occurrenceId}" related to the meeting "${this.meetingId}" was successfully deleted`);
    } else {
      $.export("$summary", `The meeting "${this.meetingId}" was successfully deleted`);
    }

    return response;
  },
};
