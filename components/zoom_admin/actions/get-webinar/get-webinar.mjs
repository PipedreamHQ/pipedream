import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Get Webinar",
  description: "Retrieve the details of a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/webinars/webinar)",
  key: "zoom_admin-action-get-webinar",
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
    },
    showPreviousOccurrences: {
      type: "boolean",
      label: "Show Previous Occurrences",
      description: "Set the value of this field to `true` if you would like to view meeting details of all previous occurrences of a [recurring webinar](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar).",
      optional: true,
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "GET",
      path: `/webinars/${get(this.webinar, "value", this.webinar)}`,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
        show_previous_occurrences: this.showPreviousOccurrences,
      },
    }));

    if (this.occurrence) {
      $.export("$summary", `The details of the occurrence "${get(this.occurrence, "label", this.occurrence)}" of the webinar "${get(this.webinar, "label", this.webinar)}" successfully fetched`);
    } else {
      $.export("$summary", `"${get(this.webinar, "label", this.webinar)}" webinar details successfully fetched`);
    }

    return res;
  },
};
