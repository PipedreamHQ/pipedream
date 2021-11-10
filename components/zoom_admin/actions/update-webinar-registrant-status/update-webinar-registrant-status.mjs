import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Update Webinar Registrant Status",
  description: "Update registrant status for a webinar. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrantstatus)",
  key: "zoom_admin-action-update-webinar-registrant-status",
  version: "0.0.4",
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
      type: "string[]",
      description: "The [webinar occurrence ID](https://support.zoom.us/hc/en-us/articles/216354763-How-to-Schedule-A-Recurring-Webinar).",
    },
    registrants: {
      propDefinition: [
        zoomAdmin,
        "registrants",
        ({
          webinar,
          occurrenceId,
        }) => ({
          meeting: webinar,
          occurrenceId,
          isWebinar: true,
        }),
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "Registrant Status",
      options: [
        "approve",
        "cancel",
        "deny",
      ],
    },
  },
  async run ({ $ }) {
    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "PUT",
      path: `/webinar/${get(this.webinar, "value", this.webinar)}/registrants/status`,
      params: {
        occurrence_id: this.occurrenceId,
      },
      body: {
        action: this.action,
        registrants: this.registrants,
      },
    }));

    $.export("$summary", "Registrant(s) status(es) successfully changed");

    return res;
  },
};
