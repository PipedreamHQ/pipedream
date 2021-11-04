import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Get Meeting",
  description: "Retrieve the details of a meeting. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meeting)",
  key: "zoom-admin-action-get-meeting",
  version: "0.0.3",
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
    },
    showPreviousOccurrences: {
      type: "boolean",
      label: "Show Previous Occurrences",
      description: "Set the value of this field to `true` if you would like to view meeting details of all previous occurrences of a [recurring meeting](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings).",
      optional: true,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: `/meetings/${get(this.meetingId, "value", this.meetingId)}`,
      params: {
        occurrence_id: this.occurrenceId,
        show_previous_occurrences: this.showPreviousOccurrences,
      },
    }));

    $.export("$summary", `"${get(this.meetingId, "label", this.meetingId)}" meeting details successfully fetched`);

    return res;
  },
};
