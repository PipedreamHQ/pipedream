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
      type: "string",
      label: "Occurrence ID",
      description: "The meeting occurrence ID.",
      optional: true,
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
        type: this.type,
        page_size: this.pageSize,
        page_number: this.pageNumber,
        next_page_token: this.nextPageToken,
      },
    }));

    $.export("$summary", `The meeting "${get(this.meetingId, "label", this.meetingId)}" was successfully deleted`);

    return res;
  },
};
