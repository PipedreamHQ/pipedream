import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Delete meeting",
  description: "Delete a meeting. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingdelete)",
  key: "zoom-admin-action-delete-meeting",
  version: "0.0.12",
  type: "action",
  props: {
    zoomAdmin,
    meetingId: {
      propDefinition: [
        zoomAdmin,
        "meetingId",
      ],
    },
    occurrenceId: {
      propDefinition: [
        zoomAdmin,
        "occurrenceId",
      ],
      description: "The [meeting occurrence ID](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings).",
    },
    scheduleForReminder: {
      type: "boolean",
      label: "Schedule for Reminder",
      description: "If `true`, notify host and alternative host about the meeting cancellation via email. If `false`, do not send any email notification",
      optional: true,
    },
    cancelMeetingReminder: {
      type: "boolean",
      label: "Cancel Meeting Reminder",
      description: "If `true`, notify registrants about the meeting cancellation via email. If `false`, do not send any email notification to meeting registrants.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "DELETE",
      path: `/meetings/${get(this.meetingId, "value", this.meetingId)}`,
      params: {
        occurrence_id: this.occurrenceId,
        schedule_for_reminder: this.scheduleForReminder,
        cancel_meeting_reminder: this.cancelMeetingReminder,
      },
    }));

    $.export("$summary", `The meeting "${get(this.meetingId, "label", this.meetingId)}" was successfully deleted`);

    return res;
  },
};
