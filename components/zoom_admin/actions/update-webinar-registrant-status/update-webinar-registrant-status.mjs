import { axios } from "@pipedream/platform";
import get from "lodash/get.js";
import isObject from "lodash/isObject.js";
import consts from "../../consts.mjs";
import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  name: "Update Webinar Registrant Status",
  description: "Update registrant status for a webinar. [See the documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api/meetings/meetingregistrantstatus)",
  key: "zoom_admin-update-webinar-registrant-status",
  version: "0.1.7",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      type: "string[]",
    },
    registrants: {
      propDefinition: [
        zoomAdmin,
        "registrants",
        ({
          webinar,
          occurrence,
        }) => ({
          meeting: webinar,
          occurrence,
          isWebinar: true,
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
      path: `/webinar/${get(this.webinar, "value", this.webinar)}/registrants/status`,
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
