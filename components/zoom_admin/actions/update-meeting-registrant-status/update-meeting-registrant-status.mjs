import zoomAdmin from "../../zoom_admin.app.mjs";
import get from "lodash/get.js";
import isObject from "lodash/isObject.js";
import { axios } from "@pipedream/platform";
import consts from "../../consts.mjs";

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
    occurrence: {
      propDefinition: [
        zoomAdmin,
        "occurrence",
        ({ meeting }) => ({
          meeting,
        }),
      ],
      description: "If you select a value for this param, only that instance will be updated. Otherwise, the entire meeting series will be updated.",
    },
    registrants: {
      propDefinition: [
        zoomAdmin,
        "registrants",
        ({
          meeting,
          occurrence,
        }) => ({
          meeting,
          occurrence,
        }),
      ],
    },
    action: {
      type: "string",
      label: "Action",
      description: "Registrant Status",
      options: consts.UPDATE_MEETING_REGISTRANT_ACTION_OPTIONS,
    },
  },
  async run ({ $ }) {
    const registrants = isObject(this.registrants)
      ? this.registrants
      : JSON.parse(this.registrants);

    const res = await axios($, this.zoomAdmin._getAxiosParams({
      method: "PUT",
      path: `/meetings/${get(this.meeting, "value", this.meeting)}/registrants/status`,
      params: {
        occurrence_id: get(this.occurrence, "value", this.occurrence),
      },
      body: {
        action: this.action,
        registrants,
      },
    }));

    if (registrants.length === 1) {
      $.export("$summary", "Registrant status successfully changed");
    } else {
      $.export("$summary", "Registrants statuses successfully changed");
    }

    return res;
  },
};
