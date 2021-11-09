import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Delete webinar",
  description: "Delete a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinardelete)",
  key: "zoom_admin-action-delete-webinar",
  version: "0.0.3",
  type: "action",
  props: {
    zoomAdmin,
    webinar: {
      propDefinition: [
        zoomAdmin,
        "webinars",
      ],
      type: "string",
    },
    occurrenceId: {
      propDefinition: [
        zoomAdmin,
        "occurrenceId",
        ({ webinar }) => ({
          meeting: webinar,
          isWebinar: true,
        }),
      ],
      description: "The [meeting occurrence ID](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar). If you send this param, just the occurrence will be deleted. Otherwise, the entire webinar will be deleted",
    },
    cancelMeetingReminder: {
      type: "boolean",
      label: "Cancel Meeting Reminder",
      description: "If `true`, notify registrants about the webinar cancellation via email. If `false`, do not send any email notification to webinar registrants.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "DELETE",
      path: `/webinars/${get(this.webinar, "value", this.webinar)}`,
      params: {
        occurrence_id: this.occurrenceId,
        cancel_meeting_reminder: this.cancelMeetingReminder,
      },
    }));

    if (this.occurrenceId) {
      $.export("$summary", `The occurrence "${this.occurrenceId}" related to the webinar "${get(this.webinar, "label", this.webinar)}" was successfully deleted`);

    } else {
      $.export("$summary", `The webinar "${get(this.webinar, "label", this.webinar)}" was successfully deleted`);
    }

    return res;
  },
};
