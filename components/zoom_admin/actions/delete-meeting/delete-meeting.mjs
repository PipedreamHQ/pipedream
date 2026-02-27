import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import { doubleEncode } from "../../common/utils.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Delete meeting",
  description: "Delete a meeting. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingdelete)",
  key: "zoom_admin-delete-meeting",
  version: "0.1.9",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    zoomAdmin,
    meeting: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
    },
    occurrence: {
      propDefinition: [
        zoomAdmin,
        "occurrence",
        ({ meeting }) => ({
          meeting,
        }),
      ],
      description: "If you select a value for this param, only that instance will be deleted. Otherwise, the entire meeting series will be deleted.",
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
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "DELETE",
      path: `/meetings/${doubleEncode(get(this.meeting, "value", this.meeting))}`,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
        schedule_for_reminder: this.scheduleForReminder,
        cancel_meeting_reminder: this.cancelMeetingReminder,
      },
    }));

    if (this.occurrence) {
      $.export("$summary", `The occurrence "${get(this.occurrence, "label", this.occurrence)}" related to the meeting "${get(this.meeting, "label", this.meeting)}" was successfully deleted`);
    } else {
      $.export("$summary", `The meeting "${get(this.meeting, "label", this.meeting)}" was successfully deleted`);
    }

    return res;
  },
};
