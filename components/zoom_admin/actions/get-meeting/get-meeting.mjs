import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Get Meeting",
  description: "Retrieve the details of a meeting. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meeting)",
  key: "zoom_admin-get-meeting",
  version: "0.1.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
      path: `/meetings/${get(this.meeting, "value", this.meeting)}`,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
        show_previous_occurrences: this.showPreviousOccurrences,
      },
    }));

    if (this.occurrence) {
      $.export("$summary", `The details of the occurrence "${get(this.occurrence, "label", this.occurrence)}" of the meeting "${get(this.meeting, "label", this.meeting)}" successfully fetched`);
    } else {
      $.export("$summary", `"${get(this.meeting, "label", this.meeting)}" meeting details successfully fetched`);
    }

    return res;
  },
};
