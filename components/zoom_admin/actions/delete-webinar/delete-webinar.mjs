import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Delete webinar",
  description: "Delete a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinardelete)",
  key: "zoom_admin-action-delete-webinar",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    webinar: {
      propDefinition: [
        zoomAdmin,
        "webinar",
      ],
    },
    occurrence: {
      propDefinition: [
        zoomAdmin,
        "occurrence",
        ({ webinar }) => ({
          meeting: webinar,
          isWebinar: true,
        }),
      ],
      description: "The [webinar occurrence ID](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar).",
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
        occurrence_id: get(this.occurrence, "value", this.occurrence),
        cancel_meeting_reminder: this.cancelMeetingReminder,
      },
    }));

    if (this.occurrence) {
      $.export("$summary", `The occurrence "${get(this.occurrence, "label", this.occurrence)}" related to the webinar "${get(this.webinar, "label", this.webinar)}" was successfully deleted`);
    } else {
      $.export("$summary", `The webinar "${get(this.webinar, "label", this.webinar)}" was successfully deleted`);
    }

    return res;
  },
};
