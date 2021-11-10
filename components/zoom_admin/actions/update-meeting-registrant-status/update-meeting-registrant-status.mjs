import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import { axios } from "@pipedream/platform";

export default {
  name: "Update Meeting Registrant Status",
  description: "Update registrant status for a meeting. [See the docs here](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrantstatus)",
  key: "zoom_admin-action-update-meeting-registrant-status",
  version: "0.0.1",
  type: "action",
  props: {
    zoomAdmin,
    meeting: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
    },
    occurrenceId: {
      propDefinition: [
        zoomAdmin,
        "occurrenceId",
        ({ meeting }) => ({
          meeting,
        }),
      ],
      description: "The [meeting occurrence ID](https://support.zoom.us/hc/en-us/articles/214973206-Scheduling-Recurring-Meetings). If you send this param, just the occurrence will be deleted. Otherwise, the entire meeting will be deleted",
    },
    registrants: {
      propDefinition: [
        zoomAdmin,
        "registrants",
        ({
          meeting,
          occurrenceId,
        }) => ({
          meeting,
          occurrenceId,
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
      path: `/meetings/${get(this.meeting, "value", this.meeting)}/registrants/status`,
      params: {
        occurrence_id: this.occurrenceId,
      },
      body: {
        action: this.action,
        registrants: this.registrants,
      },
    }));

    if (this.registrants.length === 1) {
      $.export("$summary", "Registrant status successfully changed");
    } else {
      $.export("$summary", "Registrants statuses successfully changed");
    }

    return res;
  },
};
